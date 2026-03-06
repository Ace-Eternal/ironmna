export interface APIResult {
  records: any[]
  total: number
}

export interface PageState {
  current: number
  pageSize: number
}

export interface TableDataType {
  id: number
  customer_name: string
  phone: string
  address: string
}
