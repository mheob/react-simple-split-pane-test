import { useEffect } from 'react';

export const useEventListener = <T extends keyof WindowEventMap>(
  type: T,
  listener?: (this: Window, event: WindowEventMap[T]) => void
): void => {
  useEffect(() => {
    const abortController = new AbortController();

    if (!listener) return;

    window.addEventListener(type, listener);

    return (): void => {
      window.removeEventListener(type, listener);
      abortController.abort();
    };
  }, [type, listener]);
};
