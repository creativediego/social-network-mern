import { useLayoutEffect, useRef } from 'react';

/**
 * `useScrollToBottom` is a custom hook that manages the scrolling of a chat window.
 * It uses the `useRef` and `useLayoutEffect` hooks from React to create a reference to the chat window and to scroll to the bottom of the chat window when the loading state changes.
 *
 * @param {boolean} loading - The loading state of the chat. The chat window is scrolled to the bottom when loading is false.
 *
 * @returns {object} An object containing the following values:
 * - `windowRef`: A reference to the chat window. This can be attached to a `div` element to allow the hook to control its scroll position.
 *
 * @example
 * const { windowRef } = useScrollToBottom(loading);
 *
 * @see {@link useLayoutEffect} for the hook that allows side effects to be performed synchronously after all DOM mutations.
 * @see {@link useRef} for the hook that allows a mutable value to be stored that persists across re-renders.
 */
const useScrollToBottom = (
  loading: boolean
): { windowRef: React.RefObject<HTMLDivElement> } => {
  const windowRef = useRef<null | HTMLDivElement>(null);
  const scrollToBottom = () => {
    if (windowRef.current)
      windowRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
      });
  };
  useLayoutEffect(() => {
    if (!loading) {
      scrollToBottom();
    }
  });

  return { windowRef };
};

export default useScrollToBottom;
