import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearch } from '../../components/Search/useSearch';
import { useAppDispatch } from '../../redux/hooks';
import { setAllTuits } from '../../redux/tuitSlice';
import { findAllByKeyword } from '../../services/search-service';

const useSearchResults = (defaultQueryType: string) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [queryValue] = useState(searchParams.get('q') || '');
  const [queryType, setQueryType] = useState(defaultQueryType);
  const dispatch = useAppDispatch();

  const { searchValue, searchResults, setSearch, searchLoading } = useSearch(
    (searchValue) => findAllByKeyword(searchValue),
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
   * Redux state of tuits needs updating because results from useSearch are not stored in redux.
   */
  useEffect(() => {
    if (searchResults && searchResults.tuits.length > 0) {
      dispatch(setAllTuits(searchResults.tuits));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchResults?.tuits, dispatch]);

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
