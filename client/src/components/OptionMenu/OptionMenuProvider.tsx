import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
} from 'react';
import useToggle from '../../hooks/useToggle';

/**
 * OptionItem interface.
 *
 * This interface represents an option in the option menu.
 *
 * @interface
 * @property {string} label - The label of the option.
 * @property {string} [icon] - The icon of the option.
 * @property {'primary' | 'danger' | 'success' | 'warning' | 'info' | 'dark'} color - The color of the option.
 * @property {() => void} action - The action to perform when the option is selected.
 */
export interface OptionItem {
  label: string;
  icon?: string;
  color: 'primary' | 'danger' | 'success' | 'warning' | 'info' | 'dark';
  action: () => void;
}

/**
 * OptionMenuContextType interface.
 *
 * This interface represents the context for the option menu.
 *
 * @interface
 * @property {OptionItem[]} options - The options in the option menu.
 * @property {boolean} showMenu - Whether the option menu is shown.
 * @property {() => void} toggleShowMenu - The function to toggle the visibility of the option menu.
 * @property {(option: OptionItem) => void} addOption - The function to add an option to the option menu.
 * @property {(label: string) => void} removeOption - The function to remove an option from the option menu by its label.
 */
export interface OptionMenuContextType {
  options: OptionItem[];
  showMenu: boolean;
  toggleShowMenu: () => void;
  addOption: (option: OptionItem) => void;
  removeOption: (label: string) => void;
}

export const OptionMenuContext = createContext<OptionMenuContextType | null>(
  null
);

/**
 * OptionMenuProvider component.
 *
 * This component provides the option menu state and functions to child components
 * through the `OptionMenuContext`. It uses the `useState` and `useCallback` hooks
 * from React to manage the state and functions.
 *
 * The `addOption` function adds a new option to the options state.
 * The `removeOption` function removes an option from the options state by its label.
 *
 * @param {{ children: ReactNode }} props - The props.
 * @param {ReactNode} props.children - The child components.
 * @returns {JSX.Element} The `OptionMenuContext.Provider` component with the `children` and the context value.
 */
export const OptionMenuProvider = ({ children }: { children: ReactNode }) => {
  const [options, setOptions] = useState<OptionItem[]>([]);
  const [showMenu, toggleShowMenu] = useToggle(false);

  const addOption = useCallback(
    (option: OptionItem) =>
      setOptions((prevOptions) => [...prevOptions, option]),
    []
  );

  const removeOption = useCallback(
    (label: string) =>
      setOptions((prevOptions) =>
        prevOptions.filter((option: OptionItem) => option.label !== label)
      ),
    []
  );

  const menuValues = {
    showMenu,
    toggleShowMenu,
    options,
    addOption,
    removeOption,
  };

  return (
    <OptionMenuContext.Provider value={menuValues}>
      {children}
    </OptionMenuContext.Provider>
  );
};

export const useOptionMenu = () => {
  const context = useContext(OptionMenuContext);
  if (!context) {
    throw Error('useContextMenu must be used inside ContextMenuProvider');
  }
  return context;
};
