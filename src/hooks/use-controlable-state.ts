import { useEffect, useState } from 'react';

export function useControlableState<S>(
  initialState: S | (() => S),
  stateProp: S | undefined
) {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    if (stateProp !== undefined) {
      setState(stateProp);
    }
  }, [stateProp]);

  return [state, setState] as const;
}
