import { httpClient } from '@/shared/api/httpClient';
export function getTableList(params) {
    return httpClient({
        url: '/customer/getCustomerList',
        method: 'get',
        params
    });
}
export function getCustomerNameList() {
    return httpClient({
        url: '/customer/getCustomerNameList',
        method: 'get'
    });
}
export function updateCustomer(data) {
    return httpClient({
        url: '/customer/updateCustomer',
        method: 'post',
        data
    });
}
export function addCustomer(data) {
    return httpClient({
        url: '/customer/addCustomer',
        method: 'post',
        data
    });
}
export function deleteCustomer(id) {
    return httpClient({
        url: `/customer/deleteCustomer?id=${id}`,
        method: 'post'
    });
}
