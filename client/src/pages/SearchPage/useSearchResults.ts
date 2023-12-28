import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearch } from '../../components/Search/useSearch';
import { useAppDispatch } from '../../redux/hooks';
import { setAllPosts } from '../../redux/postSlice';
import { APIfindAllByKeyword } from '../../services/searchAPI';
import { ISearchResults } from '../../interfaces/ISearchResults';

const useSearchResults = (defaultQueryType: string) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [queryValue] = useState(searchParams.get('q') || '');
  const [queryType, setQueryType] = useState(defaultQueryType);
  const dispatch = useAppDispatch();

  const { searchValue, searchResults, setSearch, searchLoading } =
    useSearch<ISearchResults>(
      (searchValue) => APIfindAllByKeyword(searchValue),
      queryValue
    );

  const handleSetQueryType = useCallback((type: string) => {
    setQueryType(type);
  }, []);

  useEffect(() => {
    setSearchParams({ q: searchValue });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  /**
   * Redux state of posts needs updating because results from useSearch are not stored in redux.
   */
  useEffect(() => {
    if (searchResults && searchResults.posts.length > 0) {
      dispatch(setAllPosts(searchResults.posts));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchResults?.posts, dispatch]);

  return {
    queryValue: searchValue,
    handleSetQueryValue: setSearch,
    queryType,
    handleSetQueryType,
    results: searchResults,
    loading: searchLoading,
  };
};

export default useSearchResults;
