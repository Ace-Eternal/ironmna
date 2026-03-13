import { httpClient } from '@/shared/api/httpClient';
export function loginApi(data) {
    return httpClient({
        url: '/admin/login',
        method: 'post',
        data
    });
}
export function getUserInfo() {
    return httpClient({
        url: '/admin/getUserInfo',
        method: 'get'
    });
}
export function logoutApi() {
    return httpClient({
        url: '/logout',
        method: 'get'
    });
}
