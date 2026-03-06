export interface APIResult {
  records: any[]
}

export interface PageState {
  current: number
  pageSize: number
}

export interface CustomerDataType {
  id: number
  customer_name: string
  telephone: string
  address: string
}
