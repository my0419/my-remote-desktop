import React from "react";

import { useSelector, useDispatch } from "react-redux";

import { Layout, Menu, Empty, Button } from "antd";
import { UserOutlined, DesktopOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

import Create from "@modules/servers/components/Create";
import List from "@modules/servers/components/List";
import Screen from "@modules/servers/components/Screen";
import Status from "@modules/servers/components/Status";

export default function Servers() {

  const history = useHistory();
  const dispatch = useDispatch();

  const stateValues = useSelector((state) => {
    return {
      user: state.user,
      servers: state.servers,
      serverSelected: state.serverSelected
    }
  });

  const { user, serverSelected } = stateValues

  const handleLogout = () => {
    dispatch({type: 'LOGOUT'})
    history.push('/')
  }

  return (
    <Layout style={{ height: "100%", paddingTop: "24px" }}>
      <Header style={{padding: 0}}>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<DesktopOutlined />} style={{width: 250, textAlign: 'center'}} >Рабочие столы</Menu.Item>
          <SubMenu key="3" icon={<UserOutlined />} title={user.email}>
            <Menu.Item key="4" onClick={handleLogout}>Выход</Menu.Item>
          </SubMenu>
        </Menu>
      </Header>
      <Layout>
        <Sider width={250} style={{
          overflow: 'auto',
          left: 0}}>
          <List />
          <Create />
        </Sider>
        <Layout>
          <Content>
            {!serverSelected || !serverSelected.server_access || serverSelected.status !== 'running' ?
              <Status /> :
              <Screen key={serverSelected.id} ip={serverSelected.ipv4_public}
                      username={serverSelected.server_access.username}
                      password={serverSelected.server_access.password} />
            }

          </Content>
        </Layout>
      </Layout>
    </Layout>
  )

}
