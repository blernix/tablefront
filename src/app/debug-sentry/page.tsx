'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DebugSentryPage() {
  const [errorCount, setErrorCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [sentryStatus, setSentryStatus] = useState<'unknown' | 'configured' | 'not-configured'>('unknown');

  // Check if Sentry DSN is configured
  const checkSentryConfiguration = () => {
    const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
    if (dsn && dsn.startsWith('https://')) {
      setSentryStatus('configured');
      return true;
    }
    setSentryStatus('not-configured');
    return false;
  };

  // Trigger a test error
  const triggerTestError = () => {
    setErrorCount(prev => prev + 1);
    
    // Create a custom error with identifiable message
    const error = new Error(`Sentry Test Error #${errorCount + 1} - Debug page triggered at ${new Date().toISOString()}`);
    error.name = 'SentryDebugError';
    
    // Add custom properties to the error object
    (error as any).debugInfo = {
      page: 'debug-sentry',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
      timestamp: new Date().toISOString(),
      count: errorCount + 1,
    };

    // Log to console for visibility
    console.error('Triggering Sentry test error:', error);
    
    // Throw the error to be captured by Sentry
    throw error;
  };

  // Trigger a promise rejection
  const triggerPromiseRejection = async () => {
    setErrorCount(prev => prev + 1);
    
    const promise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Sentry Promise Rejection #${errorCount + 1} - Async error at ${new Date().toISOString()}`));
      }, 100);
    });

    try {
      await promise;
    } catch (error) {
      console.error('Triggered promise rejection:', error);
      // Re-throw to let Sentry catch it
      throw error;
    }
  };

  // Trigger a console.error (should be captured by Sentry)
  const triggerConsoleError = () => {
    setErrorCount(prev => prev + 1);
    const error = new Error(`Console Error #${errorCount + 1} - Manual console.error at ${new Date().toISOString()}`);
    console.error('Manual console.error triggered:', error);
    alert('Console error logged. Check Sentry for capture.');
  };

  // Trigger a fetch error (network error)
  const triggerFetchError = async () => {
    setIsLoading(true);
    setErrorCount(prev => prev + 1);
    
    try {
      // Intentionally fetch a non-existent endpoint
      const response = await fetch('/api/nonexistent-endpoint-for-sentry-test');
      if (!response.ok) {
        throw new Error(`Fetch Error #${errorCount + 1}: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Fetch error triggered:', error);
      // Re-throw to let Sentry catch it
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Manually capture an exception using Sentry if available
  const triggerManualCapture = () => {
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      setErrorCount(prev => prev + 1);
      const error = new Error(`Manual Capture #${errorCount + 1} - Sentry.captureException at ${new Date().toISOString()}`);
      (window as any).Sentry.captureException(error);
      alert('Error manually captured via Sentry.captureException');
    } else {
      alert('Sentry SDK not available in window object. Make sure Sentry is properly initialized.');
    }
  };

  // Trigger undefined function error (as recommended by Sentry)
  const triggerUndefinedFunctionError = () => {
    setErrorCount(prev => prev + 1);
    // This will trigger a ReferenceError: myUndefinedFunction is not defined
    // @ts-ignore - Intentional undefined function for Sentry testing
    myUndefinedFunction();
  };

  // Clear error count
  const clearErrors = () => {
    setErrorCount(0);
    setSentryStatus('unknown');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sentry Debug Page</h1>
          <p className="text-gray-600">
            This page helps test Sentry error tracking integration. Errors triggered here should appear in your Sentry dashboard.
          </p>
          <Link href="/" className="text-blue-600 hover:underline mt-2 inline-block">
            ← Back to home
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Configuration Status Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Configuration Status</h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">Sentry DSN:</span>
                  <button 
                    onClick={checkSentryConfiguration}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                  >
                    Check
                  </button>
                </div>
                <div className={`p-3 rounded ${sentryStatus === 'configured' ? 'bg-green-50 text-green-700' : sentryStatus === 'not-configured' ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-700'}`}>
                  {sentryStatus === 'configured' ? (
                    <div>
                      <div className="font-medium">✓ Sentry is configured</div>
                      <div className="text-xs mt-1 truncate">DSN: {process.env.NEXT_PUBLIC_SENTRY_DSN?.substring(0, 40)}...</div>
                    </div>
                  ) : sentryStatus === 'not-configured' ? (
                    <div className="font-medium">✗ Sentry is not configured</div>
                  ) : (
                    <div className="font-medium">Click &quot;Check&quot; to verify configuration</div>
                  )}
                </div>
              </div>

              <div>
                <div className="text-gray-700 mb-2">Environment:</div>
                <div className="p-3 bg-gray-50 rounded">
                  <code className="text-sm">
                    NODE_ENV: {process.env.NODE_ENV || 'not set'}<br/>
                    NEXT_PUBLIC_SENTRY_DSN: {process.env.NEXT_PUBLIC_SENTRY_DSN ? 'Set' : 'Not set'}
                  </code>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Errors Triggered:</span>
                  <span className="text-2xl font-bold text-red-600">{errorCount}</span>
                </div>
                <button 
                  onClick={clearErrors}
                  className="mt-2 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Reset Counter
                </button>
              </div>
            </div>
          </div>

          {/* Error Triggers Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Trigger Test Errors</h2>
            <p className="text-gray-600 mb-6">
              Click buttons below to trigger different types of errors. Each should be captured by Sentry when configured.
            </p>

            <div className="space-y-3">
              <button
                onClick={triggerTestError}
                className="w-full px-4 py-3 bg-red-600 text-white rounded hover:bg-red-700 font-medium"
              >
                Throw Synchronous Error
              </button>

              <button
                onClick={triggerPromiseRejection}
                className="w-full px-4 py-3 bg-orange-600 text-white rounded hover:bg-orange-700 font-medium"
              >
                Trigger Promise Rejection
              </button>

              <button
                onClick={triggerConsoleError}
                className="w-full px-4 py-3 bg-yellow-600 text-white rounded hover:bg-yellow-700 font-medium"
              >
                Log Console Error
              </button>

              <button
                onClick={triggerFetchError}
                disabled={isLoading}
                className={`w-full px-4 py-3 bg-purple-600 text-white rounded hover:bg-purple-700 font-medium ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Triggering...' : 'Trigger Fetch Error'}
              </button>

               <button
                onClick={triggerManualCapture}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
              >
                Manual Sentry Capture
              </button>

              <button
                onClick={triggerUndefinedFunctionError}
                className="w-full px-4 py-3 bg-green-600 text-white rounded hover:bg-green-700 font-medium"
              >
                Trigger Undefined Function (Sentry Recommended)
              </button>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
              <h3 className="font-medium text-yellow-800 mb-2">⚠️ Important Notes</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Errors will appear in your Sentry project dashboard</li>
                <li>• Check console for error details (F12 Developer Tools)</li>
                <li>• Make sure <code>NEXT_PUBLIC_SENTRY_DSN</code> is set in <code>.env.local</code></li>
                <li>• Source maps are automatically uploaded during build</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Instructions Card */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Setup Instructions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded">
              <div className="text-lg font-medium text-gray-900 mb-2">1. Get DSN</div>
              <p className="text-gray-600 text-sm">
                Go to your Sentry project → Settings → Client Keys (DSN). Copy the DSN.
              </p>
            </div>

            <div className="p-4 border border-gray-200 rounded">
              <div className="text-lg font-medium text-gray-900 mb-2">2. Add to .env.local</div>
              <p className="text-gray-600 text-sm">
                Add <code>NEXT_PUBLIC_SENTRY_DSN=your-dsn-here</code> to <code>tablemaster-frontend/.env.local</code>
              </p>
            </div>

            <div className="p-4 border border-gray-200 rounded">
              <div className="text-lg font-medium text-gray-900 mb-2">3. Restart Dev Server</div>
              <p className="text-gray-600 text-sm">
                Restart <code>npm run dev</code> and trigger errors. Check Sentry dashboard within minutes.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-medium text-gray-900 mb-2">Troubleshooting</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Ensure Sentry project is set to <strong>javascript-nextjs</strong> platform</li>
              <li>• Check browser console for Sentry initialization logs</li>
              <li>• Verify source maps are uploaded: <code>npm run build</code> includes Sentry upload</li>
              <li>• Wait 1-2 minutes for errors to appear in Sentry</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            This page is only for testing purposes. Remove or restrict access in production.
            Accessible at: <code>/debug-sentry</code>
          </p>
        </div>
      </div>
    </div>
  );
}