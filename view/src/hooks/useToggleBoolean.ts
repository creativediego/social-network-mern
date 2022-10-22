import { useCallback, useState } from 'react';

const useToggleBoolean = (initialState: boolean) => {
  const [bool, setBool] = useState(initialState);
  const toggle = useCallback(() => {
    setBool(!bool);
  }, [bool]);
  return [bool, toggle] as const;
};

export default useToggleBoolean;
