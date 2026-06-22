

export const URL_DOMAIN = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:1337';
export const URL_DOMAIN_IMG = process.env.NEXT_PUBLIC_BACKEND_URL_IMG || '';
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?  process.env.NEXT_PUBLIC_BACKEND_URL : process.env.BACKEND_URL;

export const ENV_CONST = process.env.NEXT_PUBLIC_ENV || process.env.ENV || '';

// Analytics IDs from environment variables
export const GOOGLE_ANALYTICS_ID = process.env.NEXT_PUBLIC_GA_ID || '';
export const ANALYTICS_ID = process.env.ANALYTICS_ID || 'GTM-584RMZLB';