import React, { useState } from 'react';

import { Form, Input, Modal, Button, Select, message } from "antd";
const { Option } = Select;

import { PlusCircleOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { useMutate } from "restful-react";
import { useDispatch } from "react-redux";

const ButtonGreenContainer = styled.div`
  .ant-btn-primary {
    margin-top: 5px;
    background-color: #52c41a;
    border-color: #73d13d;
    border-radius: 0;
    &:hover {
     background-color: #389e0d;
  }
`;

export default function Create() {

  const [isModalVisible, setIsModalVisible] = useState(false);

  const dispatch = useDispatch();

  const { mutate: requestCreateServer, loading } = useMutate({
    verb: "POST",
    path: "/server"
  });

  const showModal = () => {
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const onFinish = (values) => {
    requestCreateServer(values).then(res => {
      dispatch({type: 'SERVER_CREATE', payload: res})
      hideModal()
      message.success("Сервер успешно создан. Ожидание запуска.")
    }).catch(res => {
      message.error(Object.values(res.data.errors || [])[0] || res.data.message || "Request error");
    })
  }

  return (
    <>
      <Modal
        title="Создать новый сервер"
        footer={null}
        visible={isModalVisible}
        onCancel={hideModal}
      >
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Название сервера" name="name" initialValue="My Server 1" rules={[
            { required: true, message: 'Не может быть пустым' },
            {
              pattern: new RegExp(/^[0-9A-Za-z _-]+$/),
              message: "Недопустимый символ. Доступно: 0-9A-Za-z _-"
            }
            ]}>
            <Input size="large" />
          </Form.Item>
          <Form.Item label="Операционная система" >
            <Select
              labelInValue
              disabled
              size="large"
              defaultValue={{ value: 'windows' }}
            >
              <Option value="windows">Windows Server 2019 Base 10 (Ver. 2021.02.10)</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Регион" >
            <Select
              labelInValue
              disabled
              size="large"
              defaultValue={{ value: 'frankfurt' }}
            >
              <Option value="frankfurt">Europe (Frankfurt)</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button loading={loading} type="primary" htmlType="submit" size="large">
              Создать сервер
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <ButtonGreenContainer>
        <Button icon={<PlusCircleOutlined />} type="primary" size="large" onClick={showModal} block>
          Создать сервер
        </Button>
      </ButtonGreenContainer>
    </>
  )
}
