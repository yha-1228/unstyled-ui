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

/**
 * Return `[context, context hook]`
 */
export const createContext = <ContextValue>(option?: {
  defaultValue?: ContextValue;
  hookName?: string;
  providerName?: string;
}) => {
  const Context = React.createContext<ContextValue | undefined>(
    option?.defaultValue
  );

  function useContext(): ContextValue {
    const ctx = React.useContext<ContextValue | undefined>(Context);
    if (!ctx) {
      const hook = option?.hookName || 'This hook';
      const provider = option?.providerName
        ? `<${option?.providerName} />`
        : 'provider';
      const msg = `${hook} has to be used within ${provider}`;
      throw new Error(msg);
    }
    return ctx;
  }

  return [Context, useContext] as const;
};
