# Deployment Guide

Follow these steps to deploy your Student Management System to Render.

## 1. Prepare for Deployment

### Root `package.json`
Your root `package.json` should have the following scripts:
```json
"scripts": {
  "build": "cd frontend && npm install && npm run build",
  "start": "node server/server.js"
}
```

## 2. Deploy Backend (and Frontend as Static)

Render can host both the frontend and backend together if the backend is configured to serve static files.

1.  **Direct Folder Structure**: Ensure your project is pushed to GitHub.
2.  **Create New Web Service**:
    *   **Runtime**: Node
    *   **Build Command**: `npm install && npm run build` (Run from root)
    *   **Start Command**: `npm start`
3.  **Environment Variables**:
    *   `NODE_ENV`: `production`
    *   `MONGO_URI`: (Your MongoDB Connection String)
    *   `PORT`: `10000` (Render's default)
    *   `JWT_SECRET`: (A random secure string)
    *   `JWT_REFRESH_SECRET`: (Another random secure string)
    *   `CLIENT_URL`: (Backend_URL)

## 3. Alternative: Deploy Frontend Separately

If you prefer to deploy the frontend separately (e.g., on Render Static Site or Vercel):

1.  **Frontend Build**: Build the frontend locally or on the CI.
2.  **Environment Variable**: Set `VITE_API_KEY` to your backend API URL (e.g., `https://your-backend-api.onrender.com/api`).
3.  **CORS**: Ensure `CLIENT_URL` on the backend includes your frontend's URL.

## Connection Summary
- **Development**: The Vite proxy in `vite.config.js` directs `/api` to `http://localhost:5000`.
- **Production**: The `baseURL` in `api.js` defaults to `/api`, which works seamlessly when the backend serves the frontend.
