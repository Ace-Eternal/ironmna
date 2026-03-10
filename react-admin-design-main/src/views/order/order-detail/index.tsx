import type { FC, ReactNode } from 'react'
import type { InputNumberProps } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { Button, Card, Col, Form, Input, InputNumber, Row, Select, Space, Tag, message } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { getDownloadUrl, getOrderDetail, updateOrder } from '@/api'
import { steeltypeData, typeData } from '../order-addition/data'
import styles from './index.module.less'

type Customer = {
  id: number
  customer_name: string
  telephone: string
  address: string
}

type OrderItemId = number | string

type OrderItem = {
  id: OrderItemId
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
  total_weight: number
  steel_money: number
  cut_fee: number
}

type OrderDetail = {
  id: number
  customer_id: number
  time: string
  process_fee: number
  total_money: number
  paid_money: number | null
  note: string
  customer: Customer
  orderItemList: OrderItem[]
}

type EditableField =
  | 'type'
  | 'steel_type'
  | 'length'
  | 'length_remain'
  | 'width'
  | 'width_remain'
  | 'thickness'
  | 'thickness_remain'
  | 'amount'
  | 'monovalent'
  | 'cut_fee'
  | 'note'

const SQUARE_STEEL = typeData.type[0]
const ROUND_STEEL = typeData.type[1]
const NEW_ROW_PREFIX = 'new-item-'

const getNumberValue = (value: unknown) => Number(value) || 0
const isTemporaryRowId = (value: OrderItemId) => String(value).startsWith(NEW_ROW_PREFIX)

const createEmptyOrderItem = (): OrderItem => ({
  id: `${NEW_ROW_PREFIX}${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  type: '',
  steel_type: '',
  length: 0,
  length_remain: 0,
  width: 0,
  width_remain: 0,
  thickness: 0,
  thickness_remain: 0,
  amount: 0,
  note: '',
  monovalent: 0,
  total_weight: 0,
  steel_money: 0,
  cut_fee: 0
})

const decimalInputProps: InputNumberProps = {
  className: styles.fullWidth,
  controls: false,
  step: 0.01,
  min: 0,
  precision: 2,
  inputMode: 'decimal'
}

const integerInputProps: InputNumberProps = {
  className: styles.fullWidth,
  controls: false,
  step: 1,
  min: 0,
  precision: 0,
  inputMode: 'numeric'
}

const calculateWeight = (
  type: string,
  length: number,
  lengthRemain: number,
  width: number,
  widthRemain: number,
  thickness: number,
  thicknessRemain: number,
  amount: number
) => {
  const l = getNumberValue(length)
  const w = getNumberValue(width)
  const t = getNumberValue(thickness)
  const lr = getNumberValue(lengthRemain)
  const wr = getNumberValue(widthRemain)
  const tr = getNumberValue(thicknessRemain)
  const qty = getNumberValue(amount)

  if (type === SQUARE_STEEL) {
    return (qty * (l + lr) * (w + wr) * (t + tr) * 7.85) / 1000000
  }

  return (qty * (t + tr) * (t + tr) * (l + lr) * 0.006167) / 1000
}

const renderMetricValue = (value: number) => {
  if (!Number.isFinite(value) || value <= 0) {
    return '0.00'
  }

  return value.toFixed(2)
}

const TableEditRow: FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const initialOrderDetail = location.state?.orderDetail as OrderDetail | undefined

  const [billForm] = Form.useForm()
  const [rowForm] = Form.useForm()
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(initialOrderDetail || null)
  const [orderItems, setOrderItems] = useState<OrderItem[]>(initialOrderDetail?.orderItemList || [])
  const [editingRowId, setEditingRowId] = useState<OrderItemId | null>(null)
  const [editingBill, setEditingBill] = useState(false)
  const [saving, setSaving] = useState(false)
  const editingRowValues = Form.useWatch([], rowForm) as Partial<OrderItem> | undefined
  const watchedProcessFee = Form.useWatch('process_fee', billForm)

  const syncOrderState = (detail: OrderDetail) => {
    setOrderDetail(detail)
    setOrderItems(detail.orderItemList || [])
    billForm.setFieldsValue({
      process_fee: detail.process_fee,
      paid_money: detail.paid_money,
      note: detail.note
    })
  }

  useEffect(() => {
    if (!initialOrderDetail) {
      navigate('/order/order-basic')
      return
    }

    syncOrderState(initialOrderDetail)
  }, [initialOrderDetail, navigate, billForm])

  const previewOrderItems = useMemo(
    () =>
      orderItems.map(item =>
        item.id === editingRowId && editingRowValues ? { ...item, ...editingRowValues } : item
      ),
    [editingRowId, editingRowValues, orderItems]
  )

  const summary = useMemo(() => {
    const totalWeight = previewOrderItems.reduce(
      (sum, item) =>
        sum +
        calculateWeight(
          item.type,
          item.length,
          item.length_remain,
          item.width,
          item.width_remain,
          item.thickness,
          item.thickness_remain,
          item.amount
        ),
      0
    )

    const processFee = getNumberValue(watchedProcessFee ?? orderDetail?.process_fee)
    const totalAmount = previewOrderItems.reduce((sum, item) => {
      const weight = calculateWeight(
        item.type,
        item.length,
        item.length_remain,
        item.width,
        item.width_remain,
        item.thickness,
        item.thickness_remain,
        item.amount
      )
      return sum + weight * getNumberValue(item.monovalent) + getNumberValue(item.cut_fee)
    }, 0)

    return {
      totalWeight,
      materialAmount: totalAmount,
      totalPayable: totalAmount + processFee
    }
  }, [orderDetail?.process_fee, previewOrderItems, watchedProcessFee])

  if (!orderDetail) {
    return null
  }

  const buildPayload = (items: OrderItem[]) => {
    const billValues = billForm.getFieldsValue()

    return {
      order_id: String(orderDetail.id),
      customer_id: String(orderDetail.customer_id),
      process_fee: getNumberValue(billValues.process_fee),
      paid_money: getNumberValue(billValues.paid_money),
      note: billValues.note || '',
      orderItemVOs: items.map(item => ({
        type: item.type,
        steel_type: item.steel_type,
        length: getNumberValue(item.length),
        length_remain: getNumberValue(item.length_remain),
        width: getNumberValue(item.width),
        width_remain: getNumberValue(item.width_remain),
        thickness: getNumberValue(item.thickness),
        thickness_remain: getNumberValue(item.thickness_remain),
        amount: getNumberValue(item.amount),
        note: item.note || '',
        monovalent: getNumberValue(item.monovalent),
        cut_fee: getNumberValue(item.cut_fee)
      }))
    }
  }

  const persistOrder = async (items: OrderItem[]) => {
    const payload = buildPayload(items)
    setSaving(true)
    try {
      await updateOrder(payload)
      const refreshedOrder = (await getOrderDetail(orderDetail.id)) as unknown as OrderDetail
      syncOrderState(refreshedOrder)
      message.success('保存成功')
    } catch (error) {
      const fallback = error instanceof Error ? error.message : '保存失败'
      message.error(`保存失败: ${fallback}`)
      throw error
    } finally {
      setSaving(false)
    }
  }

  const handleEditBill = () => {
    setEditingBill(true)
  }

  const handleSaveBill = async () => {
    await billForm.validateFields()
    await persistOrder(orderItems)
    setEditingBill(false)
  }

  const handleCancelBill = () => {
    billForm.setFieldsValue({
      process_fee: orderDetail.process_fee,
      paid_money: orderDetail.paid_money,
      note: orderDetail.note
    })
    setEditingBill(false)
  }

  const handleEditRow = (item: OrderItem) => {
    rowForm.setFieldsValue(item)
    setEditingRowId(item.id)
  }

  const handleAddRow = () => {
    if (editingRowId !== null || saving) {
      return
    }

    const newItem = createEmptyOrderItem()
    setOrderItems(prev => [...prev, newItem])
    rowForm.setFieldsValue(newItem)
    setEditingRowId(newItem.id)
  }

  const handleCancelRow = () => {
    if (editingRowId !== null && isTemporaryRowId(editingRowId)) {
      setOrderItems(prev => prev.filter(item => item.id !== editingRowId))
    }
    rowForm.resetFields()
    setEditingRowId(null)
  }

  const handleSaveRow = async (itemId: OrderItemId) => {
    const rowValues = await rowForm.validateFields()
    const nextItems = orderItems.map(item => (item.id === itemId ? { ...item, ...rowValues } : item))
    await persistOrder(nextItems)
    setEditingRowId(null)
  }

  const handleExportOrder = async () => {
    try {
      const fileName = await getDownloadUrl(orderDetail.id)
      if (!fileName) {
        throw new Error('未获取到导出文件')
      }
      window.open(`/iron/order/download?file=${String(fileName)}`, '_blank')
    } catch (error) {
      const fallback = error instanceof Error ? error.message : '导出失败'
      message.error(`导出失败: ${fallback}`)
    }
  }

  const renderEditableField = (item: OrderItem, field: EditableField) => {
    const editing = editingRowId === item.id
    const currentType = editing ? rowForm.getFieldValue('type') || item.type : item.type
    const isRoundSteel = currentType === ROUND_STEEL

    if (!editing) {
      if ((field === 'width' || field === 'width_remain') && isRoundSteel) {
        return <span className={styles.emptyValue}>-</span>
      }

      if (field === 'thickness') {
        return <span>{item.thickness}</span>
      }

      return <span>{(item as Record<string, unknown>)[field] as ReactNode}</span>
    }

    if ((field === 'width' || field === 'width_remain') && isRoundSteel) {
      return <span className={styles.emptyValue}>-</span>
    }

    switch (field) {
      case 'type':
        return (
          <Form.Item name='type' className={styles.inlineItem} rules={[{ required: true, message: '请选择类型' }]}>
            <Select
              options={typeData.type.map(typeName => ({
                value: typeName,
                label: typeName
              }))}
            />
          </Form.Item>
        )
      case 'steel_type':
        return (
          <Form.Item name='steel_type' className={styles.inlineItem} rules={[{ required: true, message: '请选择钢号' }]}>
            <Select
              options={steeltypeData.type.map(typeName => ({
                value: typeName,
                label: typeName
              }))}
            />
          </Form.Item>
        )
      case 'amount':
        return (
          <Form.Item name='amount' className={styles.inlineItem} rules={[{ required: true, message: '请输入数量' }]}>
            <InputNumber {...integerInputProps} />
          </Form.Item>
        )
      case 'note':
        return (
          <Form.Item name='note' className={styles.inlineItem}>
            <Input />
          </Form.Item>
        )
      case 'thickness':
        return (
          <Form.Item name='thickness' className={styles.inlineItem} rules={[{ required: true, message: '请输入厚度或直径' }]}>
            <InputNumber {...decimalInputProps} placeholder={currentType === ROUND_STEEL ? '直径' : '厚'} />
          </Form.Item>
        )
      default:
        return (
          <Form.Item name={field} className={styles.inlineItem} rules={[{ required: true, message: '请完善当前行数据' }]}>
            <InputNumber {...decimalInputProps} />
          </Form.Item>
        )
    }
  }

  return (
    <div className={styles.pageShell}>
      <Card bordered={false} className={styles.pageCard}>
        <div className={styles.headerBar}>
          <div>
            <h3 className={styles.pageTitle}>账单详情</h3>
          </div>
          <Button type='primary' onClick={handleExportOrder}>
            导出账单
          </Button>
        </div>

        <Card size='small' className={styles.sectionCard} title='账单概览'>
          <div className={styles.tagRow}>
            <Tag color='blue'>订单号: {orderDetail.id}</Tag>
            <Tag color='green'>客户: {orderDetail.customer?.customer_name}</Tag>
            <Tag color='orange'>电话: {orderDetail.customer?.telephone}</Tag>
            <Tag color='gold'>下单时间: {dayjs(orderDetail.time).format('YYYY-MM-DD HH:mm')}</Tag>
          </div>
          <Form form={billForm} layout='vertical'>
            <Row gutter={16}>
              <Col xs={24} md={6}>
                <Form.Item label='加工费' name='process_fee' rules={[{ required: true, message: '请输入加工费' }]}>
                  <InputNumber {...decimalInputProps} disabled={!editingBill} />
                </Form.Item>
              </Col>
              <Col xs={24} md={6}>
                <Form.Item label='已付金额' name='paid_money'>
                  <InputNumber {...decimalInputProps} disabled={!editingBill} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label='备注' name='note'>
                  <Input disabled={!editingBill} />
                </Form.Item>
              </Col>
            </Row>
          </Form>

          <div className={styles.summaryBar}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>总重量</span>
              <strong>{renderMetricValue(summary.totalWeight)} kg</strong>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>材料金额</span>
              <strong>{renderMetricValue(summary.materialAmount)}</strong>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>账单总额</span>
              <strong>{renderMetricValue(summary.totalPayable)}</strong>
            </div>
          </div>

          <div className={styles.toolbar}>
            {editingBill ? (
              <Space>
                <Button type='primary' onClick={handleSaveBill} loading={saving}>
                  保存账单信息
                </Button>
                <Button onClick={handleCancelBill}>取消</Button>
              </Space>
            ) : (
              <Button onClick={handleEditBill}>编辑账单信息</Button>
            )}
          </div>
        </Card>

        <Card size='small' className={styles.sectionCard} title='材料明细'>
          <div className={styles.toolbar}>
            <Button type='dashed' icon={<PlusOutlined />} onClick={handleAddRow} disabled={editingRowId !== null || saving}>
              添加新材料项
            </Button>
          </div>

          <div className={styles.tableScroller}>
            <div className={styles.detailTable}>
              <div className={styles.tableHead}>
                <div className={styles.headCell} style={{ width: 110 }}>类型</div>
                <div className={styles.headCell} style={{ width: 120 }}>钢号</div>
                <div className={styles.headCell} style={{ width: 84 }}>长</div>
                <div className={styles.headCell} style={{ width: 84 }}>余量</div>
                <div className={styles.headCell} style={{ width: 84 }}>宽</div>
                <div className={styles.headCell} style={{ width: 84 }}>余量</div>
                <div className={styles.headCell} style={{ width: 92 }}>厚/直径</div>
                <div className={styles.headCell} style={{ width: 84 }}>余量</div>
                <div className={styles.headCell} style={{ width: 80 }}>数量</div>
                <div className={styles.headCell} style={{ width: 96 }}>重量(kg)</div>
                <div className={styles.headCell} style={{ width: 90 }}>单价</div>
                <div className={styles.headCell} style={{ width: 90 }}>刀费</div>
                <div className={styles.headCell} style={{ width: 100 }}>金额</div>
                <div className={styles.headCell} style={{ width: 180 }}>备注</div>
                <div className={styles.headCell} style={{ width: 130 }}>操作</div>
              </div>

              <Form form={rowForm} component={false}>
                <div className={styles.tableBody}>
                  {orderItems.map(item => {
                    const currentItem = item.id === editingRowId && editingRowValues ? { ...item, ...editingRowValues } : item
                    const rowType = currentItem.type || item.type
                    const isRoundSteel = rowType === ROUND_STEEL
                    const weight = calculateWeight(
                      rowType,
                      getNumberValue(currentItem.length),
                      getNumberValue(currentItem.length_remain),
                      getNumberValue(currentItem.width),
                      getNumberValue(currentItem.width_remain),
                      getNumberValue(currentItem.thickness),
                      getNumberValue(currentItem.thickness_remain),
                      getNumberValue(currentItem.amount)
                    )
                    const amountMoney =
                      weight * getNumberValue(currentItem.monovalent) + getNumberValue(currentItem.cut_fee)

                    return (
                      <div key={String(item.id)} className={styles.tableRow}>
                        <div className={styles.tableCell} style={{ width: 110 }}>{renderEditableField(item, 'type')}</div>
                        <div className={styles.tableCell} style={{ width: 120 }}>{renderEditableField(item, 'steel_type')}</div>
                        <div className={styles.tableCell} style={{ width: 84 }}>{renderEditableField(item, 'length')}</div>
                        <div className={styles.tableCell} style={{ width: 84 }}>{renderEditableField(item, 'length_remain')}</div>
                        <div className={`${styles.tableCell} ${isRoundSteel ? styles.emptyCell : ''}`} style={{ width: 84 }}>
                          {renderEditableField(item, 'width')}
                        </div>
                        <div className={`${styles.tableCell} ${isRoundSteel ? styles.emptyCell : ''}`} style={{ width: 84 }}>
                          {renderEditableField(item, 'width_remain')}
                        </div>
                        <div className={styles.tableCell} style={{ width: 92 }}>{renderEditableField(item, 'thickness')}</div>
                        <div className={styles.tableCell} style={{ width: 84 }}>{renderEditableField(item, 'thickness_remain')}</div>
                        <div className={styles.tableCell} style={{ width: 80 }}>{renderEditableField(item, 'amount')}</div>
                        <div className={styles.tableCell} style={{ width: 96 }}>
                          <div className={styles.metricBox}>{renderMetricValue(weight)}</div>
                        </div>
                        <div className={styles.tableCell} style={{ width: 90 }}>{renderEditableField(item, 'monovalent')}</div>
                        <div className={styles.tableCell} style={{ width: 90 }}>{renderEditableField(item, 'cut_fee')}</div>
                        <div className={styles.tableCell} style={{ width: 100 }}>
                          <div className={`${styles.metricBox} ${styles.metricAccent}`}>{renderMetricValue(amountMoney)}</div>
                        </div>
                        <div className={styles.tableCell} style={{ width: 180 }}>{renderEditableField(item, 'note')}</div>
                        <div className={styles.tableCell} style={{ width: 130 }}>
                          {editingRowId === item.id ? (
                            <Space size='small'>
                              <Button type='primary' size='small' onClick={() => void handleSaveRow(item.id)} loading={saving}>
                                保存
                              </Button>
                              <Button size='small' onClick={handleCancelRow}>
                                取消
                              </Button>
                            </Space>
                          ) : (
                            <Button size='small' onClick={() => handleEditRow(item)} disabled={editingRowId !== null || saving}>
                              编辑
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Form>
            </div>
          </div>
        </Card>
      </Card>
    </div>
  )
}

export default TableEditRow
