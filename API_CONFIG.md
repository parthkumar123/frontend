# API Configuration

This document explains how API endpoints are configured in the application.

## Environment Files

The application uses environment files located in the `env/` directory:

- `development.env`: Used during development
- `staging.env`: Used for staging environment
- `production.env`: Used for production environment

## API Base URL Configuration

The API base URL is configured in each environment file:

```
PORT=3100
API_BASE_URL=http://localhost:3000
```

For production:

```
PORT=3100
API_BASE_URL=https://api.example.com
```

## How Environment Variables Are Loaded

The app.js file loads environment variables from the appropriate environment file based on the APP_ENV environment variable:

```javascript
require('dotenv').config({
    path: path.resolve(__dirname + "/env", process.env.APP_ENV + '.env')
});
```

## API Endpoints Configuration

API endpoints are centralized in `src/config/api.js`:

```javascript
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

// Task endpoints
export const TASK_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/tasks`,
  CREATE: `${API_BASE_URL}/tasks`,
  UPDATE: (id) => `${API_BASE_URL}/tasks/${id}`,
  DELETE: (id) => `${API_BASE_URL}/tasks/${id}`,
};

// Authentication endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  SIGNUP: `${API_BASE_URL}/auth/signup`,
  // ... other endpoints
};
```

## Usage in Components

Import the endpoint configurations in your components:

```javascript
import { TASK_ENDPOINTS } from '../config/api';

// Then use them in fetch calls
const response = await fetch(TASK_ENDPOINTS.GET_ALL, {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

## Running the App with Different Environments

Use the appropriate npm script to run the app with different environment variables:

- Development: `npm run dev`
- Staging: `npm run stag:start`
- Production: `npm run prod:start`
