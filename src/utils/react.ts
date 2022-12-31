import React, {
  ForwardRefRenderFunction,
  ForwardRefExoticComponent,
  PropsWithoutRef,
  RefAttributes,
} from 'react';

export function forwardRefWithName<T, P = unknown>(
  displayName: string,
  render: ForwardRefRenderFunction<T, P>
): ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>> {
  const component = React.forwardRef(render);

  component.displayName = displayName;

  return component;
}

export const contextFactory = <T>() =>
  React.createContext<T | undefined>(undefined);

export const contextHookFactory = <T>(
  context: React.Context<T | undefined>,
  errorMessage?: string
): (() => T) => {
  return function () {
    const ctx = React.useContext(context);
    if (ctx === undefined) throw new Error(errorMessage);
    return ctx;
  };
};
