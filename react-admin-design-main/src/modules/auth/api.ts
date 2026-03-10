import { httpClient } from '@/shared/api/httpClient'

interface LoginParams {
  username: string
  password: string
}

export function loginApi(data: LoginParams): Promise<any> {
  return httpClient({
    url: '/admin/login',
    method: 'post',
    data
  })
}

export function getUserInfo(): Promise<any> {
  return httpClient({
    url: '/admin/getUserInfo',
    method: 'get'
  })
}

export function logoutApi() {
  return httpClient({
    url: '/logout',
    method: 'get'
  })
}
