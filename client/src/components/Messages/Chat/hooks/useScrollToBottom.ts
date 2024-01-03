import { useLayoutEffect, useRef } from 'react';

/**
 * `useScrollToBottom` is a custom hook that manages scrolling to the bottom of a container.
 *
 * It uses the `useRef` hook to create a reference to the container.
 * It uses the `useLayoutEffect` hook to scroll to the bottom of the container when the `loading` state changes to false.
 *
 * @hook
 * @param {boolean} loading - A boolean indicating whether the content of the container is loading.
 * @example
 * Example usage of useScrollToBottom hook
 * const { windowRef } = useScrollToBottom(loading);
 *
 * @returns {{ windowRef: React.RefObject<HTMLDivElement> }} An object containing:
 * - `windowRef`: A reference to the container that should be scrolled to the bottom.
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
