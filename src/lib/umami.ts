declare global {
  var umami: ((event: string, data?: Record<string, unknown>) => void) | undefined;
}

export const track = (event: string, data?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.umami) {
    window.umami(event, data);
  }
};
