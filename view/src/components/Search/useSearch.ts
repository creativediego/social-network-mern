import { useState, useCallback, useEffect } from 'react';
import { ResponseError } from '../../interfaces/IError';
import { setGlobalError } from '../../redux/alertSlice';
import { useAppDispatch } from '../../redux/hooks';
import { isError } from '../../services/helpers';

export const useSearch = <T>(
  APICall: (searchValue: string) => Promise<T[] | ResponseError>
) => {
  const dispatch = useAppDispatch();
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setResults] = useState<T[]>([]);
  const [searchLoading, setLoading] = useState(false);

  const handleSetSearchValue = useCallback((val: string) => {
    setSearchValue(val);
  }, []);

  useEffect(() => {
    let mounted = true;
    const findData = async () => {
      if (!searchValue) {
        return;
      }
      setLoading(true);
      const data = await APICall(searchValue);
      if (!mounted) {
        return;
      }
      setLoading(false);
      if (isError(data)) {
        dispatch(setGlobalError(data.error));
      } else {
        setResults(data);
      }
    };
    findData();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  return {
    searchValue,
    setSearch: handleSetSearchValue,
    searchResults,
    searchLoading,
  };
};
