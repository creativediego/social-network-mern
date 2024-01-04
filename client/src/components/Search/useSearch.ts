import { useState, useCallback, useEffect, useRef } from 'react';
import { useAlert } from '../../hooks/useAlert';
import { set } from 'react-hook-form';

export interface SearchData<T> {
  searchValue: string;
  setSearch: (val: string) => void;
  searchResults: T[];
  searchLoading: boolean;
}

export const useSearch = <T>(
  APICall: (searchValue: string) => Promise<T[]>,
  initialSearchValue?: string
): SearchData<T> => {
  const [searchValue, setSearchValue] = useState(initialSearchValue || '');
  const [searchResults, setResults] = useState<T[]>([]);
  const [searchLoading, setLoading] = useState(false);
  const isMounted = useRef(true);
  const { setError } = useAlert();

  const setSearch = useCallback((val: string) => {
    setSearchValue(val);
    setResults([]);
  }, []);

  useEffect(() => {
    isMounted.current = true;
    const findData = async () => {
      const validAlphaChars = new RegExp(/^[a-z]*[A-Z]*$/);
      if (!searchValue || !searchValue.match(validAlphaChars)) {
        return;
      }
      setResults([]);
      setLoading(true);
      try {
        const data = await APICall(searchValue);
        setLoading(false);
        if (isMounted.current) {
          setResults(data);
        }
      } catch (err) {
        setLoading(false);
        const error = err as Error;
        setError(error.message);
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
    setSearch,
    searchResults,
    searchLoading,
  };
};
