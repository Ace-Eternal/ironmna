// Base URL is injected by Vite env files for each environment.
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/iron';
export const getBaseUrl = () => BASE_URL;
