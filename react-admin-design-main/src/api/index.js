import { service } from '@/utils/axios';
// User login api
export function loginApi(data) {
    return service({
        // url: '/login',
        url: '/admin/login',
        method: 'post',
        data
    });
}
// Get User info
export function getUserInfo() {
    return service({
        url: '/admin/getUserInfo',
        method: 'get'
    });
}
// User logout api
export function logoutApi() {
    return service({
        url: '/logout',
        method: 'get'
    });
}
// Table list
export function getTableList(params) {
    return service({
        url: '/customer/getCustomerList',
        // url: '/table/getTableList',
        method: 'get',
        params
    });
}
export function getCustomerNameList() {
    return service({
        url: '/customer/getCustomerNameList',
        method: 'get'
    });
}
export function updateCustomer(data) {
    return service({
        url: '/customer/updateCustomer',
        method: 'post',
        data
    });
}
export function addCustomer(data) {
    return service({
        url: '/customer/addCustomer',
        method: 'post',
        data
    });
}
export function deleteCustomer(params) {
    return service({
        url: `/customer/deleteCustomer?id=${params}`,
        method: 'post'
    });
}
export function getOrderList(params) {
    return service({
        url: '/order/getOrderList',
        method: 'get',
        params
    });
}
export function createOrder(data) {
    return service({
        url: '/order/createOrder',
        method: 'post',
        data
    });
}
export function getOrderDetail(params) {
    return service({
        url: `/order/getOrderDetail?id=${params}`,
        method: 'get'
    });
}
export function deleteOrder(params) {
    return service({
        url: `/order/deleteOrder?orderId=${params}`,
        method: 'post'
    });
}
export function getDownloadUrl(params) {
    return service({
        url: `/order/exportOrder?id=${params}`,
        method: 'post'
    });
}
export function download(params) {
    return service({
        url: `/order/download?file=${params}`,
        method: 'get'
    });
}
