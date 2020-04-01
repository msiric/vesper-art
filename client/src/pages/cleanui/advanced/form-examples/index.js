import React from 'react'
import { Helmet } from 'react-helmet'
import {
  Form,
  Input,
  Slider,
  Cascader,
  Upload,
  Icon,
  message,
  Checkbox,
  Select,
  Button,
} from 'antd'

const { Dragger } = Upload
const { Option } = Select

@Form.create()
class AdvancedFormExamples extends React.Component {
  state = {
    confirmDirty: false,
  }

  handleConfirmBlur = e => {
    const { value } = e.target
    const { confirmDirty } = this.state
    this.setState({ confirmDirty: confirmDirty || !!value })
  }

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!')
    } else {
      callback()
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props
    const { confirmDirty } = this.state

    if (value && confirmDirty) {
      form.validateFields(['confirm'], { force: true })
    }
    callback()
  }

  handleSubmit = e => {
    e.preventDefault()
    const { form } = this.props
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
      }
    })
  }

  render() {
    const { form } = this.props

    const opts = {
      name: 'file',
      multiple: true,
      action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      onChange(info) {
        const { status } = info.file
        if (status !== 'uploading') {
          console.log(info.file, info.fileList)
        }
        if (status === 'done') {
          message.success(`${info.file.name} file uploaded successfully.`)
        } else if (status === 'error') {
          message.error(`${info.file.name} file upload failed.`)
        }
      },
    }

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    }

    const marks = {
      0: '0',
      10: '10',
      20: '20',
      30: '30',
      40: '40',
      50: '50',
      60: '60',
      70: '70',
      80: '80',
      90: '90',
      100: '100',
    }

    const residences = [
      {
        value: 'zhejiang',
        label: 'Zhejiang',
        children: [
          {
            value: 'hangzhou',
            label: 'Hangzhou',
            children: [
              {
                value: 'xihu',
                label: 'West Lake',
              },
            ],
          },
        ],
      },
      {
        value: 'jiangsu',
        label: 'Jiangsu',
        children: [
          {
            value: 'nanjing',
            label: 'Nanjing',
            children: [
              {
                value: 'zhonghuamen',
                label: 'Zhong Hua Men',
              },
            ],
          },
        ],
      },
    ]

    return (
      <div>
        <Helmet title="Advanced / Form Examples" />
        <div className="kit__utils__heading">
          <h5>Form Examples</h5>
        </div>
        <div className="card">
          <div className="card-body">
            <h5 className="mb-4">
              <strong>Basic Form</strong>
            </h5>
            <Form {...formItemLayout} labelAlign="left">
              <Form.Item label="Fullname">
                {form.getFieldDecorator('fullname6')(<Input placeholder="Your Fullname..." />)}
              </Form.Item>
              <Form.Item label="Email">
                {form.getFieldDecorator('email6')(<Input placeholder="Your Email..." />)}
              </Form.Item>
              <Form.Item label="Budget" className="mb-5">
                {form.getFieldDecorator('budget1')(
                  <Input placeholder="Your Budget..." addonBefore="$" />,
                )}
              </Form.Item>
              <Form.Item label="Amount">
                {form.getFieldDecorator('amount', {
                  initialValue: 30,
                })(<Slider tooltipVisible marks={marks} />)}
              </Form.Item>
              <button type="submit" className="btn btn-success px-5">
                Send Data
              </button>
            </Form>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <h5 className="mb-4">
              <strong>Inline Form</strong>
            </h5>
            <Form layout="inline">
              <Form.Item className="mb-1 mt-1">
                {form.getFieldDecorator('budget2')(
                  <Input placeholder="Coins Amount" addonBefore="$" addonAfter=".00" />,
                )}
              </Form.Item>
              <Form.Item className="mb-1 mt-1">
                {form.getFieldDecorator('budget3')(
                  <Input placeholder="8 Digit Pin" addonBefore="$" />,
                )}
              </Form.Item>
              <button type="button" className="btn btn-success mt-1 mb-1">
                Confirm Transaction
              </button>
            </Form>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <h5 className="mb-4">
              <strong>Two Columns</strong>
            </h5>
            <Form layout="vertical">
              <div className="row">
                <div className="col-md-6">
                  <Form.Item label="E-mail">
                    {form.getFieldDecorator('email3')(<Input placeholder="Email" />)}
                  </Form.Item>
                </div>
                <div className="col-md-6">
                  <Form.Item label="Password">
                    {form.getFieldDecorator('pass3')(<Input placeholder="Password" />)}
                  </Form.Item>
                </div>
                <div className="col-12">
                  <Form.Item label="Adress">
                    {form.getFieldDecorator('address3-1')(<Input placeholder="1234 Main St." />)}
                  </Form.Item>
                  <Form.Item label="Adress 2">
                    {form.getFieldDecorator('address3-2')(
                      <Input placeholder="Apartment, studio, or floor" />,
                    )}
                  </Form.Item>
                </div>
                <div className="col-md-6">
                  <Form.Item label="City">{form.getFieldDecorator('city3')(<Input />)}</Form.Item>
                </div>
                <div className="col-md-4">
                  <Form.Item label="State">
                    {form.getFieldDecorator('state3')(<Cascader options={residences} />)}
                  </Form.Item>
                </div>
                <div className="col-md-2">
                  <Form.Item label="Zip">{form.getFieldDecorator('zip')(<Input />)}</Form.Item>
                </div>
                <div className="col-12">
                  <Form.Item label="Upload Presentation">
                    {form.getFieldDecorator('upload3')(
                      <Dragger {...opts}>
                        <p className="ant-upload-drag-icon">
                          <Icon type="inbox" />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">
                          Support for a single or bulk upload. Strictly prohibit from uploading
                          company data or other band files
                        </p>
                      </Dragger>,
                    )}
                  </Form.Item>
                </div>
                <div className="col-12">
                  <Form.Item>
                    {form.getFieldDecorator('confirm3')(
                      <Checkbox className="text-uppercase">
                        I CONSENT TO HAVING MDTK SOFT COLLECT MY PERSONAL DETAILS.
                      </Checkbox>,
                    )}
                  </Form.Item>
                  <Form.Item>
                    {form.getFieldDecorator('confirm4')(
                      <button type="button" className="btn btn-light px-5">
                        Sign in
                      </button>,
                    )}
                  </Form.Item>
                </div>
              </div>
            </Form>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <h5 className="mb-4">
              <strong>Validation & Background</strong>
            </h5>
            <div className="bg-light rounded-lg p-5">
              <div className="row">
                <div className="col-lg-8 mx-auto">
                  <Form layout="vertical" onSubmit={this.handleSubmit}>
                    <Form.Item label="Username">
                      {form.getFieldDecorator('fullname')(<Input />)}
                    </Form.Item>
                    <Form.Item label="Gender">
                      {form.getFieldDecorator('gender', {
                        rules: [{ message: 'Please select your gender!' }],
                      })(
                        <Select
                          placeholder="Select a option and change input text above"
                          onChange={this.handleSelectChange}
                        >
                          <Option value="male">male</Option>
                          <Option value="female">female</Option>
                        </Select>,
                      )}
                    </Form.Item>
                    <Form.Item label="E-mail">
                      {form.getFieldDecorator('email', {
                        rules: [
                          {
                            type: 'email',
                            message: 'The input is not valid E-mail!',
                          },
                          {
                            message: 'Please input your E-mail!',
                          },
                        ],
                      })(<Input />)}
                    </Form.Item>
                    <Form.Item label="Password" hasFeedback>
                      {form.getFieldDecorator('password', {
                        rules: [
                          {
                            message: 'Please input your password!',
                          },
                          {
                            // validator: this.validateToNextPassword,
                          },
                        ],
                      })(<Input.Password />)}
                    </Form.Item>
                    <Form.Item label="Confirm Password" hasFeedback>
                      {form.getFieldDecorator('confirm', {
                        rules: [
                          {
                            message: 'Please confirm your password!',
                          },
                          {
                            validator: this.compareToFirstPassword,
                          },
                        ],
                      })(<Input.Password onBlur={this.handleConfirmBlur} />)}
                    </Form.Item>
                    <div className="border-top pt-4">
                      <Form.Item>
                        <Button type="primary" htmlType="submit">
                          Submit
                        </Button>
                      </Form.Item>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default AdvancedFormExamples
