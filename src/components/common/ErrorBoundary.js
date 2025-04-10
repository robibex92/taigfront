import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h2>Что-то пошло не так</h2>
          <p>Пожалуйста, обновите страницу или попробуйте позже.</p>
          <button onClick={() => window.location.reload()}>Обновить страницу</button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 