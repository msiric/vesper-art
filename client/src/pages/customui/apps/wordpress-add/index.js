import React from 'react'
import { Helmet } from 'react-helmet'
import { Editor } from 'react-draft-wysiwyg'
import { Form, Input, Checkbox, Select, Upload, Icon } from 'antd'

const FormItem = Form.Item
const { Dragger } = Upload
const { Option } = Select

@Form.create()
class ExtraAppsWordpressAdd extends React.Component {
  render() {
    const { form } = this.props

    return (
      <div>
        <Helmet title="Wordpress Add" />
        <Form className="mt-3">
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <FormItem label="Title">
                  {form.getFieldDecorator('title')(<Input placeholder="Post title" />)}
                </FormItem>
              </div>
            </div>
          </div>
          <div className="form-group">
            <FormItem label="Type">
              {form.getFieldDecorator('type')(
                <Checkbox.Group>
                  <div className="d-flex flex-wrap">
                    <div className="mr-3 mt-1 mb-1">
                      <Checkbox value="text">Text</Checkbox>
                    </div>
                    <div className="mr-3 mt-1 mb-1">
                      <Checkbox value="video">Video</Checkbox>
                    </div>
                    <div className="mr-3 mt-1 mb-1">
                      <Checkbox value="image">Image</Checkbox>
                    </div>
                    <div className="mr-3 mt-1 mb-1">
                      <Checkbox value="audio">Audio</Checkbox>
                    </div>
                    <div className="mr-3 mt-1 mb-1">
                      <Checkbox value="vimeo">Vimeo</Checkbox>
                    </div>
                  </div>
                </Checkbox.Group>,
              )}
            </FormItem>
          </div>
          <div className="form-group">
            <FormItem label="Category">
              {form.getFieldDecorator('category', {
                initialValue: ['travel', 'lifestyle'],
              })(
                <Select
                  mode="tags"
                  size="default"
                  placeholder="Select post category"
                  style={{ width: '100%' }}
                >
                  <Option key="travel">Travel</Option>
                  <Option key="lifestyle">Lifestyle</Option>
                  <Option key="nature">Nature</Option>
                  <Option key="Video">Video</Option>
                </Select>,
              )}
            </FormItem>
          </div>
          <div className="form-group">
            <FormItem label="Content">
              {form.getFieldDecorator('content')(
                <Editor
                  editorClassName="px-3 border border-gray-1"
                  editorStyle={{
                    height: 250,
                    overflow: 'auto',
                  }}
                />,
              )}
            </FormItem>
          </div>
          <div className="form-group">
            <FormItem>
              {form.getFieldDecorator('Files')(
                <Dragger>
                  <p className="ant-upload-drag-icon">
                    <Icon type="inbox" />
                  </p>
                  <p className="ant-upload-text">Click or drag file to this area to upload</p>
                  <p className="ant-upload-hint">
                    Support for a single or bulk upload. Strictly prohibit from uploading company
                    data or other band files
                  </p>
                </Dragger>,
              )}
            </FormItem>
          </div>
          <FormItem>
            <button type="submit" className="btn btn-success btn-with-addon text-nowrap">
              <span className="btn-addon">
                <i className="btn-addon-icon fe fe-plus-circle" />
              </span>
              Add Post
            </button>
          </FormItem>
        </Form>
      </div>
    )
  }
}

export default ExtraAppsWordpressAdd
