// useSearch.ts
import { useState, useEffect, useRef } from 'react';
import { ISearchService } from '../interfaces/ISearchService';
import { useSearchParams } from 'react-router-dom';
import { useAlert } from './useAlert';

export function useSearch<T>(
  searchService: ISearchService<T>,
  initialResults: T
): {
  results: T;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
} {
  const [results, setResults] = useState<T>(initialResults);
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState<string>(searchParams.get('q') || '');
  const [loading, setLoading] = useState<boolean>(false);
  const isMounted = useRef(false);
  const { clearErrors, setError } = useAlert();

  const queryIsValid = (query: string) => {
    const validAlphaChars = new RegExp(/^[a-z]*[A-Z]*$/);
    return query.match(validAlphaChars);
  };

  useEffect(() => {
    isMounted.current = true;
    const fetchData = async () => {
      try {
        if (query) {
          if (!queryIsValid(query)) {
            setError('Invalid search query.');
            return;
          }
          clearErrors();
          setSearchParams({ q: query });
          setLoading(true);
          const searchResults = await searchService.search(query);
          setLoading(false);
          if (isMounted.current) {
            setResults(searchResults);
          }
        } else {
          setResults(initialResults);
        }
      } catch (err) {
        setLoading(false);
        const error = err as Error;
        setError(error.message);
      }
    };
    fetchData();
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]); // Only re-run the effect if query changes.

  return { results, query, setQuery, loading };
}
