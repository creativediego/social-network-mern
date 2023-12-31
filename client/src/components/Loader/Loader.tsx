import React, { memo } from 'react';

/**
 * `LoaderProps` is an interface that defines the properties for the `Loader` component.
 *
 * @interface
 * @property {boolean} loading - A boolean indicating whether the loader is active. This is a required property.
 * @property {string} message - An optional message to display next to the loader.
 * @property {string} content - An optional string to display when the loader is inactive.
 * @property {string} size - An optional string to define the size of the loader.
 * @property {string} color - An optional string to define the color of the loader.
 */
interface LoaderProps {
  loading: boolean;
  message?: string;
  content?: string;
  size?: string;
  color?: string;
}

/**
 * `Loader` is a component that displays a spinning loader with an optional message and alternative content when the loader is inactive.
 *
 * @component
 * @example
 * Example usage of Loader component
 * <Loader loading={true} message="Loading..." size="fs-4" color="blue" />
 *
 * @param {LoaderProps} props - The properties that define the loader.
 * @param {boolean} props.loading - A boolean indicating whether the loader is active.
 * @param {string} props.message - An optional message to display next to the loader.
 * @param {JSX.Element} props.content - An optional JSX element to display when the loader is inactive.
 * @param {string} props.size - An optional string to define the size of the loader.
 * @param {string} props.color - An optional string to define the color of the loader.
 *
 * @returns {JSX.Element} A JSX element representing the loader.
 */
const Loader = ({
  loading,
  message,
  content,
  size,
  color,
}: LoaderProps): JSX.Element => {
  return (
    <span className='d-flex justify-content-center' data-testid='loader'>
      {loading && message ? <span className='me-2'>{message} </span> : null}
      {loading && (
        <span>
          <i
            className={`fas fa-spinner fa-pulse ${size ? size : 'fs-5'}`}
            style={{ color }}
          ></i>
        </span>
      )}
      {!loading && content}
    </span>
  );
};

export default memo(Loader);
