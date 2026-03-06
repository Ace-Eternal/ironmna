import axios from 'axios';
import { message } from 'antd';
import { getToken, clearAuthCache } from '@/utils/auth';
import { getBaseUrl } from '@/types/config';
const url = getBaseUrl();
// Create axios instance
const service = axios.create({
    // baseURL: '/api',
    baseURL: url,
    timeout: 10 * 1000
});
// Handle Error
const handleError = (error) => {
    if (error.response?.status === 401 || error.response?.status === 504) {
        clearAuthCache();
        location.href = '/login';
    }
    message.error(error.message || 'error');
    return Promise.reject(error);
};
// Request interceptors configuration
service.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        ;
        config.headers['Authorization'] = `${token}`;
    }
    ;
    config.headers['Content-Type'] = 'application/json';
    return config;
}, handleError);
// Respose interceptors configuration
service.interceptors.response.use((response) => {
    const data = response.data;
    if (data.code === 0) {
        return data.data;
    }
    else {
        message.error(data.message);
        return Promise.reject('error');
    }
}, handleError);
export { service };
