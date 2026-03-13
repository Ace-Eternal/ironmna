import { getApiBaseUrl } from '@/app/config/env';
// Kept for compatibility with existing pages.
export const BASE_URL = getApiBaseUrl();
export const getBaseUrl = () => BASE_URL;
