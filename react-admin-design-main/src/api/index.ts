import { service } from '@/utils/axios'

import type { UpdateCustomer, Order } from '../types/index'

interface LoginParams {
  username: string
  password: string
}

// User login api
export function loginApi(data: LoginParams): Promise<any> {
  return service({
    // url: '/login',
    url: '/admin/login',
    method: 'post',
    data
  })
}

// Get User info
export function getUserInfo(): Promise<any> {
  return service({
    url: '/admin/getUserInfo',
    method: 'get'
  })
}

// User logout api
export function logoutApi() {
  return service({
    url: '/logout',
    method: 'get'
  })
}

// Table list
export function getTableList(params: any) {
  return service({
    url: '/customer/getCustomerList',
    // url: '/table/getTableList',
    method: 'get',
    params
  })
}

export function getCustomerNameList() {
  return service({
    url: '/customer/getCustomerNameList',
    method: 'get'
  })
}

export function updateCustomer(data: UpdateCustomer) {
  return service({
    url: '/customer/updateCustomer',
    method: 'post',
    data
  })
}

export function addCustomer(data: UpdateCustomer) {
  return service({
    url: '/customer/addCustomer',
    method: 'post',
    data
  })
}

export function deleteCustomer(params: any) {
  return service({
    url: `/customer/deleteCustomer?id=${params}`,
    method: 'post'
  })
}

export function getOrderList(params: any) {
  return service({
    url: '/order/getOrderList',
    method: 'get',
    params
  })
}

export function createOrder(data: Order) {
  return service({
    url: '/order/createOrder',
    method: 'post',
    data
  })
}

export function getOrderDetail(params: any) {
  return service({
    url: `/order/getOrderDetail?id=${params}`,
    method: 'get'
  })
}

export function deleteOrder(params: any) {
  return service({
    url: `/order/deleteOrder?orderId=${params}`,
    method: 'post'
  })
}

export function getDownloadUrl(params: any) {
  return service({
    url: `/order/exportOrder?id=${params}`,
    method: 'post'
  })
}

export function download(params: any) {
  return service({
    url: `/order/download?file=${params}`,
    method: 'get'
  })
}
