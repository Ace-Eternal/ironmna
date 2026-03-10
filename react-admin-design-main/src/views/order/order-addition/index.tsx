import type { FC } from 'react'
import type { Rule } from 'antd/es/form'
import type { InputNumberProps } from 'antd'
import { useEffect, useState } from 'react'
import { Button, Card, Col, Form, Input, InputNumber, Row, Select, message } from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { createOrder, getCustomerNameList } from '@/api'
import { steeltypeData, typeData } from './data'
import type { APIResult, CustomerDataType } from './types'
import styles from './index.module.less'

type MaterialFieldName =
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

type MaterialColumn = {
  key: MaterialFieldName | 'weight' | 'amount_money' | 'actions'
  label: string
  width: number
}

const materialColumns: MaterialColumn[] = [
  { key: 'type', label: '类型', width: 120 },
  { key: 'steel_type', label: '钢号', width: 130 },
  { key: 'length', label: '长', width: 96 },
  { key: 'length_remain', label: '余量', width: 96 },
  { key: 'width', label: '宽', width: 96 },
  { key: 'width_remain', label: '余量', width: 96 },
  { key: 'thickness', label: '厚/直径', width: 108 },
  { key: 'thickness_remain', label: '余量', width: 96 },
  { key: 'amount', label: '数量', width: 90 },
  { key: 'weight', label: '重量(kg)', width: 116 },
  { key: 'monovalent', label: '单价', width: 104 },
  { key: 'cut_fee', label: '刀费', width: 104 },
  { key: 'amount_money', label: '金额', width: 116 },
  { key: 'note', label: '备注', width: 180 },
  { key: 'actions', label: '操作', width: 112 }
]

const SQUARE_STEEL = typeData.type[0]
const ROUND_STEEL = typeData.type[1]

const formRules: Record<string, Rule[]> = {
  lengthLimit: [{ required: true, message: '材料长度不能为空' }],
  lengthRemainLimit: [{ required: true, message: '材料长度余量不能为空' }],
  thicknessLimit: [{ required: true, message: '材料厚度不能为空' }],
  thicknessRemainLimit: [{ required: true, message: '材料厚度余量不能为空' }],
  amountLimit: [{ required: true, message: '材料数量不能为空' }],
  monovalentLimit: [{ required: true, message: '材料单价不能为空' }],
  cutFeeLimit: [{ required: true, message: '刀费不能为空' }],
  processFeeLimit: [{ required: true, message: '加工费不能为空' }],
  selectCustomerLimit: [{ required: true, message: '请选择一个客户' }],
  selectTypeLimit: [{ required: true, message: '请选择材料类型' }],
  selectSteelTypeLimit: [{ required: true, message: '请选择钢号' }]
}

const getNumberValue = (value: unknown) => Number(value) || 0

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

const BasicForm: FC = () => {
  const [form] = Form.useForm()
  const [customers, setCustomers] = useState<CustomerDataType[]>([])

  useEffect(() => {
    const fetchCustomers = async () => {
      const data = await getCustomerNameList()
      const { records } = data as unknown as APIResult
      setCustomers(records)
    }

    void fetchCustomers()
  }, [])

  const resetForm = () => {
    form.resetFields()
  }

  const handleAddOrder = async () => {
    try {
      const values = await form.validateFields()
      await createOrder({
        ...values,
        time: Date.now()
      })
      message.success('创建订单成功')
      form.resetFields()
    } catch (error) {
      const fallback = error instanceof Error ? error.message : '请检查表单内容'
      message.error(`创建订单失败: ${fallback}`)
    }
  }

  const orderItems = Form.useWatch('orderItems', form) || []
  const processFee = getNumberValue(Form.useWatch('process_fee', form))

  const summary = orderItems.reduce(
    (acc: { totalWeight: number; totalAmount: number }, item: Record<string, unknown>) => {
      const weight = calculateWeight(
        String(item?.type || ''),
        getNumberValue(item?.length),
        getNumberValue(item?.length_remain),
        getNumberValue(item?.width),
        getNumberValue(item?.width_remain),
        getNumberValue(item?.thickness),
        getNumberValue(item?.thickness_remain),
        getNumberValue(item?.amount)
      )
      const amountMoney = weight * getNumberValue(item?.monovalent) + getNumberValue(item?.cut_fee)

      return {
        totalWeight: acc.totalWeight + weight,
        totalAmount: acc.totalAmount + amountMoney
      }
    },
    { totalWeight: 0, totalAmount: 0 }
  )

  const totalPayable = summary.totalAmount + processFee

  return (
    <div className={styles.pageShell}>
      <Card bordered={false} className={styles.pageCard}>
        <div className={styles.pageHeader}>
          <div>
            <h3 className={styles.pageTitle}>添加账单</h3>
          </div>
        </div>

        <Form
          form={form}
          layout='vertical'
          initialValues={{
            orderItems: [{}]
          }}
          className={styles.form}
        >
          <Card size='small' className={styles.sectionCard} title='客户信息'>
            <Row gutter={16}>
              <Col xs={24} md={16} lg={12}>
                <Form.Item label='选择客户' name='customer_id' rules={formRules.selectCustomerLimit}>
                  <Select
                    showSearch
                    placeholder='请选择客户'
                    optionFilterProp='label'
                    options={customers.map((customer: CustomerDataType) => ({
                      value: customer.id,
                      label: `${customer.customer_name} (${customer.telephone || '无电话'})`
                    }))}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card size='small' className={styles.sectionCard} title='账单信息'>
            <Row gutter={16}>
              <Col xs={24} md={8} lg={6}>
                <Form.Item label='加工费' name='process_fee' rules={formRules.processFeeLimit}>
                  <InputNumber {...decimalInputProps} placeholder='请输入加工费' />
                </Form.Item>
              </Col>
              <Col xs={24} md={16} lg={18}>
                <Form.Item label='备注' name='note'>
                  <Input placeholder='请输入备注信息' />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card size='small' className={styles.sectionCard} title='材料明细'>
            <Form.List name='orderItems'>
              {(fields, { add, remove }) => (
                <>
                  <div className={styles.tableScroller}>
                    <div className={styles.materialTable} style={{ minWidth: materialColumns.reduce((sum, col) => sum + col.width, 0) }}>
                      <div className={styles.tableHead}>
                        {materialColumns.map(column => (
                          <div
                            key={column.key}
                            className={styles.headCell}
                            style={{ width: column.width, minWidth: column.width }}
                          >
                            {column.label}
                          </div>
                        ))}
                      </div>

                      <div className={styles.tableBody}>
                        {fields.map(field => {
                          const item = orderItems[field.name] || {}
                          const itemType = String(item?.type || '')
                          const isRoundSteel = itemType === ROUND_STEEL
                          const thicknessPlaceholder = itemType === SQUARE_STEEL ? '厚' : itemType === ROUND_STEEL ? '直径' : '厚/直径'

                          const weight = calculateWeight(
                            itemType,
                            getNumberValue(item?.length),
                            getNumberValue(item?.length_remain),
                            getNumberValue(item?.width),
                            getNumberValue(item?.width_remain),
                            getNumberValue(item?.thickness),
                            getNumberValue(item?.thickness_remain),
                            getNumberValue(item?.amount)
                          )
                          const amountMoney = weight * getNumberValue(item?.monovalent) + getNumberValue(item?.cut_fee)

                          return (
                            <div key={field.key} className={styles.tableRow}>
                              <div className={styles.tableCell} style={{ width: 120, minWidth: 120 }}>
                                <Form.Item
                                  {...field}
                                  name={[field.name, 'type']}
                                  className={styles.inlineItem}
                                  rules={formRules.selectTypeLimit}
                                >
                                  <Select
                                    placeholder='类型'
                                    options={typeData.type.map((typeName: string) => ({
                                      value: typeName,
                                      label: typeName
                                    }))}
                                  />
                                </Form.Item>
                              </div>

                              <div className={styles.tableCell} style={{ width: 130, minWidth: 130 }}>
                                <Form.Item
                                  {...field}
                                  name={[field.name, 'steel_type']}
                                  className={styles.inlineItem}
                                  rules={formRules.selectSteelTypeLimit}
                                >
                                  <Select
                                    placeholder='钢号'
                                    options={steeltypeData.type.map((steelTypeName: string) => ({
                                      value: steelTypeName,
                                      label: steelTypeName
                                    }))}
                                  />
                                </Form.Item>
                              </div>

                              <div className={styles.tableCell} style={{ width: 96, minWidth: 96 }}>
                                <Form.Item
                                  {...field}
                                  name={[field.name, 'length']}
                                  className={styles.inlineItem}
                                  rules={formRules.lengthLimit}
                                >
                                  <InputNumber {...decimalInputProps} placeholder='长' />
                                </Form.Item>
                              </div>

                              <div className={styles.tableCell} style={{ width: 96, minWidth: 96 }}>
                                <Form.Item
                                  {...field}
                                  name={[field.name, 'length_remain']}
                                  className={styles.inlineItem}
                                  rules={formRules.lengthRemainLimit}
                                >
                                  <InputNumber {...decimalInputProps} placeholder='余量' />
                                </Form.Item>
                              </div>

                              <div
                                className={`${styles.tableCell} ${isRoundSteel ? styles.emptyFieldCell : ''}`}
                                style={{ width: 96, minWidth: 96 }}
                              >
                                {!isRoundSteel && (
                                  <Form.Item {...field} name={[field.name, 'width']} className={styles.inlineItem}>
                                    <InputNumber {...decimalInputProps} placeholder='宽' />
                                  </Form.Item>
                                )}
                              </div>

                              <div
                                className={`${styles.tableCell} ${isRoundSteel ? styles.emptyFieldCell : ''}`}
                                style={{ width: 96, minWidth: 96 }}
                              >
                                {!isRoundSteel && (
                                  <Form.Item {...field} name={[field.name, 'width_remain']} className={styles.inlineItem}>
                                    <InputNumber {...decimalInputProps} placeholder='余量' />
                                  </Form.Item>
                                )}
                              </div>

                              <div className={styles.tableCell} style={{ width: 108, minWidth: 108 }}>
                                <Form.Item
                                  {...field}
                                  name={[field.name, 'thickness']}
                                  className={styles.inlineItem}
                                  rules={formRules.thicknessLimit}
                                >
                                  <InputNumber {...decimalInputProps} placeholder={thicknessPlaceholder} />
                                </Form.Item>
                              </div>

                              <div className={styles.tableCell} style={{ width: 96, minWidth: 96 }}>
                                <Form.Item
                                  {...field}
                                  name={[field.name, 'thickness_remain']}
                                  className={styles.inlineItem}
                                  rules={formRules.thicknessRemainLimit}
                                >
                                  <InputNumber {...decimalInputProps} placeholder='余量' />
                                </Form.Item>
                              </div>

                              <div className={styles.tableCell} style={{ width: 90, minWidth: 90 }}>
                                <Form.Item
                                  {...field}
                                  name={[field.name, 'amount']}
                                  className={styles.inlineItem}
                                  rules={formRules.amountLimit}
                                >
                                  <InputNumber {...integerInputProps} placeholder='数量' />
                                </Form.Item>
                              </div>

                              <div className={styles.tableCell} style={{ width: 116, minWidth: 116 }}>
                                <div className={styles.metricBox}>{renderMetricValue(weight)}</div>
                              </div>

                              <div className={styles.tableCell} style={{ width: 104, minWidth: 104 }}>
                                <Form.Item
                                  {...field}
                                  name={[field.name, 'monovalent']}
                                  className={styles.inlineItem}
                                  rules={formRules.monovalentLimit}
                                >
                                  <InputNumber {...decimalInputProps} placeholder='单价' />
                                </Form.Item>
                              </div>

                              <div className={styles.tableCell} style={{ width: 104, minWidth: 104 }}>
                                <Form.Item
                                  {...field}
                                  name={[field.name, 'cut_fee']}
                                  className={styles.inlineItem}
                                  rules={formRules.cutFeeLimit}
                                >
                                  <InputNumber {...decimalInputProps} placeholder='刀费' />
                                </Form.Item>
                              </div>

                              <div className={styles.tableCell} style={{ width: 116, minWidth: 116 }}>
                                <div className={`${styles.metricBox} ${styles.metricAccent}`}>{renderMetricValue(amountMoney)}</div>
                              </div>

                              <div className={styles.tableCell} style={{ width: 180, minWidth: 180 }}>
                                <Form.Item {...field} name={[field.name, 'note']} className={styles.inlineItem}>
                                  <Input placeholder='备注' />
                                </Form.Item>
                              </div>

                              <div className={styles.tableCell} style={{ width: 112, minWidth: 112 }}>
                                <div className={styles.rowActions}>
                                  <Button
                                    type='text'
                                    icon={<PlusOutlined />}
                                    onClick={() => add({})}
                                    className={styles.iconButton}
                                  />
                                  <Button
                                    danger
                                    type='text'
                                    icon={<DeleteOutlined />}
                                    onClick={() => remove(field.name)}
                                    disabled={fields.length === 1}
                                    className={styles.iconButton}
                                  />
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  <div className={styles.tableFooter}>
                    <Button type='dashed' onClick={() => add({})} icon={<PlusOutlined />}>
                      添加新行
                    </Button>
                    <div className={styles.summaryBar}>
                      <div className={styles.summaryItem}>
                        <span className={styles.summaryLabel}>总重量</span>
                        <strong>{renderMetricValue(summary.totalWeight)} kg</strong>
                      </div>
                      <div className={styles.summaryItem}>
                        <span className={styles.summaryLabel}>材料金额</span>
                        <strong>{renderMetricValue(summary.totalAmount)}</strong>
                      </div>
                      <div className={styles.summaryItem}>
                        <span className={styles.summaryLabel}>账单总额</span>
                        <strong>{renderMetricValue(totalPayable)}</strong>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </Form.List>
          </Card>

          <Form.Item className={styles.actionBar}>
            <Button type='primary' onClick={handleAddOrder}>
              提交
            </Button>
            <Button onClick={resetForm}>重置</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default BasicForm
