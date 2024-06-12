import { useState } from 'react';
import { Nav, TabContent } from 'react-bootstrap';
import { Search, Loader, PostsList } from '../../components';
import { useSearch } from '../../components/Search/hooks/useSearch';
import { allSearchService } from '../../services/searchService';
import PeopleSearchResults from './PeopleSearchResults';
import { ISearchResults } from '../../interfaces/ISearchResults';

/**
 * `SearchPage` is a component that displays a search page.
 *
 * It uses the `useSearch` hook to perform a search and display the results.
 *
 * @component
 * @example
 * Example usage of SearchPage component
 * <SearchPage />
 *
 * @returns {JSX.Element} A JSX element representing the search page.
 */
const SearchPage = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const initialEmptyResults: ISearchResults = {
    users: [],
    posts: [],
  };
  const { query, setQuery, results, loading, searchPerformed } =
    useSearch<ISearchResults>(allSearchService, initialEmptyResults);
  /**
   * Toggles the active tab that filters the search results.
   * @param tab the tab type to toggle
   */
  const toggleTab = (tab: string) => {
    setActiveTab(tab);
  };

  /**
   * Renders the tab content based on the active tab.
   */
  const renderTabContent = () => {
    if (loading) {
      return <Loader loading={loading} />;
    }

    if (!searchPerformed) {
      return (
        <div className='text-center mt-5'>
          <h5>Try searching for a post or user keyword.</h5>
        </div>
      );
    }

    if (results.users.length === 0 && results.posts.length === 0) {
      return (
        <div className='text-center mt-5'>
          <h5>No results found.</h5>
        </div>
      );
    }

    switch (activeTab) {
      case 'all':
        return (
          <TabContent>
            {results.users.length > 0 && (
              <>
                <h4>People</h4>
                <PeopleSearchResults users={results.users} />
              </>
            )}
            {results.posts.length > 0 && (
              <>
                <h4>Posts</h4>
                <PostsList posts={results.posts} showOptions={false} />
              </>
            )}
          </TabContent>
        );

      case 'people':
        return results.users.length > 0 ? (
          <PeopleSearchResults users={results.users} />
        ) : (
          <p>No users found.</p>
        );

      case 'posts':
        return results.posts.length > 0 ? (
          <PostsList posts={results.posts} showOptions={false} />
        ) : (
          <p>No posts found.</p>
        );

      default:
        return (
          <div className='text-center mt-5'>
            <h5>No results found</h5>
          </div>
        );
    }
  };

  return (
    <div>
      <Search
        query={query}
        setQuery={setQuery}
        placeHolder='Search for users or posts'
      />

      <Nav variant='tabs' defaultActiveKey='all'>
        {['all', 'posts', 'people'].map((tab) => (
          <Nav.Item key={tab}>
            <Nav.Link
              eventKey={tab}
              active={activeTab === tab}
              onClick={() => toggleTab(tab)}
            >
              {/* Capitalize the first letter of the tab */}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>

      {renderTabContent()}
    </div>
  );
};

export default SearchPage;
