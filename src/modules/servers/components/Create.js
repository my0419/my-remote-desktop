import React, { useState } from 'react';

import { Form, Input, Modal, Button, Select, Checkbox, Row, Col, message } from "antd";
const { Option } = Select;

import { PlusSquareOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { useMutate } from "restful-react";
import { useDispatch, useSelector } from "react-redux";

const ButtonCreateContainer = styled.div`
  .ant-btn-link {
    font-weight: bold;
  }
`;

export default function Create() {

  const [isModalVisible, setIsModalVisible] = useState(false);

  const dispatch = useDispatch();

  const { mutate: requestCreateServer, loading } = useMutate({
    verb: "POST",
    path: "/server"
  });

  const { mutate: requestListSoft, loadingSoft } = useMutate({
    verb: "GET",
    path: "/soft"
  });

  const { mutate: requestListRegion, loadingRegion } = useMutate({
    verb: "GET",
    path: "/region"
  });

  React.useEffect(() => {
    requestListSoft().then(res => {
      dispatch({ type: "SOFT_LIST", payload: res })
    })
    requestListRegion().then(res => {
      dispatch({ type: "REGION_LIST", payload: res })
    })

  }, [])

  const stateValues = useSelector((state) => {
    return {
      softs: state.softs,
      regions: state.regions,
    }
  });

  const { softs, regions } = stateValues
  softs.map((item) => {
    try {
      item.icon = require(`@img/soft/${item.code}.svg`).default
    } catch (e) {
      item.icon = null
    }
    return item
  })

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
          <Form.Item label="Предустановленное ПО" name="soft_install" >

            <Checkbox.Group style={{ width: '100%' }} >
              <Row>
                {softs.map((val) => (
                  <Col span={8}>
                     <Checkbox value={val.id}>{val.icon ? <img src={val.icon} width={18} /> : ''} { val.name }</Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item label="Регион" name="region" rules={[{ required: true, message: 'Регион не может быть пустым' }]}>
            <Select placeholder="Выберите регион" size="large">
              {regions.map((val) => (
                <Option key={val.id} value={val.id}>{val.name}</Option>
              ))}
            </Select>
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
          <Form.Item>
            <Button loading={loading} type="primary" htmlType="submit" size="large">
              Создать сервер
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <ButtonCreateContainer>
        <Button icon={<PlusSquareOutlined />} type="link" size="large" onClick={showModal} block>
          Создать новый сервер
        </Button>
      </ButtonCreateContainer>
    </>
  )
}
