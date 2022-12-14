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

  const handleSetQueryType = useCallback((type: string) => {
    setQueryType(type);
  }, []);

  const { searchValue, searchResults, setSearch, searchLoading } = useSearch(
    (searchValue) => findAllByKeyword(searchValue),
    queryValue
  );

  useEffect(() => {
    setSearchParams({ q: searchValue });
  }, [searchValue, setSearchParams]);

  useEffect(() => {
    if (searchResults && searchResults.tuits.length > 0) {
      dispatch(setAllTuits(searchResults.tuits));
    }
  }, [searchResults, searchResults?.tuits, dispatch]);

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
