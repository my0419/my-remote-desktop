import React from "react";
import { useDispatch } from "react-redux";

import { useHistory } from "react-router-dom";

import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

import Layout from "@modules/home/components/Layout";

import { useMutate } from "restful-react";

export default function Login() {

  const history = useHistory();

  const dispatch = useDispatch();

  const { mutate: requestLogin, loading } = useMutate({
    verb: "POST",
    path: "/login"
  });

  const onFinish = (values) => {
    requestLogin(values).then(res => {
      dispatch({type: 'AUTH', payload: res})
      history.push('/servers')
    }).catch(res => {
      message.error(Object.values(res.data.errors || [])[0] || res.data.message || 'Request error');
    })
  };

  return (<Layout>
    <Form onFinish={onFinish}>
      <Form.Item name="email" rules={[{ required: true, message: 'Не может быть пустым' }]}>
        <Input
          size="large"
          prefix={<UserOutlined className="site-form-item-icon" style={{color: 'rgba(0, 0, 0, 0.25)'}} />}
          placeholder="Email"
        />
      </Form.Item>
      <Form.Item name="password" rules={[{ required: true, message: 'Не может быть пустым' }]}>
        <Input.Password size="large" prefix={<LockOutlined className="site-form-item-icon" style={{color: 'rgba(0, 0, 0, 0.25)'}} />} placeholder="Пароль" />
      </Form.Item>
      <Form.Item>
        <Button loading={loading} type="primary" htmlType="submit" size="large" block>
          Войти
        </Button>
      </Form.Item>

      <Form.Item>
        <Button type="link" htmlType="button" size="large" block onClick={() => history.push('/register')} >
          Создать аккаунт
        </Button>
      </Form.Item>
    </Form>
  </Layout>)
}
