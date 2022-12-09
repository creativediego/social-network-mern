import React from 'react';
import { useTuit } from '../../hooks/useTuit';
import './Tuits.scss';

/**
 * Shows the dropdown menu options when clicking the tuit ellipsis button.
 */
const TuitMoreButton = (): JSX.Element | null => {
  const { tuit, showMenu, handleShowMenu, handleDeleteTuit } = useTuit();
  return (
    tuit && (
      <>
        {showMenu && (
          <div
            className='ttr-dismiss-layer'
            onClick={() => handleShowMenu(false)}
          ></div>
        )}
        <div className='dropdown d-flex align-items-center justify-content-end position-relative'>
          <div className='btn' onClick={() => handleShowMenu(true)}>
            <i className='fa-solid fa-ellipsis'></i>
          </div>
          {showMenu && (
            <div className='position-absolute w-50 h-100 '>
              <ul className='trr-tuit-more-button dropdown-menu w-100 bg-black border border-white'>
                <li
                  className='text-danger'
                  onClick={() => handleDeleteTuit(tuit.id)}
                >
                  <span className='d-flex align-items-center'>
                    <i
                      className={`text-danger fa-duotone fa-trash-xmark btn fa-2x fs-6 `}
                    ></i>
                    Delete Tuit
                  </span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </>
    )
  );
};

export default TuitMoreButton;
