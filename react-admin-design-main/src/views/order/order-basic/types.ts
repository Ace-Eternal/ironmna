export interface APIResult {
  records: any[]
  total: number
}

export interface PageState {
  current: number
  pageSize: number
  customerId?: string
  month?: string
  materialType?: string
  steelType?: string
}

export interface CustomerInfo {
  customer_name: string
  telephone: string
  address: string
}

export interface TableDataType {
  id: number
  customer_name: string
  phone: string
  address: string
  customer?: CustomerInfo
  paid_money: number
}
