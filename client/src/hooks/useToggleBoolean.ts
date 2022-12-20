import { useCallback, useState } from 'react';

/**
 * Custom hook that manages the state of a toggling a boolean.
 * @param initialState true/false
 * @returns the state, and set state of the boolean.
 */
const useToggleBoolean = (initialState: boolean) => {
  const [bool, setBool] = useState(initialState);
  const toggle = useCallback(() => {
    setBool(!bool);
  }, [bool]);
  return [bool, toggle] as const;
};

export default useToggleBoolean;
