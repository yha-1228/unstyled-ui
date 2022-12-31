import { useState, useCallback } from 'react';

export function useElements<T extends HTMLElement>() {
  const [elements, setElements] = useState<T[]>([]);

  const ref = useCallback((node: T) => {
    if (node !== null) {
      setElements((prev) => [...prev, node]);
    }
  }, []);

  return {
    elements,
    ref,
  };
}
