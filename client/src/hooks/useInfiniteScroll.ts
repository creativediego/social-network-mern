import { useState, useEffect, useRef, useCallback } from 'react';
import { IQueryParams } from '../interfaces/IQueryParams';

/**
 * `useInfiniteScroll` is a custom hook that provides infinite scrolling functionality.
 * It takes in `fetchFunction`, `queryParams`, `loading`, and `hasMore` as arguments.
 * The `fetchFunction` function is used to fetch more data when the last element is in view.
 * The `queryParams` object is used as the query parameters for fetching data.
 * The `loading` boolean is used to prevent fetching more data while data is still loading.
 * The `hasMore` boolean is used to prevent fetching more data when there is no more data to fetch.
 * The hook uses the `useState`, `useEffect`, `useRef`, and `useCallback` hooks from React to manage the infinite scrolling.
 * The hook returns `lastElementRef` which should be attached to the last element in the list.
 *
 * @param {(queryParams: IQueryParams) => Promise<void>} fetchFunction - The function to fetch more data.
 * @param {IQueryParams} queryParams - The query parameters for fetching data.
 * @param {boolean} loading - Whether data is still loading.
 * @param {boolean} hasMore - Whether there is more data to fetch.
 *
 * @returns {Object} The `lastElementRef` to attach to the last element in the list.
 *
 * @example
 * const lastElementRef = useInfiniteScroll(fetchFunction, queryParams, loading, hasMore);
 * <div ref={lastElementRef} />
 *
 * @see {@link useState} for the hook that manages the page state.
 * @see {@link useEffect} for the hook that sets up the Intersection Observer.
 * @see {@link useRef} for the hook that manages the Intersection Observer and last element refs.
 * @see {@link useCallback} for the hook that memoizes the `fetchMoreData` function.
 */

export function useInfiniteScroll(
  fetchFunction: (queryParams: IQueryParams) => Promise<void>,
  queryParams: IQueryParams,
  loading: boolean,
  hasMore: boolean
) {
  const [page, setPage] = useState(1);
  const observer = useRef<IntersectionObserver>(); // ref to intersection observer
  const lastElementRef = useRef<HTMLDivElement | null>(null); // last element ref to observe

  const fetchMoreData = useCallback(async () => {
    if (loading || !hasMore) return;
    const params = {
      ...queryParams,
      page: page + 1,
    };
    await fetchFunction(params);
  }, [loading, hasMore, fetchFunction, queryParams]);

  // Effect for setting up the Intersection Observer.
  useEffect(() => {
    // Do not set up observer if there are no more items to load.
    if (!hasMore) return;
    observer.current = new IntersectionObserver(
      (entries) => {
        // Trigger load more when the last element is visible.
        if (entries[0].isIntersecting && !loading) {
          fetchMoreData();
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0, rootMargin: '10px' }
    ); // threshold: 1.0 ensures the whole element is visible.

    const currentObserver = observer.current;
    const currentElement = lastElementRef.current;

    if (currentElement) {
      currentObserver.observe(currentElement);
    }

    // Cleanup function: Unobserve the current element.
    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, [fetchMoreData, hasMore, loading]);

  // Returning the state, loading flag, and the ref for the last element.
  return { lastElementRef };
}
