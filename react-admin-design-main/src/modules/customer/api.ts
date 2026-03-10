import { httpClient } from '@/shared/api/httpClient'
import type { UpdateCustomer } from '@/types'

export function getTableList(params: any) {
  return httpClient({
    url: '/customer/getCustomerList',
    method: 'get',
    params
  })
}

export function getCustomerNameList() {
  return httpClient({
    url: '/customer/getCustomerNameList',
    method: 'get'
  })
}

export function updateCustomer(data: UpdateCustomer) {
  return httpClient({
    url: '/customer/updateCustomer',
    method: 'post',
    data
  })
}

export function addCustomer(data: UpdateCustomer) {
  return httpClient({
    url: '/customer/addCustomer',
    method: 'post',
    data
  })
}

export function deleteCustomer(id: number | string) {
  return httpClient({
    url: `/customer/deleteCustomer?id=${id}`,
    method: 'post'
  })
}
