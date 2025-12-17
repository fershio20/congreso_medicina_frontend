// SWR configuration and utilities
import useSWR, { SWRConfiguration } from 'swr';

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

// Fetcher function for SWR with better error handling
export const fetcher = async (url: string) => {
    try {
        const res = await fetch(url);
        
        // Handle 404s gracefully - return null instead of throwing (silently)
        if (res.status === 404) {
            return null;
        }
        
        // Handle other errors
        if (!res.ok) {
            const error = new ApiError(res.status, res.statusText, `HTTP error! status: ${res.status}`);
            // Only log non-404 errors
            if (res.status !== 404) {
                console.error(`API Error (${res.status}): ${url}`, error);
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
