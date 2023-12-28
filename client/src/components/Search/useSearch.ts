import { useState, useCallback, useEffect, useRef } from 'react';
import { setGlobalError } from '../../redux/alertSlice';
import { useAppDispatch } from '../../redux/hooks';

export const useSearch = <T>(
  APICall: (searchValue: string) => Promise<T>,
  initialSearchValue?: string
) => {
  const dispatch = useAppDispatch();
  const [searchValue, setSearchValue] = useState(initialSearchValue || '');
  const [searchResults, setResults] = useState<T | null>(null);
  const [searchLoading, setLoading] = useState(false);
  const isMounted = useRef(true);

  const handleSetSearchValue = useCallback((val: string) => {
    setSearchValue(val);
  }, []);

  useEffect(() => {
    isMounted.current = true;
    const findData = async () => {
      const validAlphaChars = new RegExp(/^[a-z]*[A-Z]*$/);
      if (!searchValue || !searchValue.match(validAlphaChars)) {
        return;
      }
      setResults({} as T);
      setLoading(true);
      try {
        const data = await APICall(searchValue);
        setLoading(false);
        if (isMounted.current) {
          setResults(data);
        }
        console.log(data);
      } catch (err) {
        setLoading(false);
        const error = err as Error;
        dispatch(setGlobalError({ message: error.message }));
      }
    };
    findData();
    return () => {
      isMounted.current = false;
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
