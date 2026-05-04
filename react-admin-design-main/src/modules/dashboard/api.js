import { httpClient } from '@/shared/api/httpClient';
export function getDashboardHome() {
    return httpClient({
        url: '/dashboard/home',
        method: 'get'
    });
}
