import { useEffect, useRef } from 'react';

/**
 * `useIsMounted` is a custom hook that provides a way to check if a component is currently mounted.
 * It uses the `useRef` and `useEffect` hooks from React to manage the mounted state.
 * The `isMounted` ref is initially set to `false` and is updated to `true` when the component mounts.
 * When the component unmounts, the `isMounted` ref is updated back to `false`.
 * The hook returns an object with the `isMounted` property which is the current mounted state of the component.
 *
 * @returns {Object} The `isMounted` property which is the current mounted state of the component.
 *
 * @example
 * const { isMounted } = useIsMounted();
 *
 * @see {@link useRef} for the hook that manages the `isMounted` ref.
 * @see {@link useEffect} for the hook that updates the `isMounted` ref when the component mounts and unmounts.
 */
export const useIsMounted = () => {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return { isMounted: isMounted.current };
};
