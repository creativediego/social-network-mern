import React from 'react';
import { Nav, TabContent } from 'react-bootstrap';
import { Search, Loader, Posts } from '../../components';
import { useSearch } from '../../hooks/useSearch';
import { allSearchService } from '../../services/searchService';
import PeopleSearchResults from './PeopleSearchResults';
import { ISearchResults } from '../../interfaces/ISearchResults';

const SearchPage = (): JSX.Element => {
  const [activeTab, setActiveTab] = React.useState<string>('all'); // State to manage active tab
  const initialEmptyResults: ISearchResults = {
    users: [],
    posts: [],
  };
  const { query, setQuery, results, loading } = useSearch<ISearchResults>(
    allSearchService,
    initialEmptyResults
  );

  const toggleTab = (tab: string) => {
    setActiveTab(tab); // Set the active tab
  };

  return (
    <div>
      <Search
        searchValue={query}
        setSearchValue={setQuery}
        placeHolder='Search for users or posts'
      />

      <Nav variant='tabs' defaultActiveKey='all'>
        <Nav.Item>
          <Nav.Link
            eventKey='all'
            active={activeTab === 'all'}
            onClick={() => toggleTab('all')}
          >
            All
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey='posts'
            active={activeTab === 'posts'}
            onClick={() => toggleTab('posts')}
          >
            Posts
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey='people'
            active={activeTab === 'people'}
            onClick={() => toggleTab('people')}
          >
            People
          </Nav.Link>
        </Nav.Item>
      </Nav>
      {loading ? (
        <Loader loading={loading} />
      ) : (
        <TabContent>
          {results.users.length === 0 && results.posts.length === 0 && (
            <div className='text-center mt-5'>
              <h5>No results found</h5>
            </div>
          )}
          {activeTab === 'all' && (
            <>
              {results.users.length > 0 && (
                <>
                  <h3>People</h3>
                  <PeopleSearchResults users={results.users} />
                </>
              )}
              {results.posts.length > 0 && (
                <>
                  <h3>Posts</h3>
                  <Posts posts={results.posts} showOptions={false} />
                </>
              )}
            </>
          )}
          {activeTab === 'people' && (
            <PeopleSearchResults users={results.users} />
          )}
          {activeTab === 'posts' && (
            <Posts posts={results.posts} showOptions={false} />
          )}
        </TabContent>
      )}
    </div>
  );
};

export default SearchPage;
