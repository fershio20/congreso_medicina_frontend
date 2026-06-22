import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import {URL_DOMAIN} from "./globalConstants"

/**
 * Recursively removes `buffer` properties (raw media bytes returned by this
 * Strapi instance) from a parsed JSON payload. Mutates the value in place.
 */
export function stripBuffers(value: unknown): void {
    if (Array.isArray(value)) {
        for (const item of value) stripBuffers(item);
        return;
    }
    if (value && typeof value === "object") {
        const obj = value as Record<string, unknown>;
        for (const key of Object.keys(obj)) {
            if (key === "buffer") {
                delete obj[key];
            } else {
                stripBuffers(obj[key]);
            }
        }
    }
}

/**
 * Generic server-side fetch for Strapi/CMS endpoints
 * @param endpoint - API path (e.g. "/api/ponencia?populate=*")
 * @returns Parsed JSON as T or null on failure
 */
export async function fetchServerSide<T>(endpoint: string): Promise<T | null> {
    try {
        const url = `${URL_DOMAIN}${endpoint}`;
        const res = await fetch(url, {
            headers: {Accept: "application/json"},
        });

        if (!res.ok) {
            if (res.status !== 404) {
                console.error(`Fetch failed: ${res.status} ${res.statusText}`, url);
            }
            return null;
        }

        const json = await res.json();
        // This Strapi instance embeds raw image bytes under media `buffer`
        // fields. They are never used by the app (only `url`/`formats.*.url`)
        // and would bloat SSG page data by hundreds of KB per image.
        stripBuffers(json);
        return json as T;
    } catch (error) {
        if (error instanceof Error && !error.message.includes("404")) {
            console.error(`Error fetching ${endpoint}:`, error);
        }
        return null;
    }
}

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Converts a backend URL to use the Next.js API proxy route
 * This bypasses CORS issues by routing through the server
 * Use this for client-side fetch calls
 */
export function getProxyUrl(url: string): string {
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
