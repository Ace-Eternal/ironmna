import type { ColumnsType } from 'antd/es/table'
import { type FC, useState, useEffect } from 'react'
import {
  type TableProps,
  Card,
  Button,
  Table,
  Tag,
  Switch,
  Popover,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Checkbox
} from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { TABLE_COMPO } from '@/settings/websiteSetting'
import { deleteCustomer, getTableList, updateCustomer } from '@/api'
import { PageWrapper } from '@/components/Page'
import type { APIResult, PageState, TableDataType } from './types'

import { message } from 'antd'

const CustomerTable: FC = () => {
  const [tableLoading, setTableLoading] = useState(false)
  const [tableData, setTableData] = useState<TableDataType[]>([])
  const [tableTotal, setTableTotal] = useState<number>(0)
  const [tableQuery, setTableQuery] = useState<PageState>({ current: 1, pageSize: 10 })

  const [form] = Form.useForm()
  const [modalVisibel, setModalVisibel] = useState<boolean>(false)

  const columns: ColumnsType<TableDataType> = [
    // 这里显示必须遵循后端传过来的json里面的字段名字
    {
      title: '编号',
      dataIndex: 'id',
      align: 'center',
      sorter: true
    },
    {
      title: '姓名',
      dataIndex: 'customer_name',
      align: 'center',
      render: (_, record: any) => {
        const content = (
          <div>
            <p>姓名: {record.customer_name}</p>
            <p>手机: {record.telephone}</p>
            <p>地址: {record.address}</p>
          </div>
        )
        return (
          <Popover content={content}>
            <Tag color='blue'>{record.customer_name}</Tag>
          </Popover>
        )
      }
    },
    {
      title: '手机',
      dataIndex: 'telephone',
      align: 'center'
    },
    {
      title: '地址',
      dataIndex: 'address',
      align: 'center'
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record: any) => (
        <Space>
          <Button disabled={record.forbid} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button danger onClick={() => handleDelete(record.id)}>
            删除
          </Button>
        </Space>
      )
    }
  ]

  const tableSelection: TableProps<any>['rowSelection'] = {
    onChange: (selectedRowKeys: any[]) => {
      console.log(selectedRowKeys)
    }
  }

  useEffect(() => {
    fetchData()
  }, [tableQuery])

  async function fetchData() {
    setTableLoading(true)
    const data = await getTableList(tableQuery)
    const { records, total } = data as unknown as APIResult
    setTableData(records)
    setTableTotal(total)
    setTableLoading(false)
  }

  function handlePageChange(page: number, pageSize: number) {
    setTableQuery({ ...tableQuery, current: page, pageSize })
  }

  function handleDelete(id: number) {
    Modal.confirm({
      title: '此操作将删除选中数据, 是否继续?',
      icon: <ExclamationCircleOutlined rev={undefined} />,
      // okType: 'danger',
      okText: '确定',
      cancelText: '取消',
      async onOk() {
        try {
          await deleteCustomer(id) // 传递对象 { id }
          message.success('删除成功！') // 成功消息
          await fetchData()
        } catch (error) {
          message.error(`删除失败`) // 失败消息
        }
        console.log('OK')
      },
      onCancel() {
        console.log('Cancel')
      }
    })
  }

  function handleEdit(record: TableDataType) {
    form.setFieldsValue({ ...record })
    setModalVisibel(true)
  }

  function handleConfirm() {
    const formData = form.getFieldsValue()
    console.log('here is updateCustomer data')
    console.log(formData)
    updateCustomer(formData)
      .then(() => {
        // 成功时显示消息
        message.success('客户更新成功！')
        form.resetFields() //（可选）成功后可重置表单
        fetchData()
      })
      .catch(error => {
        // 失败时显示错误信息
        message.error(`更新失败: ${error.message}`)
      })
    setModalVisibel(false)
  }

  function handleCancle() {
    setModalVisibel(false)
  }

  return (
    <PageWrapper plugin={TABLE_COMPO}>
      <Card bordered={false}>
        <Table
          rowKey='id'
          rowSelection={tableSelection}
          columns={columns}
          dataSource={tableData}
          loading={tableLoading}
          pagination={{
            current: tableQuery.current,
            pageSize: tableQuery.pageSize,
            total: tableTotal,
            showTotal: () => `Total ${tableTotal} items`,
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: handlePageChange
          }}
        />
        <Modal
          open={modalVisibel}
          title='编辑'
          width='600px'
          okText='确定'
          cancelText='取消'
          onCancel={handleCancle}
          onOk={handleConfirm}
        >
          <Form
            form={form}
            colon={false}
            labelCol={{ span: 4 }}
            labelAlign='left'
            style={{ width: '80%', margin: '0 auto' }}
          >
            {/* 这里向后端发请求 必须遵循@RequestBody的对象的字段名字 */}
            <Form.Item label='编号' name='id'>
              <Input disabled />
            </Form.Item>
            <Form.Item label='姓名' name='customer_name'>
              <Input disabled />
            </Form.Item>
            <Form.Item label='手机' name='telephone'>
              <Input placeholder='请输入手机号码' />
            </Form.Item>
            <Form.Item label='地址' name='address'>
              <Input placeholder='请输入地址' />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </PageWrapper>
  )
}

export default CustomerTable
