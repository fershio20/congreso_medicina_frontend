declare global {
  interface Window {
    __grantAllConsents: () => void;
    __denyAllConsents: () => void;
    gtag: (...args: unknown[]) => void;
    dataLayer: Record<string, unknown>[];
    fbq: (...args: unknown[]) => void;
  }
}

export {};
