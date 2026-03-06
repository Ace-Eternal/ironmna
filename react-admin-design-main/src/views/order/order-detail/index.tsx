import React, { useState, useEffect } from 'react'
import {
  Form,
  Button,
  Table,
  Select,
  Switch,
  InputNumber,
  Input,
  DatePicker,
  Radio,
  Checkbox,
  Card,
  Popconfirm,
  Space,
  Tag
} from 'antd'
import type { ColumnType } from 'antd/es/table'
import { PageWrapper } from '@/components/Page'
import dayjs from 'dayjs'
import { TABLE_EDIT_COMPO } from '@/settings/websiteSetting'
import { useLocation, useNavigate } from 'react-router-dom'
import type { DataItem } from './types'
import { getDownloadUrl, download } from '@/api'
import { message } from 'antd'
import { FORM_COMPO } from '@/settings/websiteSetting'
import { getBaseUrl } from '@/types/config'

type CellType =
  | 'number'
  | 'text'
  | 'radio'
  | 'date'
  | 'select'
  | 'checkbox'
  | 'switch'
  | 'steel_type_select'
  | 'type_select'
  | 'val'
  | 'length'
  | 'length_remain'
  | 'width'
  | 'width_remain'
  | 'thickness'
  | 'thickness_remain'
  | 'amount'
  | 'monovalent'
  | 'total_weight'

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean
  dataIndex: string
  title: any
  cellType: CellType
  record: DataItem
  index: number
  children: React.ReactNode
}

type theadKey = Record<string, { title: string; type: string }>
const theadMap: theadKey = {
  key: { title: '数字输入框', type: 'number' },
  val: { title: '输入框', type: 'text' },
  birth: { title: '日期选择框', type: 'date' },
  type_select: { title: '选择器', type: 'type_select' },
  steel_type: { title: '选择器', type: 'steel_type_select' },
  length: { title: '输入框', type: 'text' },
  length_remain: { title: '输入框', type: 'text' },
  width: { title: '输入框', type: 'text' },
  width_remain: { title: '输入框', type: 'text' },
  thickness: { title: '输入框', type: 'text' },
  thickness_remain: { title: '输入框', type: 'text' },
  amount: { title: '输入框', type: 'text' },
  monovalent: { title: '输入框', type: 'text' },
  total_weight: { title: '输入框', type: 'text' },
  steel_money: { title: '输入框', type: 'text' },
  cut_fee: { title: '输入框', type: 'text' },

  forbid: { title: '开关', type: 'switch' },
  action: { title: '按钮', type: 'button' }
}

const nodeType = (type: CellType, record: DataItem) => {
  switch (type) {
    case 'number':
      return <InputNumber min={1000} max={2000} />
    case 'text':
      return <Input />
    case 'type_select':
      return <Select options={['方钢', '圆钢'].map(item => ({ value: item }))} style={{ width: '80px' }} />
    case 'steel_type_select':
      return (
        <Select
          options={[
            '45#',
            '50#',
            'P20',
            'P20H',
            '718',
            '718H',
            'H13',
            'H13R',
            '40Cr',
            '4Cr13',
            'Cr12',
            'Cr12正材',
            '2083',
            'S136',
            'S136H',
            'NAK80',
            'Cr12MoV',
            'SKD61',
            'SKD11',
            'DC53'
          ].map(item => ({ value: item }))}
          style={{ width: '80px' }}
        />
      )
    // case 'checkbox':
    //   return <Checkbox.Group options={record.hobby.split('、')} defaultValue={record.hobby.split('、')} />
    // case 'switch':
    //   return <Switch defaultChecked={record.forbid} />
  }
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  cellType,
  record,
  children,
  ...restProps
}) => {
  const cellNode = nodeType(cellType, record)

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item name={dataIndex} style={{ margin: 0 }}>
          {cellNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  )
}

const TableEditRow: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const { orderDetail } = location.state || []
  console.log('here is order-detail.tsx')
  console.log(orderDetail)

  const [form] = Form.useForm()
  const [data, setData] = useState<DataItem[]>([])
  const [editingKey, setEditingKey] = useState<string | number>('')

  const isEditing = (record: DataItem) => record.id === editingKey

  const edit = (record: Partial<DataItem>) => {
    form.setFieldsValue({ ...record })
    setEditingKey(record.id!)
  }

  const cancel = () => {
    setEditingKey('')
  }

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as DataItem

      const newData = [...data]
      const index = newData.findIndex(item => key === item.id)

      if (index > -1) {
        const item = newData[index]
        newData.splice(index, 1, {
          ...item,
          ...row
        })
        setData(newData)
        setEditingKey('')
      } else {
        newData.push(row)
        setData(newData)
        setEditingKey('')
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }

  interface CustomColumnType<RecordType> extends ColumnType<RecordType> {
    editable?: boolean // 新增 editable 属性
  }

  // @ts-ignore
  const columns: CustomColumnType[] = [
    // {
    //   title: () => {
    //     return (
    //       <>
    //         <span>编号</span>
    //         <p className='sub-title'></p>
    //       </>
    //     )
    //   },
    //   dataIndex: 'id',
    //   width: 70,
    //   align: 'center'
    // },
    {
      title: () => {
        return (
          <>
            <span>类型</span>
            <p className='sub-title'></p>
          </>
        )
      },
      dataIndex: 'type',
      width: 110
      // editable: true
    },
    {
      title: () => {
        return (
          <>
            <span>钢号</span>
          </>
        )
      },
      dataIndex: 'steel_type',
      width: 80,
      // editable: true,
      align: 'center'
    },
    {
      title: () => {
        return (
          <>
            <span>长</span>
            <p className='sub-title'>毫米</p>
          </>
        )
      },
      dataIndex: 'length',
      width: 70,
      // editable: true,
      align: 'center'
    },
    {
      title: () => {
        return (
          <>
            <span>余量</span>
            <p className='sub-title'>毫米</p>
          </>
        )
      },
      dataIndex: 'length_remain',
      width: 80,
      // editable: true,
      align: 'center'
    },
    {
      title: () => {
        return (
          <>
            <span>宽</span>
            <p className='sub-title'>毫米</p>
          </>
        )
      },
      dataIndex: 'width',
      width: 70,
      // editable: true,
      align: 'center'
    },
    {
      title: () => {
        return (
          <>
            <span>余量</span>
            <p className='sub-title'>毫米</p>
          </>
        )
      },
      dataIndex: 'width_remain',
      width: 70,
      // editable: true,
      align: 'center'
    },
    {
      title: () => {
        return (
          <>
            <span>厚/直径</span>
            <p className='sub-title'>毫米</p>
          </>
        )
      },
      dataIndex: 'thickness',
      width: 70,
      // editable: true,
      align: 'center'
    },
    {
      title: () => {
        return (
          <>
            <span>余量</span>
            <p className='sub-title'>毫米</p>
          </>
        )
      },
      dataIndex: 'thickness_remain',
      width: 70,
      // editable: true,
      align: 'center'
    },
    {
      title: () => {
        return (
          <>
            <span>件数</span>
            <p className='sub-title'></p>
          </>
        )
      },
      dataIndex: 'amount',
      width: 70,
      // editable: true,
      align: 'center'
    },
    {
      title: () => {
        return (
          <>
            <span>单价</span>
            <p className='orderItemList.sub-title'>元/千克</p>
          </>
        )
      },
      dataIndex: 'monovalent',
      width: 70,
      // editable: true,
      align: 'center'
    },
    {
      title: () => {
        return (
          <>
            <span>重量</span>
            <p className='sub-title'>千克</p>
          </>
        )
      },
      dataIndex: 'total_weight',
      width: 70,
      // editable: false,
      align: 'center'
    },
    {
      title: () => {
        return (
          <>
            <span>刀费</span>
            <p className='sub-title'>元</p>
          </>
        )
      },
      dataIndex: 'cut_fee',
      width: 70,
      // editable: true,
      align: 'center'
    },
    {
      title: () => {
        return (
          <>
            <span>材料金额</span>
            <p className='sub-title'>已算刀费</p>
          </>
        )
      },
      dataIndex: 'steel_money',
      width: 70,
      // editable: true,
      align: 'center'
    },
    {
      title: () => {
        return (
          <>
            <span>操作</span>
          </>
        )
      },
      dataIndex: 'action',
      width: 70,
      align: 'center',
      render: (_: any, record: DataItem) => {
        const editable = isEditing(record)
        return editable ? (
          <Space>
            <Button type='primary' ghost onClick={() => save(record.id)}>
              保存
            </Button>
            <Popconfirm title='是否取消编辑？' onConfirm={cancel}>
              <Button type='primary' danger ghost>
                取消
              </Button>
            </Popconfirm>
          </Space>
        ) : (
          <Button disabled={editingKey !== ''} onClick={() => edit(record)}>
            编辑
          </Button>
        )
      }
    }
  ]

  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record: DataItem) => ({
        record,
        cellType: theadMap[col.dataIndex].type,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    }
  })

  const url = getBaseUrl()

  function handleExportOrder(id: number) {
    getDownloadUrl(id)
      .then(res => {
        console.log('here is res')
        console.log(res)
        if (res) {
          // ✅ 1. 检查链接是否正确
          const filename = JSON.stringify(res).replace(/"/g, '').trim()
          const downloadUrl = url + '/order/download?file=' + filename
          window.open(downloadUrl, '_blank')
        } else {
          throw new Error('未获取到下载链接')
        }
      })
      .then(() => {
        message.success('文件下载已开始！')
      })
      .catch((error: any) => {
        message.error(`导出失败: ${error.message}`)
        console.error('导出错误:', error)
      })
  }

  // 如果没有数据（直接访问详情页），可以跳转回列表页

  useEffect(() => {
    if (!orderDetail) {
      navigate('/order/order-basic')
    } else {
      setData([orderDetail])
      console.log('here is data')
      console.log(data)
    }
  }, [orderDetail, navigate])

  if (!orderDetail) {
    return null
  }

  return (
    <PageWrapper plugin={FORM_COMPO}>
      <>
        <Card title='订单信息' bordered={false} style={{ marginBottom: 16 }}>
          <Space size={20}>
            <Tag color='blue'>订单号: {orderDetail.id}</Tag>
            <Tag color='green'>客户: {orderDetail.customer?.customer_name}</Tag>
            <Tag color='orange'>电话: {orderDetail.customer?.telephone}</Tag>
            <Tag color='yellow'>下单时间: {orderDetail.time}</Tag>
            <div> 加工费: {orderDetail.process_fee}</div>
            <div color='purple'>账单总金额: ¥{orderDetail.total_money.toFixed(2)}</div>
            <Button type='primary' onClick={() => handleExportOrder(orderDetail.id)}>
              导出账单
            </Button>
          </Space>
        </Card>
        <Card bordered={false}>
          <Form form={form} component={false}>
            <Table
              components={{
                body: {
                  cell: EditableCell
                }
              }}
              dataSource={orderDetail.orderItemList}
              columns={mergedColumns}
              pagination={false}
            />
          </Form>
        </Card>
      </>
    </PageWrapper>
  )
}

export default TableEditRow
