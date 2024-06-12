import { useEffect, memo } from 'react';
import { OptionItem, useOptionMenu } from './OptionMenuProvider';

interface OptionMenuProps {
  customOptions: OptionItem[];
}

/**
 * `OptionMenu` is a component that renders a dropdown menu with custom options.
 * It uses the `useOptionMenu` custom hook to get the state and actions for the option menu, and the `useEffect` hook to add and remove the custom options when the component mounts and unmounts.
 *
 * @param {OptionMenuProps} props - The properties passed to the component.
 * @param {OptionItem[]} props.customOptions - The custom options to be added to the option menu.
 *
 * @returns {JSX.Element} The `OptionMenu` component, which includes a button to toggle the option menu and a dropdown menu with the options.
 *
 * @example
 * <OptionMenu customOptions={customOptions} />
 *
 * @see {@link useOptionMenu} for the custom hook that provides the state and actions for the option menu.
 * @see {@link OptionItem} for the interface of an option item.
 */
const OptionMenu = ({ customOptions }: OptionMenuProps) => {
  const { showMenu, toggleShowMenu, options, addOption, removeOption } =
    useOptionMenu();

  useEffect(() => {
    customOptions.forEach((option) => addOption(option));
    return () => customOptions.forEach((option) => removeOption(option.label));
  }, [addOption, removeOption, customOptions]);

  return (
    <>
      {showMenu && (
        <div className='ttr-dismiss-layer' onClick={toggleShowMenu}></div>
      )}
      <div className='dropdown d-flex align-items-center justify-content-end position-relative'>
        <div className='btn' onClick={toggleShowMenu}>
          <i className='fa-solid fa-ellipsis text'></i>
        </div>
        {showMenu && (
          <div className='position-absolute w-50 h-100 '>
            <ul className='trr-post-more-button dropdown-menu w-100 bg-black border border-white'>
              {options.map((option) => (
                <li key={option.label} onClick={option.action}>
                  <span
                    className={`d-flex align-items-center text-${option.color}`}
                  >
                    <i
                      className={`fa-duotone ${option.icon} btn fa-2x fs-6 text-${option.color}`}
                    ></i>
                    {option.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default memo(OptionMenu);
