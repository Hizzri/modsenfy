import { Component } from 'react';
import './ErrorBoundary.scss';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="global-error">
          <div className="global-error__content">
            <p className="global-error__code">Something went wrong</p>
            <h1 className="global-error__title">Modsenfy could not render this page</h1>
            <p className="global-error__text">Reload the application and try again.</p>
            <button className="global-error__button" type="button" onClick={this.handleReload}>
              Reload application
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
