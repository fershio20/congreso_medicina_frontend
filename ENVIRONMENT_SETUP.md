# Environment Setup

## Backend API Configuration

To connect this Next.js application to your backend API, you need to set the following environment variable:

### Option 1: Environment File (Recommended for development)

Create a `.env.local` file in the root directory:

```bash
# Backend API URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:1337
```

### Option 2: System Environment Variable

Set the environment variable in your system:

```bash
# Linux/Mac
export NEXT_PUBLIC_BACKEND_URL=http://localhost:1337

# Windows
set NEXT_PUBLIC_BACKEND_URL=http://localhost:1337
```

### Option 3: Package.json Scripts

You can also set it when running the development server:

```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:1337 npm run dev
```

## Default Configuration

If no environment variable is set, the application will default to:
- `http://localhost:1337` (Strapi default port)

## Production Deployment

For production, make sure to set the correct backend URL:

```bash
NEXT_PUBLIC_BACKEND_URL=https://your-backend-domain.com
```

## API Endpoints

The application expects these backend endpoints to be available:

- `GET /api/turismo-page?populate=*` - Main page data
- `GET /api/turismos?populate=*` - Hotels and tourist attractions

## Next.js Rewrites

The application uses Next.js rewrites to proxy API requests to your backend, so the frontend can make requests to `/api/turismo-page` and `/api/turismos` which will be automatically forwarded to your backend server.
