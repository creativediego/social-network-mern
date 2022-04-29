import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';

test('renders learn react link', () => {
  render(
    <Provider>
      <App />
    </Provider>
  );
  const linkElement = screen.getByText(/Home Screen/i);
  expect(linkElement).toBeInTheDocument();
});
