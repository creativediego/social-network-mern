import { useState, useCallback } from 'react';

/**
 * `usePostOptions` is a custom hook that provides the functionality to show or hide post options.
 *
 * It uses the `useState` and `useCallback` hooks from React to manage the visibility of the post options.
 *
 * @hook
 * @example
 * Example usage of usePostOptions hook
 * const { showMenu, handleShowOptions } = usePostOptions();
 *
 * @returns {{ showMenu: boolean, handleShowOptions: Function }} An object containing the `showMenu` state and the `handleShowOptions` function.
 */
export const useShowOptions = (): {
  showMenu: boolean;
  handleShowOptions: Function;
} => {
  const [showMenu, setShowMenu] = useState(false);

  const handleShowOptions = useCallback((status: boolean) => {
    setShowMenu(status);
  }, []);

  return { showMenu, handleShowOptions };
};
