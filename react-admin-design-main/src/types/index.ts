export interface LoginParams {
  username: string
  password: string
}

export interface UserInfo {
  userId: string | number
  username: string
  realName: string
  avatar: string
  token: string
  desc?: string
  homePath?: string
}

export type ThemeMode = 'dark' | 'light'

export type LocaleType = 'zh_CN' | 'en'

export interface styleState {
  fontFamily?: string
  fontSize?: string
  lineHeight?: string
  color?: string
  backgroundColor?: string
  fontWeight?: string
  fontStyle?: string
  textShadow?: string
  textAlign?: string
}

export interface UpdateCustomer {
  customerId: number
  telephone: string
  address: string
}

export interface Order {
  customer_id: number
  process_fee: number
  note: string
  orderItems: OrderItem[]
}

export interface OrderItem {
  type: string
  steel_type: string
  length: number
  length_remain: number
  width: number
  width_remain: number
  thickness: number
  thickness_remain: number
  amount: number
  note: string
  monovalent: number
  cut_fee: number
}
