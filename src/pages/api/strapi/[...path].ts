import type { NextApiRequest, NextApiResponse } from 'next';
import { URL_DOMAIN } from '@/lib/globalConstants';

/**
 * Generic API proxy route for Strapi backend
 * This runs on the server, so it bypasses CORS restrictions
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET requests for now (can be extended)
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the path from the catch-all route
    const path = Array.isArray(req.query.path) 
      ? req.query.path.join('/') 
      : req.query.path || '';

    // Reconstruct the query string from req.query
    // Next.js automatically parses query parameters, including complex ones with brackets
    const queryParams = new URLSearchParams();
    Object.entries(req.query).forEach(([key, value]) => {
      if (key !== 'path') {
        if (Array.isArray(value)) {
          value.forEach(v => {
            if (v) queryParams.append(key, v);
          });
        } else if (value) {
          queryParams.append(key, value);
        }
      }
    });

    const queryString = queryParams.toString();

    // Build the full URL
    const backendUrl = `${URL_DOMAIN}/api/${path}${queryString ? `?${queryString}` : ''}`;

    // Fetch from backend
    const response = await fetch(backendUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    // Handle errors
    if (!response.ok) {
      // Return the error status and message
      return res.status(response.status).json({
        error: `Backend error: ${response.status} ${response.statusText}`,
      });
    }

    // Parse and return the JSON response
    const data = await response.json();

    // Set CORS headers to allow the frontend to access this
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    return res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
