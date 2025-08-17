import React from 'react';
import { useRouteError, Link, useNavigate } from 'react-router';
import { Home, AlertCircle, RefreshCw, ArrowRight, Zap } from 'lucide-react';

export default function ErrorPage({ error: propError }) {
  let error;
  try {
    error = useRouteError() || propError || {};
  } catch (e) {
    error = propError || { status: 500, statusText: 'Internal Server Error' };
  }
  
  const navigate = useNavigate();
  
  const handleGoHome = (e) => {
    e.preventDefault();
    navigate('/');
  };
  
  const handleRefresh = (e) => {
    e.preventDefault();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl transform transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100 dark:bg-red-900/30 p-4 mb-6">
            <AlertCircle className="h-16 w-16 text-red-500 dark:text-red-400 animate-pulse" />
          </div>
          
          <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-2">
            {error?.status || '500'}
          </h1>
          
          <h2 className="mt-2 text-4xl font-extrabold text-gray-900 dark:text-white">
            {error?.status === 404 ? 'Page Not Found' : 'Something went wrong'}
          </h2>
          
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {error?.statusText || error?.message || 'An unexpected error has occurred. Please try again later.'}
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleGoHome}
              className="group inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-lg shadow-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:-translate-y-1"
            >
              <Home className="w-5 h-5 mr-2 group-hover:animate-bounce" />
              Go back home
            </button>
            
            <button
              onClick={handleRefresh}
              className="group inline-flex items-center justify-center px-8 py-4 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-lg shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              <RefreshCw className="w-5 h-5 mr-2 group-hover:animate-spin" />
              Try again
            </button>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
              Need help? Here's what you can do:
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-300">
              <li className="flex items-start">
                <Zap className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Check your internet connection</span>
              </li>
              <li className="flex items-start">
                <Zap className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Clear your browser cache and cookies</span>
              </li>
              <li className="flex items-start">
                <Zap className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Contact our support team if the problem persists</span>
              </li>
            </ul>
          </div>
          
          {process.env.NODE_ENV === 'development' && error?.stack && (
            <details className="mt-8 text-left bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <summary className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer flex items-center">
                <ArrowRight className="w-4 h-4 mr-2 inline-block transform transition-transform" />
                Show error details (Development Mode)
              </summary>
              <pre className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-md overflow-auto text-xs text-gray-800 dark:text-gray-200">
                {error.stack}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}

// Error Boundary Component
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 p-6 text-white">
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 mr-3" />
                <h2 className="text-2xl font-bold">Application Error</h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                We're sorry, but an unexpected error occurred. Our team has been notified and we're working to fix it.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex-1 flex items-center justify-center"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Refresh Page
                </button>
                <a
                  href="/"
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors flex-1 text-center"
                >
                  Return Home
                </a>
              </div>
              {process.env.NODE_ENV === 'development' && this.state.error?.stack && (
                <details className="mt-6">
                  <summary className="text-sm text-blue-600 dark:text-blue-400 cursor-pointer">
                    View Error Details
                  </summary>
                  <pre className="mt-2 p-4 bg-gray-100 dark:bg-gray-700 rounded-md overflow-auto text-xs text-gray-800 dark:text-gray-200">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
