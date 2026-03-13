import { httpClient } from '@/shared/api/httpClient';
export function getOrderList(params) {
    return httpClient({
        url: '/order/getOrderList',
        method: 'get',
        params
    });
}
export function createOrder(data) {
    return httpClient({
        url: '/order/createOrder',
        method: 'post',
        data
    });
}
export function getOrderDetail(id) {
    return httpClient({
        url: `/order/getOrderDetail?id=${id}`,
        method: 'get'
    });
}
export function updateOrder(data) {
    return httpClient({
        url: '/order/updateOrder',
        method: 'post',
        data
    });
}
export function deleteOrder(id) {
    return httpClient({
        url: `/order/deleteOrder?orderId=${id}`,
        method: 'post'
    });
}
export function getDownloadUrl(id) {
    return httpClient({
        url: `/order/exportOrder?id=${id}`,
        method: 'post'
    });
}
export function download(fileName) {
    return httpClient({
        url: `/order/download?file=${fileName}`,
        method: 'get'
    });
}
