import { useCallback, useState } from 'react';

export function useCallbackRef<T extends HTMLElement>() {
  const [element, setElement] = useState<T | null>(null);

  const ref = useCallback((node: T) => {
    if (node !== null) {
      setElement(node);
    }
  }, []);

  return [ref, element] as const;
}
