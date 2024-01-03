import React, { useEffect, memo } from 'react';
import { OptionItem, useOptionMenu } from './OptionMenuProvider';

interface OptionMenuProps {
  customOptions: OptionItem[];
}

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
          <i className='fa-solid fa-ellipsis'></i>
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
