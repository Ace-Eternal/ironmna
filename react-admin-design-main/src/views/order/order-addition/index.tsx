import type { FC, ReactNode } from 'react'
import type { Rule } from 'antd/es/form'
import type { InputNumberProps } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useState } from 'react'
import { Alert, Button, Card, Col, Form, Input, InputNumber, Modal, Row, Select, Space, Table, Tag, Upload, message } from 'antd'
import { DeleteOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons'
import { createOrder, getCustomerNameList, recognizeMaterialSheet } from '@/api'
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

type RecognizedMaterialItem = {
  rowIndex: number
  type?: string
  steel_type?: string
  length: number
  length_remain: number
  width: number
  width_remain: number
  thickness: number
  thickness_remain: number
  amount: number
  monovalent: number
  cut_fee: number
  note?: string
  fieldConfidences?: Record<string, number>
  needsReviewFields?: string[]
  sourceNote?: string
}

type MaterialSheetRecognitionResult = {
  items: RecognizedMaterialItem[]
  overallConfidence: number
  warnings: string[]
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
  const [recognizing, setRecognizing] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [recognizedItems, setRecognizedItems] = useState<RecognizedMaterialItem[]>([])
  const [recognitionWarnings, setRecognitionWarnings] = useState<string[]>([])
  const [recognitionConfidence, setRecognitionConfidence] = useState(0)

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

  const normalizeRecognizedItems = (items: RecognizedMaterialItem[]) =>
    items.map((item, index) => ({
      ...item,
      rowIndex: item.rowIndex || index + 1,
      length: getNumberValue(item.length),
      length_remain: getNumberValue(item.length_remain),
      width: item.type === ROUND_STEEL ? 0 : getNumberValue(item.width),
      width_remain: item.type === ROUND_STEEL ? 0 : getNumberValue(item.width_remain),
      thickness: getNumberValue(item.thickness),
      thickness_remain: getNumberValue(item.thickness_remain),
      amount: getNumberValue(item.amount),
      monovalent: getNumberValue(item.monovalent),
      cut_fee: getNumberValue(item.cut_fee),
      needsReviewFields: item.needsReviewFields || [],
      fieldConfidences: item.fieldConfidences || {}
    }))

  const handleRecognizeMaterialSheet = async (file: File) => {
    setRecognizing(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const data = (await recognizeMaterialSheet(formData)) as unknown as MaterialSheetRecognitionResult
      setRecognizedItems(normalizeRecognizedItems(data.items || []))
      setRecognitionWarnings(data.warnings || [])
      setRecognitionConfidence(getNumberValue(data.overallConfidence))
      setPreviewOpen(true)
    } catch (error) {
      const fallback = error instanceof Error ? error.message : '材料单识别失败'
      message.error(fallback)
    } finally {
      setRecognizing(false)
    }
  }

  const updateRecognizedItem = (index: number, field: keyof RecognizedMaterialItem, value: unknown) => {
    setRecognizedItems(prev =>
      prev.map((item, itemIndex) => {
        if (itemIndex !== index) {
          return item
        }

        const nextItem = {
          ...item,
          [field]: value,
          needsReviewFields: (item.needsReviewFields || []).filter(reviewField => reviewField !== field)
        }

        if (field === 'type' && value === ROUND_STEEL) {
          nextItem.width = 0
          nextItem.width_remain = 0
        }

        return nextItem
      })
    )
  }

  const hasReviewField = (record: RecognizedMaterialItem, field: keyof RecognizedMaterialItem) =>
    Boolean(record.needsReviewFields?.includes(String(field)))

  const renderPreviewCell = (children: ReactNode, record: RecognizedMaterialItem, field: keyof RecognizedMaterialItem) => (
    <div className={hasReviewField(record, field) ? styles.reviewCell : undefined}>{children}</div>
  )

  const confirmRecognizedItems = () => {
    form.setFieldsValue({
      orderItems: recognizedItems.map(item => ({
        type: item.type,
        steel_type: item.steel_type,
        length: getNumberValue(item.length),
        length_remain: getNumberValue(item.length_remain),
        width: item.type === ROUND_STEEL ? 0 : getNumberValue(item.width),
        width_remain: item.type === ROUND_STEEL ? 0 : getNumberValue(item.width_remain),
        thickness: getNumberValue(item.thickness),
        thickness_remain: getNumberValue(item.thickness_remain),
        amount: getNumberValue(item.amount),
        monovalent: getNumberValue(item.monovalent),
        cut_fee: getNumberValue(item.cut_fee),
        note: item.note
      }))
    })
    setPreviewOpen(false)
    message.success('已填入材料明细，请检查高亮字段')
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

  const previewColumns: ColumnsType<RecognizedMaterialItem> = [
    {
      title: '行',
      dataIndex: 'rowIndex',
      width: 64,
      fixed: 'left'
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 120,
      render: (_, record, index) =>
        renderPreviewCell(
          <Select
            className={styles.fullWidth}
            placeholder='类型'
            value={record.type}
            options={typeData.type.map((typeName: string) => ({ value: typeName, label: typeName }))}
            onChange={value => updateRecognizedItem(index, 'type', value)}
          />,
          record,
          'type'
        )
    },
    {
      title: '钢号',
      dataIndex: 'steel_type',
      width: 130,
      render: (_, record, index) =>
        renderPreviewCell(
          <Select
            showSearch
            className={styles.fullWidth}
            placeholder='钢号'
            value={record.steel_type}
            options={steeltypeData.type.map((steelTypeName: string) => ({ value: steelTypeName, label: steelTypeName }))}
            onChange={value => updateRecognizedItem(index, 'steel_type', value)}
          />,
          record,
          'steel_type'
        )
    },
    ...([
      ['length', '长'],
      ['length_remain', '长余量'],
      ['width', '宽'],
      ['width_remain', '宽余量'],
      ['thickness', '厚/直径'],
      ['thickness_remain', '厚余量'],
      ['amount', '数量'],
      ['monovalent', '单价'],
      ['cut_fee', '刀费']
    ] as Array<[keyof RecognizedMaterialItem, string]>).map(([field, title]) => ({
      title,
      dataIndex: field,
      width: 110,
      render: (_: unknown, record: RecognizedMaterialItem, index: number) =>
        renderPreviewCell(
          <InputNumber
            {...(field === 'amount' ? integerInputProps : decimalInputProps)}
            disabled={record.type === ROUND_STEEL && (field === 'width' || field === 'width_remain')}
            value={record[field] as number}
            onChange={value => updateRecognizedItem(index, field, value)}
          />,
          record,
          field
        )
    })),
    {
      title: '备注',
      dataIndex: 'note',
      width: 180,
      render: (_, record, index) =>
        renderPreviewCell(
          <Input value={record.note} placeholder='备注' onChange={event => updateRecognizedItem(index, 'note', event.target.value)} />,
          record,
          'note'
        )
    },
    {
      title: '待确认',
      dataIndex: 'needsReviewFields',
      width: 180,
      render: (_, record) => (
        <Space size={[4, 4]} wrap>
          {(record.needsReviewFields || []).map(field => (
            <Tag key={field} color='orange'>
              {field}
            </Tag>
          ))}
        </Space>
      )
    },
    {
      title: '模型备注',
      dataIndex: 'sourceNote',
      width: 220
    }
  ]

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

          <Card
            size='small'
            className={styles.sectionCard}
            title='材料明细'
            extra={
              <Upload
                accept='image/png,image/jpeg,image/webp'
                showUploadList={false}
                beforeUpload={file => {
                  void handleRecognizeMaterialSheet(file)
                  return Upload.LIST_IGNORE
                }}
              >
                <Button icon={<UploadOutlined />} loading={recognizing}>
                  上传材料单识别
                </Button>
              </Upload>
            }
          >
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

      <Modal
        title='材料单识别预览'
        open={previewOpen}
        width={1180}
        okText='确认填入材料明细'
        cancelText='取消'
        onOk={confirmRecognizedItems}
        onCancel={() => setPreviewOpen(false)}
        okButtonProps={{ disabled: recognizedItems.length === 0 }}
      >
        <Space direction='vertical' className={styles.fullWidth} size={12}>
          <Alert
            showIcon
            type='info'
            message={`整体置信度 ${(recognitionConfidence * 100).toFixed(0)}%，请重点检查高亮字段`}
          />
          {recognitionWarnings.length > 0 && (
            <Alert showIcon type='warning' message='识别提示' description={recognitionWarnings.join('；')} />
          )}
          <Table
            size='small'
            rowKey={(record, index) => `${record.rowIndex}-${index}`}
            columns={previewColumns}
            dataSource={recognizedItems}
            pagination={false}
            scroll={{ x: 1500 }}
          />
        </Space>
      </Modal>
    </div>
  )
}

export default BasicForm
