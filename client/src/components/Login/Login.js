import React from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import { Link } from 'react-router-dom';

const Login = props => {
  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      console.log('values', values);
    });
  };

  return (
    <div className="gx-login-container">
      <div className="gx-login-content">
        <div className="gx-login-header gx-text-center">
          <h1 className="gx-login-title">Sign In</h1>
        </div>
        <Form onSubmit={handleSubmit} className="gx-login-form gx-form-row0">
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true }]}>
            <Input
              prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item name="check">
            <Checkbox>Remember me</Checkbox>
            <Link
              className="gx-login-form-forgot"
              to="/custom-views/user-auth/forgot-password"
            >
              Forgot password
            </Link>
          </Form.Item>
          <Form.Item className="gx-text-center">
            <Button type="primary" htmlType="submit">
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
