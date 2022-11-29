import { useCallback, useEffect, useState } from 'react';

export const useToggleAnimation = (onAnimationClass: string, time: number) => {
  const [animationClass, setAnimationClass] = useState('');

  const handleAnimation = useCallback(() => {
    setAnimationClass(onAnimationClass);
    setTimeout(() => {
      setAnimationClass('');
    }, time);
  }, [onAnimationClass, time]);

  return { animationClass, handleAnimation };
};
