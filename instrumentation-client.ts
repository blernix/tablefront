import * as Sentry from '@sentry/nextjs';

export function register() {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Debug mode for development
    debug: process.env.NODE_ENV === 'development',

    // Adjust sample rates for production
    tracesSampleRate: process.env.NODE_ENV === 'development' ? 1.0 : 0.1,

    // Session Replay configuration (optional)
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    // Environment configuration
    environment: process.env.NODE_ENV || 'development',

    // Add request headers and IP for users (GDPR compliant)
    sendDefaultPii: false,

    // Before send hook to filter or modify events
    beforeSend(event, hint) {
      // Filter out development errors if needed
      if (process.env.NODE_ENV === 'development') {
        console.error('Sentry event (dev):', event);
      }

      // Filter out specific errors
      const error = hint?.originalException;
      if (error instanceof Error) {
        // Ignore common network errors
        if (
          error.message.includes('Network Error') ||
          error.message.includes('Failed to fetch') ||
          error.message.includes('timeout')
        ) {
          return null;
        }

        // Ignore specific component errors
        if (error.message.includes('ResizeObserver')) {
          return null;
        }
      }

      return event;
    },

    // Integrations
    integrations: [
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: true,
      }),
    ],
  });
}

// Instrument navigation for performance monitoring
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
