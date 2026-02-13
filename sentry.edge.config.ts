import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  tracesSampleRate: 0.1,
  
  // Environment configuration
  environment: process.env.NODE_ENV || 'development',
  
  // Before send hook
  beforeSend(event, hint) {
    // Filter out health check errors
    if (event.request?.url?.includes('/health')) {
      return null;
    }
    
    // Add custom tags
    if (event.tags) {
      event.tags.service = 'tablemaster-frontend-edge';
    }
    
    return event;
  },
  
  // Ignore specific errors
  ignoreErrors: [
    'Non-Error exception captured',
    'ValidationError',
  ],
});