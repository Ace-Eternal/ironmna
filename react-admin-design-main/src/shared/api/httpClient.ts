import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import axios from 'axios'
import { message } from 'antd'
import { getToken, clearAuthCache } from '@/utils/auth'
import { getApiBaseUrl } from '@/app/config/env'

const handleError = (error: AxiosError): Promise<AxiosError> => {
  if (error.response?.status === 401 || error.response?.status === 504) {
    clearAuthCache()
    location.href = '/login'
  }
  message.error(error.message || 'error')
  return Promise.reject(error)
}

export const httpClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 10 * 1000
})

httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getToken()
  if (token) {
    ;(config as Recordable).headers['Authorization'] = `${token}`
  }
  ;(config as Recordable).headers['Content-Type'] = 'application/json'
  return config
}, handleError)

httpClient.interceptors.response.use((response: AxiosResponse) => {
  const data = response.data

  if (data.code === 0) {
    return data.data
  }

  message.error(data.message)
  return Promise.reject('error')
}, handleError)

export const service = httpClient
