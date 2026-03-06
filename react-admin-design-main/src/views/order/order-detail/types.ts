export interface APIResult {
  records: any[]
  total: number
}

export interface DataItem {
  id: number
  time: string
  process_fee: number
  total_money: number
  paid_money: number
  note: string
  customer: CustomerType
  orderItem: OrderItemType[]
}

export interface OrderItemType {
  id: number
  type: string
  steel_type: string
  length: number
  length_remain: number
  width: number
  width_remain: number
  thickness: number
  thickness_remain: number
  amount: number
  monovent: number
  total_weight: number
  steel_money: number
  cut_fee: number
  note: string
}

export interface CustomerType {
  id: number
  customer_name: string
  phone: string
  address: string
}
