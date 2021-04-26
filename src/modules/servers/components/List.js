import React, { useState } from "react";
import { Empty, Spin, List, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import styled, { css } from "styled-components";

import { useMutate } from "restful-react";
import { useDispatch, useSelector } from "react-redux";

import WindowsSvg from "@modules/app/images/windows.svg";

const LogoImage = styled.img`
  width: 18px;
  margin-left: 12px;
  margin-top: 14px;
`

const PreloaderContainer = styled.div`
  padding: 20px;
  text-align: center;
`

const ListItemContainer = styled.div`
  .ant-list-item {
    ${props => props.active && css`
      border-right: 4px solid #4a4a4a;

   `}
    cursor: pointer;
    border-bottom: 1px solid #232323 !important;
    &:hover {
      background-color: #2d2d2d;
    }
  }
`

export default function ServerList() {

  const dispatch = useDispatch();

  const [isLoading, setLoading] = useState(false);

  const { mutate: requestListServer, loading } = useMutate({
    verb: "GET",
    path: "/server"
  });

  const { mutate: requestServerDelete, loadingDelete } = useMutate({
    verb: "DELETE",
    path: `/server`
  });

  React.useEffect(() => {
    setLoading(true)
    requestListServer().then(res => {
      dispatch({ type: "SERVER_LIST", payload: res })
      setLoading(false)
    })

  }, [])

  const stateValues = useSelector((state) => {
    return {
      servers: state.servers,
      serverSelected: state.serverSelected
    }
  });

  const { servers, serverSelected } = stateValues

  const waitingServers = servers.filter((s) => s.status === 'deploy' || s.status === 'pending').length;

  // check interval. @TODO socket
  React.useEffect(() => {
    let intervalFnc = () => {}
    console.log('waiting servers', waitingServers)
    if (waitingServers > 0) {
      intervalFnc = () => {
        console.log('refresh server list')
        requestListServer().then(res => {
          dispatch({ type: "SERVER_LIST", payload: res })
        })
      }
    }
    const interval = setInterval(intervalFnc, 10000);
    return () => clearInterval(interval);
  }, [waitingServers]);

  const serverDescription = (server) => {
    switch (server.status) {
      case "deploy":
        return "Сервер создается...";
      case "pending":
        return "Запуск и настройка...";
      case "fail":
        return "Ошибка";
      case "running": {
        return `IP: ${server.ipv4_public}`
      }
      default: {
        return `Статус: ${server.status}`
      }
    }

  }
  const handleSelectServer = (server, e) => {
    if (e.target.nodeName === 'svg') {
      return
    }
    dispatch({ type: "SERVER_SELECTED", payload: server.id })
  }

  const handleServerDelete = (server) => {
    requestServerDelete(server.id)
    dispatch({ type: "SERVER_DELETE", payload: server })
  }

  if (isLoading) {
    return (<PreloaderContainer><Spin size="large" tip="Загрузка..." /></PreloaderContainer>);
  }

  return (
    <>
      {!servers || servers.length === 0
        ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Нет серверов" /> :
        <List>
          { servers.map((server) =>
            <ListItemContainer active={serverSelected && serverSelected.id === server.id} key={`container_${server.id}`}>
              <List.Item onClick={(e) => handleSelectServer(server, e)} key={server.id}>
                <List.Item.Meta
                  avatar={<LogoImage src={WindowsSvg} />}
                  title={server.name}
                  description={serverDescription(server)}
                />
                <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleServerDelete(server)} />
              </List.Item>
            </ListItemContainer>
          )}
        </List>
      }
    </>
  );
}
