import * as React from 'react';
export const setClassWithTimeout = (
  setState: React.Dispatch<React.SetStateAction<string>>,
  className: string
): void => {
  setState(className);
  setTimeout(() => {
    setState('');
  }, 400);
};
