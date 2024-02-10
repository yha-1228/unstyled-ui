import {
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  ReactNode,
  useId,
  useState,
  ComponentPropsWithRef,
  forwardRef,
  MouseEventHandler,
  ElementType,
} from 'react';

// internal
// ----------------------------------------

type UseDisclosureReturn = {
  open: boolean;
  panelId: string;
};

const DisclosureContext = createContext<UseDisclosureReturn | null>(null);

const useDisclosure = (component: string) => {
  const context = useContext(DisclosureContext);
  if (!context) {
    throw new Error(
      `<${component} />は<Disclosure />の内側で使わなければなりません。`
    );
  }
  return context;
};

type UseDisclosureUpdateReturn = {
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const DisclosureUpdateContext = createContext<UseDisclosureUpdateReturn | null>(
  null
);

const useDisclosureUpdate = (component: string) => {
  const context = useContext(DisclosureUpdateContext);
  if (!context) {
    throw new Error(
      `<${component} />は<Disclosure />の内側で使わなければなりません。`
    );
  }
  return context;
};

// ----------------------------------------

export type DisclosureProps = {
  /**
   * デフォルトで開くかどうか
   *
   * @default false
   */
  defaultOpen?: boolean;
  /**
   * Render propsを利用して、開閉状態(`open`)を含む要素を表示する
   */
  children?: ReactNode | (({ open }: { open: boolean }) => ReactNode);
};

export const Disclosure = (props: DisclosureProps) => {
  const { defaultOpen = false, children } = props;
  const id = useId();
  const panelId = `disclosure-panel-${id}`;
  const [open, setOpen] = useState(defaultOpen);

  return (
    <DisclosureContext.Provider value={{ open, panelId }}>
      <DisclosureUpdateContext.Provider value={{ setOpen }}>
        {children instanceof Function ? children({ open }) : children}
      </DisclosureUpdateContext.Provider>
    </DisclosureContext.Provider>
  );
};

// ----------------------------------------

export type DisclosureButtonProps = Omit<
  ComponentPropsWithRef<'button'>,
  'type' | 'aria-expanded' | 'aria-controls'
>;

export const DisclosureButton = forwardRef<
  HTMLButtonElement,
  DisclosureButtonProps
>((props, ref) => {
  const { onClick, ...restElementProps } = props;
  const { open, panelId } = useDisclosure('DisclosureButton');
  const { setOpen } = useDisclosureUpdate('DisclosureButton');

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    setOpen((prev) => !prev);
    onClick?.(event);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-expanded={open}
      aria-controls={panelId}
      {...restElementProps}
      ref={ref}
    />
  );
});

DisclosureButton.displayName = 'DisclosureButton';

// ----------------------------------------

export type DisclosurePanelProps = Omit<ComponentPropsWithRef<'div'>, 'id'> & {
  /**
   * レンダーする要素
   *
   * @default "div"
   */
  as?: ElementType;
};

export const DisclosurePanel = forwardRef<HTMLDivElement, DisclosurePanelProps>(
  (props, ref) => {
    const { as: Tag = 'div', ...elementProps } = props;
    const { style, ...restElementProps } = elementProps;
    const { open, panelId } = useDisclosure('DisclosurePanel');

    return (
      <Tag
        id={panelId}
        style={!open ? { ...style, display: 'none' } : style}
        {...restElementProps}
        ref={ref}
      />
    );
  }
);

DisclosurePanel.displayName = 'DisclosurePanel';
