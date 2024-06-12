import { useCallback, useState } from 'react';

/**
 * `useToggleAnimation` is a custom hook that provides a way to toggle an animation.
 * It takes in `onAnimationClass` and `time` as arguments.
 * The `onAnimationClass` is the CSS class to apply when the animation is on.
 * The `time` is the duration of the animation in milliseconds.
 * The hook uses the `useState` and `useCallback` hooks from React to manage the `animationClass` state and `handleAnimation` function.
 * The `handleAnimation` function sets the `animationClass` to `onAnimationClass`, waits for `time` milliseconds, and then sets the `animationClass` back to an empty string.
 * The hook returns an object with the `animationClass` state and `handleAnimation` function.
 *
 * @param {string} onAnimationClass - The CSS class to apply when the animation is on.
 * @param {number} time - The duration of the animation in milliseconds.
 *
 * @returns {Object} The `animationClass` state and `handleAnimation` function.
 * @property {string} animationClass - The current animation class.
 * @property {() => void} handleAnimation - The function to handle the animation.
 *
 * @example
 * const { animationClass, handleAnimation } = useToggleAnimation('onAnimationClass', 1000);
 * <div className={animationClass} onClick={handleAnimation} />
 *
 * @see {@link useState} for the hook that manages the `animationClass` state.
 * @see {@link useCallback} for the hook that memoizes the `handleAnimation` function.
 */

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
