import type { CascaderProps, TreeSelectProps } from 'antd'
import type { Rule } from 'antd/es/form'
import { type FC, useState, useEffect } from 'react'
import {
  Card,
  Form,
  Row,
  Col,
  Input,
  InputNumber,
  Button,
  Select,
  DatePicker,
  TimePicker,
  Switch,
  Slider,
  Cascader,
  TreeSelect,
  Radio,
  Checkbox
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { FORM_COMPO } from '@/settings/websiteSetting'
import { PageWrapper } from '@/components/Page'
import {
  provinceData,
  cityData,
  cascaderData,
  treeData,
  radioData,
  checkboxData,
  typeData,
  steeltypeData
} from './data'
import { addCustomer, createOrder } from '@/api'

import { message } from 'antd'

import { getCustomerNameList } from '@/api'
import type { APIResult, CustomerDataType } from './types'

const BasicForm: FC = () => {
  const [form] = Form.useForm()

  const province = provinceData[0]
  const [formState] = useState({
    inputLimit: '',
    inputNum: '',
    password: '',
    selectProvince: province,
    selectCity: cityData[province][0],
    dateVal: '',
    timeVal: '',
    switchVal: true,
    sliderVal: 32,
    cascaderVal: [],
    cascaderLazy: [],
    treeVal: ['0-0-1'],
    treeLazy: '1',
    radioVal: 'offline',
    checkboxVal: ['read'],
    textareaVal: ''
  })

  const formRules: Record<string, Rule[]> = {
    lengthLimit: [{ required: true, message: '材料长度不能为空' }],
    lengthRemainLimit: [{ required: true, message: '材料长度余量不能为空' }],
    thicknessLimit: [{ required: true, message: '材料厚度不能为空' }],
    thicknessRemainLimit: [{ required: true, message: '材料厚度余量不能为空' }],
    amountLimit: [{ required: true, message: '材料件数不能为空' }],
    monovalentLimit: [{ required: true, message: '材料单价不能为空' }],
    cutFeeLimit: [{ required: true, message: '刀费不能为空' }],
    processFeeLimit: [{ required: true, message: '加工费不能为空' }],
    selectCustomerLimit: [{ required: true, message: '请选择一个客户！' }],
    selectTypeLimit: [{ required: true, message: '请选择材料类型！' }],
    selectSteelTypeLimit: [{ required: true, message: '请选择钢号！' }]
  }

  const switchVal = Form.useWatch('switchVal', form)

  const [cascaderLazyData, setCascaderLazyData] = useState<CascaderProps['options']>([
    { value: 1, label: '选项1', isLeaf: false }
  ])

  const [treeLazyData, setTreeLazyData] = useState<TreeSelectProps['treeData']>([
    { id: 1, pId: 0, value: '1', title: 'Expand to load' },
    { id: 2, pId: 0, value: '2', title: 'Expand to load' },
    { id: 3, pId: 0, value: '3', title: 'Tree Node', isLeaf: true }
  ])

  // 客户姓名+手机号列表
  const [customerDate, setCustomerDate] = useState<CustomerDataType[]>([])

  const handleProvinceChange = (value: any) => {
    form.setFieldsValue({ selectCity: cityData[value][0] })
  }

  const loadCascaderLazy = (selectedOptions: any) => {
    const targetOption = selectedOptions[selectedOptions.length - 1]
    targetOption.loading = true

    setTimeout(() => {
      targetOption.loading = false
      let id = selectedOptions.length
      const level = selectedOptions.length
      targetOption.children = Array.from({ length: level + 1 }).map(() => ({
        value: ++id,
        label: `选项${id}`,
        isLeaf: level >= 2
      }))
      setCascaderLazyData([...cascaderLazyData!])
    }, 1000)
  }

  const loadTreeLazy: TreeSelectProps['loadData'] = ({ id }) => {
    const genTreeNode = (parentId: number, isLeaf = false) => {
      const random = Math.random().toString(36).substring(2, 6)
      return {
        id: random,
        pId: parentId,
        value: random,
        title: isLeaf ? 'Tree Node' : 'Expand to load',
        isLeaf
      }
    }

    return new Promise(resolve => {
      setTimeout(() => {
        setTreeLazyData(treeLazyData?.concat([genTreeNode(id, false), genTreeNode(id, true), genTreeNode(id, true)]))
        resolve(undefined)
      }, 500)
    })
  }

  const onFinish = (values: any) => {
    console.log('Success:', values)
  }

  const resetForm = () => {
    form.resetFields()
  }

  function handleAddOrder() {
    const formData = form.getFieldsValue()
    formData.time = Date.now()
    console.log('here is time')
    createOrder(formData)
      .then(() => {
        // 成功时显示消息
        message.success('创建订单成功！')
        form.resetFields() //（可选）成功后可重置表单
      })
      .catch(error => {
        // 失败时显示错误信息
        message.error(`创建订单失败: ${error.message}`)
      })
  }

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const data = await getCustomerNameList()
    const { records } = data as unknown as APIResult
    setCustomerDate(records)
  }

  interface MaterialRowType {
    key: number
    materialType?: string
    length?: string
    lengthAllowance?: string
    width?: string
    widthAllowance?: string
    height?: string
    heightAllowance?: string
  }

  const [rows, setRows] = useState<MaterialRowType[]>([{ key: 0 }])
  const addNewRow = () => {
    setRows([...rows, { key: rows.length }])
  }

  const calculateWeight = (
    type: string,
    length: number,
    length_remain: number,
    width: number,
    width_remain: number,
    thickness: number,
    thickness_remain: number,
    amount: number
  ) => {
    const l = Number(length) || 0
    const w = Number(width) || 0
    const t = Number(thickness) || 0
    const lr = Number(length_remain) || 0
    const wr = Number(width_remain) || 0
    const tr = Number(thickness_remain) || 0
    if (type === '方钢') {
      return (amount * (l + lr) * (w + wr) * (t + tr) * 7.85) / 1000000
    } else {
      return (amount * (t + tr) * (t + tr) * (l + lr) * 0.006167) / 1000
    }
  }

  return (
    <PageWrapper plugin={FORM_COMPO}>
      <Card bordered={false}>
        <Form
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          initialValues={{ ...formState }}
          style={{ width: '100%', margin: '0 auto' }}
          onFinish={onFinish}
        >
          {/* 选择客户姓名列表 */}
          <Form.Item label='选择客户:'>
            <Row gutter={12}>
              <Col span={20}>
                <Form.Item name='customer_id' rules={formRules.selectCustomerLimit}>
                  <Select
                    options={customerDate.map((customer: CustomerDataType) => ({
                      value: customer.id,
                      label: `${customer.customer_name} (${customer.telephone})`
                    }))}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
          {/* 选择日期 */}
          {/* <Form.Item label='日期和时间选择器:' name='time'>
            <Row gutter={12}>
              <Col span={12}>
                <DatePicker placeholder='选择日期' style={{ width: '100%' }} />
              </Col>
              <Col span={12}>
                <Form.Item name='timeVal'>
                  <TimePicker placeholder='选择时间' style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item> */}
          {/* 每一件材料 */}

          {/* 表头 */}
          <Row gutter={8} style={{ marginBottom: 8 }}>
            {/* 表头行 - 总span=24 */}
            <Col span={2}>
              <div className='compact-label'>类型</div>
            </Col>
            <Col span={2}>
              <div className='compact-label'>钢号</div>
            </Col>
            <Col span={1}>
              <div className='compact-label'>长</div>
            </Col>
            <Col span={1}>
              <div className='compact-label'>余量</div>
            </Col>
            <Col span={1}>
              <div className='compact-label'>宽</div>
            </Col>
            <Col span={1}>
              <div className='compact-label'>余量</div>
            </Col>
            <Col span={1}>
              <div className='compact-label'>厚/直径</div>
            </Col>
            <Col span={1}>
              <div className='compact-label'>余量</div>
            </Col>
            <Col span={1}>
              <div className='compact-label'>数量</div>
            </Col>
            <Col span={2}>
              <div className='compact-label'>重量(kg)</div>
            </Col>
            <Col span={2}>
              <div className='compact-label'>单价</div>
            </Col>
            <Col span={2}>
              <div className='compact-label'>刀费</div>
            </Col>
            <Col span={2}>
              <div className='compact-label'>金额</div>
            </Col>
            <Col span={2}>
              <div className='compact-label'>备注</div>
            </Col>
            <Col span={2}>
              <div className='compact-label'>操作</div>
            </Col>
          </Row>
          {/* 动态行 */}
          <Form.List name='orderItems'>
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => {
                  // Get current field values for weight calculation
                  const type = form.getFieldValue(['orderItems', field.name, 'type'])
                  const length = form.getFieldValue(['orderItems', field.name, 'length'])
                  const length_remain = form.getFieldValue(['orderItems', field.name, 'length_remain'])
                  const width = form.getFieldValue(['orderItems', field.name, 'width'])
                  const width_remain = form.getFieldValue(['orderItems', field.name, 'width_remain'])
                  const thickness = form.getFieldValue(['orderItems', field.name, 'thickness'])
                  const thickness_remain = form.getFieldValue(['orderItems', field.name, 'thickness_remain'])
                  const amount = form.getFieldValue(['orderItems', field.name, 'amount'])
                  const monovalent = form.getFieldValue(['orderItems', field.name, 'monovalent'])
                  const cut_fee = form.getFieldValue(['orderItems', field.name, 'cut_fee'])
                  const weight = calculateWeight(
                    type,
                    length,
                    length_remain,
                    width,
                    width_remain,
                    thickness,
                    thickness_remain,
                    amount
                  )
                  return (
                    <Row key={rows[index].key} gutter={8} style={{ marginBottom: 8 }}>
                      {/* 表单行 - 总span=24 */}
                      <Col span={2}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'type']}
                          style={{ marginBottom: 0 }}
                          rules={formRules.selectTypeLimit}
                        >
                          <Select
                            placeholder='材料类型'
                            options={typeData.type.map((typeName: string) => ({
                              value: typeName,
                              label: typeName
                            }))}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'steel_type']}
                          style={{ marginBottom: 0 }}
                          rules={formRules.selectSteelTypeLimit}
                        >
                          <Select
                            placeholder='钢号'
                            options={steeltypeData.type.map((steeltypeName: string) => ({
                              value: steeltypeName,
                              label: steeltypeName
                            }))}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={1}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'length']}
                          style={{ marginBottom: 0 }}
                          rules={formRules.lengthLimit}
                        >
                          <InputNumber placeholder='长' />
                        </Form.Item>
                      </Col>
                      <Col span={1}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'length_remain']}
                          style={{ marginBottom: 0 }}
                          rules={formRules.lengthRemainLimit}
                        >
                          <InputNumber placeholder='余量' />
                        </Form.Item>
                      </Col>
                      <Col span={1}>
                        <Form.Item {...field} name={[field.name, 'width']} style={{ marginBottom: 0 }}>
                          <InputNumber placeholder='宽' />
                        </Form.Item>
                      </Col>
                      <Col span={1}>
                        <Form.Item {...field} name={[field.name, 'width_remain']} style={{ marginBottom: 0 }}>
                          <InputNumber placeholder='余量' />
                        </Form.Item>
                      </Col>
                      <Col span={1}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'thickness']}
                          style={{ marginBottom: 0 }}
                          rules={formRules.thicknessLimit}
                        >
                          <InputNumber placeholder='高' />
                        </Form.Item>
                      </Col>
                      <Col span={1}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'thickness_remain']}
                          style={{ marginBottom: 0 }}
                          rules={formRules.thicknessRemainLimit}
                        >
                          <InputNumber placeholder='余量' />
                        </Form.Item>
                      </Col>
                      <Col span={1}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'amount']}
                          style={{ marginBottom: 0 }}
                          rules={formRules.amountLimit}
                        >
                          <InputNumber placeholder='数量' />
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        <div
                          style={{
                            padding: '4px 0',
                            textAlign: 'center',
                            backgroundColor: '#f5f5f5',
                            borderRadius: 4,
                            fontSize: 12,
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {weight ? weight.toFixed(2) : '0.00'}
                        </div>
                      </Col>
                      <Col span={2}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'monovalent']}
                          style={{ marginBottom: 0 }}
                          rules={formRules.monovalentLimit}
                        >
                          <InputNumber placeholder='单价' />
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'cut_fee']}
                          style={{ marginBottom: 0 }}
                          rules={formRules.cutFeeLimit}
                        >
                          <InputNumber placeholder='刀费' />
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        <div
                          style={{
                            padding: '4px 0',
                            textAlign: 'center',
                            backgroundColor: '#f5f5f5',
                            borderRadius: 4,
                            fontSize: 12,
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {weight * monovalent + cut_fee ? (weight * monovalent + cut_fee).toFixed(2) : '0.00'}
                        </div>
                      </Col>
                      <Col span={2}>
                        <Form.Item {...field} name={[field.name, 'note']} style={{ marginBottom: 0 }}>
                          <Input placeholder='备注' />
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        <Button onClick={() => addNewRow()} size='small' style={{ height: '100%', marginRight: '5px' }}>
                          计算
                        </Button>
                        <Button danger onClick={() => remove(index)} size='small' style={{ height: '100%' }}>
                          删除
                        </Button>
                      </Col>
                    </Row>
                  )
                })}
                <Button
                  type='dashed'
                  onClick={() => {
                    add()
                    addNewRow()
                  }}
                  icon={<PlusOutlined />}
                  style={{ width: '100%' }}
                >
                  添加新行
                </Button>
              </>
            )}
          </Form.List>

          <Form.Item label='加工费' name='process_fee' style={{ marginTop: '16px' }} rules={formRules.processFeeLimit}>
            <InputNumber placeholder='请输入加工费' />
          </Form.Item>

          <Form.Item label='备注' name='note'>
            <Input placeholder='请输入备注' />
          </Form.Item>

          <Form.Item
            wrapperCol={{ span: 24 }}
            style={{
              textAlign: 'center', // 子元素水平居中
              marginTop: 16 // 适当的上边距
            }}
          >
            <Button type='primary' htmlType='submit' onClick={handleAddOrder}>
              提交
            </Button>
            <Button style={{ marginLeft: '12px' }} onClick={resetForm}>
              重置
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </PageWrapper>
  )
}

export default BasicForm
