import { useCallback, useState } from 'react';

export function useNode<T extends HTMLElement>() {
  const [node, setNode] = useState<T | null>(null);

  const ref = useCallback((node: T) => {
    if (node !== null) {
      setNode(node);
    }
  }, []);

  return [ref, node] as const;
}
