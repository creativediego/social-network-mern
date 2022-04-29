import React, { Component } from 'react';
import { LandingView } from '../../views';

/**
 * Error boundary wrapper for the application to display a friendly error for uncaught errors. Made to wrap the main App component.
 * @class
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // TODO: Install logger.
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <LandingView
          content={
            <div>
              <h3>Oooops! Something went wrong.</h3>
            </div>
          }
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
