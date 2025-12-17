// SWR configuration and utilities
import useSWR, { SWRConfiguration } from 'swr';
import { URL_DOMAIN } from './globalConstants';

// Custom error class for better error handling
export class ApiError extends Error {
    status: number;
    statusText: string;

    constructor(status: number, statusText: string, message?: string) {
        super(message || `HTTP error! status: ${status}`);
        this.name = 'ApiError';
        this.status = status;
        this.statusText = statusText;
    }
}

/**
 * Converts a backend URL to use the Next.js API proxy route
 * This bypasses CORS issues by routing through the server
 */
function getProxyUrl(url: string): string {
    // If it's already a relative URL (starts with /api/strapi), use it as-is
    if (url.startsWith('/api/strapi/')) {
        return url;
    }

    // If it's a backend URL, convert it to use the proxy
    if (url.startsWith(URL_DOMAIN)) {
        // Extract the path after /api/
        const apiPath = url.replace(URL_DOMAIN, '').replace(/^\/api\//, '');
        return `/api/strapi/${apiPath}`;
    }

    // If it's already a relative URL starting with /api/, check if it needs proxy
    if (url.startsWith('/api/') && !url.startsWith('/api/strapi/')) {
        // Check if this is a backend endpoint that should go through proxy
        // For now, we'll proxy all /api/ calls that aren't already proxy routes
        const apiPath = url.replace('/api/', '');
        return `/api/strapi/${apiPath}`;
    }

    // For other URLs (like relative paths that aren't backend calls), return as-is
    return url;
}

// Fetcher function for SWR with better error handling
// Automatically uses proxy route for backend URLs to avoid CORS issues
export const fetcher = async (url: string) => {
    try {
        // Convert backend URLs to proxy URLs when running on client-side
        const isClient = typeof window !== 'undefined';
        const fetchUrl = isClient ? getProxyUrl(url) : url;

        const res = await fetch(fetchUrl);
        
        // Handle 404s gracefully - return null instead of throwing (silently)
        if (res.status === 404) {
            return null;
        }
        
        // Handle other errors
        if (!res.ok) {
            const error = new ApiError(res.status, res.statusText, `HTTP error! status: ${res.status}`);
            // Only log non-404 errors
            if (res.status !== 404) {
                console.error(`API Error (${res.status}): ${fetchUrl}`, error);
            }
            throw error;
        }
        
        return res.json();
    } catch (error) {
        // Only log non-404 errors
        if (error instanceof ApiError && error.status !== 404) {
            console.error(`Failed to fetch: ${url}`, error);
        } else if (!(error instanceof ApiError)) {
            // Network errors or other non-HTTP errors
            console.error(`Failed to fetch: ${url}`, error);
        }
        throw error;
    }
};

// Default SWR configuration
export const swrConfig: SWRConfiguration = {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000, // 1 minute
    errorRetryCount: 3,
    errorRetryInterval: 5000, // 5 seconds
    // Don't retry on 404s - they won't change
    shouldRetryOnError: (error) => {
        if (error instanceof ApiError && error.status === 404) {
            return false;
        }
        return true;
    },
};

// Custom hooks for common API endpoints
export const useTurismoPage = () => {
    return useSWR('/api/turismo-page?populate=*', fetcher, swrConfig);
};

export const useTurismos = () => {
    return useSWR('/api/turismos?populate=*', fetcher, swrConfig);
};
