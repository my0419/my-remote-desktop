import React from "react";
import { useDispatch } from "react-redux";

import { useHistory } from "react-router-dom";

import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import Layout from '@modules/home/components/Layout';
import { useMutate } from "restful-react";

export default function Register() {

  const history = useHistory();

  const dispatch = useDispatch();

  const { mutate: requestLogin, loading } = useMutate({
    verb: "POST",
    path: "/register"
  });

  const onFinish = (values) => {
    requestLogin(values).then(res => {
      dispatch({type: 'AUTH', payload: res})
      message.success('Учетная запись зарегистрирована')
      history.push('/servers')
    }).catch(res => {
      message.error(Object.values(res.data.errors || [])[0] || res.data.message || 'Request error');
    })
  };

  return (
    <Layout>
      <Form onFinish={onFinish}>
        <Form.Item name="email" rules={[{ required: true, message: 'Не может быть пустым' }]}>
          <Input
            size="large"
            prefix={<UserOutlined className="site-form-item-icon" style={{color: '#f68031'}} />}
            placeholder="Email"
          />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: 'Не может быть пустым' }]}>
          <Input.Password size="large" prefix={<LockOutlined className="site-form-item-icon" style={{color: '#f68031'}} />} placeholder="Пароль" />
        </Form.Item>
        <Form.Item
          name="password_confirm"
          rules={[
            { required: true, message: 'Не может быть пустым' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject('Пароли не совпадают!');
              },
            }),
            ]}
          dependencies={['password']}
        >
          <Input.Password size="large" prefix={<LockOutlined className="site-form-item-icon" style={{color: '#f68031'}} />} placeholder="Повторите пароль" />
        </Form.Item>
        <Form.Item>
          <Button loading={loading} type="primary" htmlType="submit" size="large" block>
            Создать аккаунт
          </Button>
        </Form.Item>

        <Form.Item>
          <Button type="link" htmlType="button" size="large" block onClick={() => history.push('/')} >
            Войти
          </Button>
        </Form.Item>
      </Form>
    </Layout>
  );
}
