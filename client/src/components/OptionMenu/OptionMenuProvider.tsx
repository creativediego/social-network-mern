import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
} from 'react';
import useToggle from '../../hooks/useToggle';

export interface OptionItem {
  label: string;
  icon?: string;
  color: 'primary' | 'danger' | 'success' | 'warning' | 'info' | 'dark';
  action: () => void;
}

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
