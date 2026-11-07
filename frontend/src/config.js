// In development Vite proxies /api to http://localhost:5000.
// In production on Vercel/Netlify, you can set VITE_API_BASE_URL to your deployed backend URL.
export const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
