import { Component, ErrorInfo, ReactNode } from 'react';
import { LandingPage } from '../../pages';

interface Props {
  children?: ReactNode;
}
interface State {
  hasError: boolean;
}
/**
 * Error boundary wrapper for the application to display a friendly error for uncaught errors. Made to wrap the main App component.
 *
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // TODO: Install logger.
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <LandingPage>
          <h3>Oooops! Something went wrong.</h3>
        </LandingPage>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
