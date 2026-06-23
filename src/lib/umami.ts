declare global {
  var umami: ((event: string, data?: Record<string, unknown>) => void) | undefined;
}

export const track = (event: string, data?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && typeof window.umami === 'function') {
    try {
      window.umami(event, data);
    } catch {
      // umami not fully loaded yet — silently ignore
    }
  }
};
