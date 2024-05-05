// useSearch.ts
import { useState, useEffect } from 'react';
import { ISearchService } from '../../../interfaces/ISearchService';
import { useSearchParams } from 'react-router-dom';
import { useAlert } from '../../../hooks/useAlert';
import { useIsMounted } from '../../../hooks/useIsMounted';
import { set } from 'react-hook-form';

/**
 * `useSearch` is a custom hook that manages search functionality.
 *
 * It uses the `useState` and `useEffect` hooks to manage the search results, query, and loading state.
 * It also uses the `useSearchParams` hook to manage the search parameters in the URL.
 * It uses the `useAlert` hook to manage errors.
 *
 * @hook
 * @example
 * Example usage of useSearch hook
 * const { results, query, setQuery, loading } = useSearch(searchService, initialResults);
 *
 * @template T The type of the search results.
 * @param {ISearchService<T>} searchService - The service to use for the search.
 * @param {T} initialResults - The initial search results.
 *
 * @returns {{
 *   results: T,
 *   query: string,
 *   setQuery: React.Dispatch<React.SetStateAction<string>>,
 *   loading: boolean
 * }} An object containing the search results, the current query, a function to set the query, and a loading state for the search.
 */
export function useSearch<T>(
  searchService: ISearchService<T>,
  initialResults: T
): {
  results: T;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  searchPerformed: boolean;
} {
  const [results, setResults] = useState<T>(initialResults);
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState<string>(searchParams.get('q') || '');
  const [loading, setLoading] = useState<boolean>(false);
  const [searchPerformed, setSearchPerformed] = useState<boolean>(false);
  const isMounted = useIsMounted();
  const { clearErrors, setError } = useAlert();

  // Validate the query to prevent XSS. Only allow alpha characters. No special characters, spaces, symbols, numbers, etc.
  const queryIsValid = (query: string) => {
    const validAlphaChars = new RegExp(/^[a-z]*[A-Z]*$/);
    return query.match(validAlphaChars);
  };

  // Fetch search results when the query changes.
  useEffect(() => {
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
          setSearchPerformed(true);
          if (isMounted) {
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

    // Debounce the search to prevent spamming the API. Only search after 500ms of no typing.
    const handler = setTimeout(() => {
      fetchData();
    }, 500);
    // Cleanup function to clear the timeout from the previous render.
    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]); // Only re-run the effect if query changes.

  useEffect(() => {
    const query = searchParams.get('q') || '';
    setQuery(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]); // Only re-run the effect if searchParams changes.

  return { results, query, setQuery, loading, searchPerformed };
}
