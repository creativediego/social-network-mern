import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { ActionButton } from '..';

describe('ActionButton', () => {
  it('should render with default label.', () => {
    const submitActionMock = jest.fn();
    render(<ActionButton submitAction={submitActionMock} position='left' />);

    // Assert that the button element is rendered.
    const buttonElement = screen.getByTestId('action-button');
    expect(buttonElement).toBeInTheDocument();

    // Assert that the default label "Submit" is present.
    expect(buttonElement).toHaveTextContent('Submit');

    // Assert that the submitActionMock function is not called.
    expect(submitActionMock).toHaveBeenCalledTimes(0);
  });

  it('should render with custom label.', () => {
    const submitActionMock = jest.fn();
    render(
      <ActionButton
        submitAction={submitActionMock}
        label='Save'
        position='right'
      />
    );

    // Assert that the button element is rendered.
    const buttonElement = screen.getByTestId('action-button');
    expect(buttonElement).toBeInTheDocument();

    // Assert that the custom label "Save" is present.
    expect(buttonElement).toHaveTextContent('Save');

    // Assert that the submitActionMock function is not called.
    expect(submitActionMock).toHaveBeenCalledTimes(0);
  });

  it('should call submitAction when the button is clicked.', () => {
    const submitActionMock = jest.fn();
    render(<ActionButton submitAction={submitActionMock} position='left' />);

    // Simulate a click event on the button.
    const buttonElement = screen.getByTestId('action-button');
    fireEvent.click(buttonElement);

    // Assert that the submitActionMock function is called once.
    expect(submitActionMock).toHaveBeenCalledTimes(1);
  });

  it('should render with primary color by default.', () => {
    const submitActionMock = jest.fn();
    render(<ActionButton submitAction={submitActionMock} position='left' />);

    // Assert that the button element has the "btn-primary" class.
    const buttonElement = screen.getByTestId('action-button');
    expect(buttonElement).toHaveClass('btn-primary');
  });

  it('should render with secondary color.', () => {
    const submitActionMock = jest.fn();
    render(
      <ActionButton
        submitAction={submitActionMock}
        position='left'
        color='secondary'
      />
    );

    // Assert that the button element has the "btn-secondary" class.
    const buttonElement = screen.getByTestId('action-button');
    expect(buttonElement).toHaveClass('btn-secondary');
  });

  it('should render with loader when loading prop is true.', () => {
    const submitActionMock = jest.fn();
    render(
      <ActionButton
        submitAction={submitActionMock}
        position='left'
        loading={true}
      />
    );

    // Assert that the loader component is rendered.
    const loaderElement = screen.getByTestId('loader');
    expect(loaderElement).toBeInTheDocument();

    // Assert that the submitActionMock function is not called.
    expect(submitActionMock).toHaveBeenCalledTimes(0);
  });

  it('should not render loader when loading prop is false.', () => {
    const submitActionMock = jest.fn();
    render(
      <ActionButton
        submitAction={submitActionMock}
        position='left'
        loading={false}
      />
    );

    // Assert that the loader component is not rendered.
    expect(screen.queryByTestId('loader')).not.toBeInTheDocument();

    // Assert that the submitActionMock function is not called.
    expect(submitActionMock).toHaveBeenCalledTimes(0);
  });
});
