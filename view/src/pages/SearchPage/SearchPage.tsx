import * as React from 'react';
import { Nav } from 'react-bootstrap';
import { Search, Loader, Tuits } from '../../components';
import { useAppSelector } from '../../redux/hooks';
import { selectAllTuits } from '../../redux/postSlice';
import PeopleSearchResults from './PeopleSearchResults';
import useSearchResults from './useSearchResults';

const SearchPage = (): JSX.Element => {
  const {
    queryValue,
    handleSetQueryValue,
    queryType,
    handleSetQueryType,
    results,
    loading,
  } = useSearchResults('top');
  const reduxTuits = useAppSelector(selectAllTuits);
  return (
    <>
      <Search
        searchValue={queryValue}
        setSearchValue={handleSetQueryValue}
        placeHolder='Search Tuiter'
      />
      <Nav variant='tabs' defaultActiveKey={queryType} className='mt-3'>
        {results &&
          Object.keys(results).map((category: string, index) => (
            <Nav.Item key={index}>
              <Nav.Link
                eventKey={category}
                onClick={async () => {
                  if (queryValue) {
                    handleSetQueryType(category);
                  }
                }}
              >
                {category}
              </Nav.Link>
            </Nav.Item>
          ))}
      </Nav>
      <h1 className='mt-4'>Search Results</h1>
      <Loader loading={loading} />
      {!loading && (
        <div className='mt-2'>
          {!queryValue && !results && <p>Enter a search term.</p>}

          {queryValue &&
            results &&
            results.posts.length < 1 &&
            results.users.length < 1 && <p>Sorry, no results</p>}

          {results &&
            results.users &&
            results.users.length > 0 &&
            (queryType === 'top' || queryType === 'users') && (
              <div>
                <h5>People</h5>
                <PeopleSearchResults users={results.users} />
              </div>
            )}

          {results &&
            results.posts &&
            results.posts.length > 0 &&
            (queryType === 'top' || queryType === 'tuits') && (
              <div>
                <h5>Tuits</h5>
                <Tuits tuits={reduxTuits} showOptions={false} />
              </div>
            )}
        </div>
      )}
    </>
  );
};

export default SearchPage;
