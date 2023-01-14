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

export const createContext = <ContextValue>() =>
  React.createContext<ContextValue | undefined>(undefined);

export const createContextHook = <ContextValue>(
  context: React.Context<ContextValue | undefined>,
  debugOption?: { hookName?: string; providerName?: string }
) => {
  function useContext(): ContextValue {
    const ctx = React.useContext<ContextValue | undefined>(context);
    if (!ctx) {
      const hook = debugOption?.hookName || 'This hook';
      const provider = debugOption?.providerName
        ? `<${debugOption?.providerName} />`
        : 'provider';
      const msg = `${hook} has to be used within ${provider}`;
      throw new Error(msg);
    }
    return ctx;
  }

  return useContext;
};
