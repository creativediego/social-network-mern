import * as React from 'react';
import { Nav } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { Search, Loader } from '../../components';
import useSearchResults from './useSearchResults';
import { Tuits } from '../../components';
import PeopleSearchResults from './PeopleSearchResults';

const SearchPage = (): JSX.Element => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [queryType, setQueryType] = React.useState<string>(
    searchParams.get('type') || 'tuits'
  );
  const [searchValue, setSearchValue] = React.useState(
    searchParams.get('q') || ''
  );
  const [loading, searchData] = useSearchResults(queryType, searchValue);

  return (
    <>
      <Search
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        placeHolder='Search Tuiter'
      />
      <Nav
        variant='tabs'
        defaultActiveKey={queryType || 'tuits'}
        className='mt-3'
      >
        {Object.values(searchData).map((category: any, index) => (
          <Nav.Item key={index}>
            <Nav.Link
              eventKey={category.type}
              onClick={async () => {
                if (searchValue) {
                  setSearchParams({ q: searchValue, type: category.type });
                  setQueryType(category.type);
                }
              }}
            >
              {category.type}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
      <Loader loading={loading} />{' '}
      {!loading && (
        <>
          {Object.values(searchData[queryType].results).every(
            (results) => results.length < 1
          ) && (
            <div className='d-flex justify-content-center p-5'>
              {!searchValue && <p>Enter a search term.</p>}
              {searchValue && !loading && (
                <p>Your search did not match any results.</p>
              )}
            </div>
          )}
          {
            <div className='mt-2'>
              {searchData[queryType].results.users &&
                searchData[queryType].results.users.length > 0 && (
                  <div>
                    <h5>People</h5>
                    <PeopleSearchResults
                      users={searchData[queryType].results.users}
                    />
                  </div>
                )}
              {searchData[queryType].results.tuits &&
                searchData[queryType].results.tuits.length > 0 && (
                  <div>
                    <h5>Tuits</h5>
                    <Tuits tuits={searchData[queryType].results.tuits} />
                  </div>
                )}
            </div>
          }
        </>
      )}
    </>
  );
};

export default SearchPage;