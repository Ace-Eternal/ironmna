import type { CascaderProps, TreeSelectProps } from 'antd'
import type { Rule } from 'antd/es/form'
import { type FC, useState } from 'react'
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
import { FORM_COMPO } from '@/settings/websiteSetting'
import { PageWrapper } from '@/components/Page'
import { provinceData, cityData, cascaderData, treeData, radioData, checkboxData } from './data'
import { addCustomer } from '@/api'

import { message } from 'antd'

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
    inputLimit: [{ required: true, message: '内容不能为空' }]
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

  function handleAddCustomer() {
    const formData = form.getFieldsValue()
    addCustomer(formData)
      .then(() => {
        // 成功时显示消息
        message.success('客户添加成功！')
        form.resetFields() //（可选）成功后可重置表单
      })
      .catch(error => {
        // 失败时显示错误信息
        message.error(`添加失败: ${error.message}`)
      })
  }

  return (
    <PageWrapper plugin={FORM_COMPO}>
      <Card bordered={false}>
        <Form
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          initialValues={{ ...formState }}
          style={{ width: '40%', margin: '0 auto' }}
          onFinish={onFinish}
        >
          <Form.Item label='客户姓名' name='customer_name' rules={formRules.inputLimit}>
            <Input showCount maxLength={20} placeholder='请输入内容' />
          </Form.Item>

          <Form.Item label='手机号:' name='telephone' rules={formRules.inputLimit}>
            <Input showCount maxLength={20} placeholder='请输入内容' />
          </Form.Item>

          <Form.Item label='地址:' name='address' rules={formRules.inputLimit}>
            <Input showCount maxLength={20} placeholder='请输入内容' />
          </Form.Item>

          <Form.Item wrapperCol={{ span: 12, offset: 12 }}>
            <Button type='primary' htmlType='submit' onClick={handleAddCustomer}>
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
