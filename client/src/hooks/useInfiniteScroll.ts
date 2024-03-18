import { useState, useEffect, useRef, useCallback } from 'react';
import { IQueryParams } from '../interfaces/IQueryParams';

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
