import React from 'react';
import { useControlableState } from '../../hooks/use-controlable-state';
import { createContext } from '../../utils/react';

// ---

type CollapseContextValue = {
  isOpen: boolean;
  toggle: () => void;
};

export const [CollapseContext, useCollapseContext] =
  createContext<CollapseContextValue>({
    hookName: 'useCollapseContext',
    providerName: 'Collapse',
  });

type CollapseProviderProps = React.ComponentPropsWithRef<'div'> & {
  /**
   * @default true
   */
  defaultIsOpen?: boolean;
  /**
   * Contolled state
   */
  isOpen?: boolean;
};

const CollapseProvider = React.forwardRef<
  HTMLDivElement,
  CollapseProviderProps
>((props, ref) => {
  const { defaultIsOpen = true, isOpen: isOpenProp, ...divProps } = props;

  const [isOpen, setIsOpen] = useControlableState(defaultIsOpen, isOpenProp);

  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <CollapseContext.Provider value={{ isOpen, toggle }}>
      <div {...divProps} ref={ref} />
    </CollapseContext.Provider>
  );
});

CollapseProvider.displayName = 'CollapseProvider';

// ---

type CollapseTriggerProps = Omit<
  React.ComponentPropsWithRef<'button'>,
  'type' | 'children'
> & {
  children?: ((isOpen?: boolean) => React.ReactNode) | React.ReactNode;
};

const CollapseTrigger = React.forwardRef<
  HTMLButtonElement,
  CollapseTriggerProps
>(({ children, onClick, ...rest }, ref) => {
  const { isOpen, toggle } = useCollapseContext();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    toggle();
    onClick?.(e);
  };

  const renderChilden = () => {
    if (typeof children === 'function') {
      return children(isOpen);
    } else {
      return children;
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-expanded={isOpen}
      data-state={isOpen ? 'open' : 'closed'}
      {...rest}
      ref={ref}
    >
      {renderChilden()}
    </button>
  );
});

CollapseTrigger.displayName = 'CollapseTrigger';

// ---

type CollapseContentProps = React.ComponentPropsWithRef<'div'>;

const CollapseContent = React.forwardRef<HTMLDivElement, CollapseContentProps>(
  ({ style: styleProp, ...rest }, ref) => {
    const { isOpen } = useCollapseContext();

    const style: React.CSSProperties | undefined = !isOpen
      ? { ...styleProp, display: 'none' }
      : styleProp;

    return (
      <div
        style={style}
        data-state={isOpen ? 'open' : 'closed'}
        {...rest}
        ref={ref}
      />
    );
  }
);

CollapseContent.displayName = 'CollapseContent';

// ---

/**
 * @example
 * ```tsx
 * <Collapse>
 *   <header>
 *     <Collapse.Trigger>
 *       {(isOpen) => <span>{isOpen ? 'Close' : 'Open'}</span>}
 *     </Collapse.Trigger>
 *   </header>
 *
 *   <Collapse.Content>
 *     Lorem ipsum dolor sit amet consectetur, adipisicing elit. In excepturi autem aperiam,
 *     unde laboriosam, non ullam nihil voluptas labore voluptatum deleniti mollitia quas,
 *     ipsam ratione! Aliquid tempore quia at temporibus.
 *   </Collapse.Content>
 * </Collapse>
 * ```
 */
export const Collapse = Object.assign(CollapseProvider, {
  Trigger: CollapseTrigger,
  Content: CollapseContent,
});
