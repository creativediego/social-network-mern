import { memo } from 'react';
import '.././Posts.scss';

/**
 * `ReactionButtonProps` is the props object passed to the `ReactionButton` component.
 *
 * @typedef {Object} ReactionButtonProps
 * @property {string} cssClass - The CSS class to apply to the button.
 * @property {() => void} handleClick - The function to call when the button is clicked.
 * @property {boolean} disabled - Whether the button is disabled.
 * @property {number} [reactions] - Optional number of reactions.
 */
interface ReactionButtonProps {
  cssClass: string;
  handleClick: () => void;
  disabled: boolean;
  reactions?: number;
}

/**
 * `ReactionButton` is a component that displays a reaction button.
 *
 * @component
 * @example
 * Example usage of ReactionButton component
 * <ReactionButton cssClass="like-button" handleClick={handleLike} disabled={false} reactions={10} />
 *
 * @param {ReactionButtonProps} props - The properties that define the ReactionButton component.
 *
 * @returns {JSX.Element} A JSX element representing the reaction button.
 */
const ReactionButton = ({
  cssClass,
  reactions,
  handleClick,
  disabled,
}: ReactionButtonProps): JSX.Element => {
  return (
    <div className='col'>
      <button
        aria-disabled={true}
        className='btn p-0 m-0'
        data-testid='ttr-like-btn'
        onClick={handleClick}
        disabled={disabled}
      >
        <i className={`${cssClass} ttr-stat-icon`}>
          <span className='mx-1'>{reactions}</span>
        </i>
      </button>
    </div>
  );
};

export default memo(ReactionButton);
