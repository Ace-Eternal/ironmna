const DEFAULT_API_BASE_URL = '/iron'

export const getApiBaseUrl = () => import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL

export const getAppTitle = () => import.meta.env.VITE_GLOB_APP_TITLE || 'react-admin-design'
