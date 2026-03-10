import { httpClient } from '@/shared/api/httpClient'
import type { Order } from '@/types'

export function getOrderList(params: any) {
  return httpClient({
    url: '/order/getOrderList',
    method: 'get',
    params
  })
}

export function createOrder(data: Order) {
  return httpClient({
    url: '/order/createOrder',
    method: 'post',
    data
  })
}

export function getOrderDetail(id: number | string) {
  return httpClient({
    url: `/order/getOrderDetail?id=${id}`,
    method: 'get'
  })
}

export function deleteOrder(id: number | string) {
  return httpClient({
    url: `/order/deleteOrder?orderId=${id}`,
    method: 'post'
  })
}

export function getDownloadUrl(id: number | string) {
  return httpClient({
    url: `/order/exportOrder?id=${id}`,
    method: 'post'
  })
}

export function download(fileName: string) {
  return httpClient({
    url: `/order/download?file=${fileName}`,
    method: 'get'
  })
}
