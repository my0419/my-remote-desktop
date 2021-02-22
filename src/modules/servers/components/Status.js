import React, { useState } from "react";
import { Result } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import { useMutate } from "restful-react";
import { useDispatch, useSelector } from "react-redux";

export default function Status() {

  const dispatch = useDispatch();

  const stateValues = useSelector((state) => {
    return {
      servers: state.servers,
      serverSelected: state.serverSelected
    }
  });

  const { servers, serverSelected } = stateValues

  const [serverSelectedState, setServerSelected] = useState(serverSelected);

  const { mutate: requestServerStatus, loading } = useMutate({
    verb: "GET",
    path: `/server/${serverSelected ? serverSelected.id : ''}`
  });

  if (!loading && serverSelected && (!serverSelectedState || serverSelectedState.id !== serverSelected.id)) {
    setServerSelected(serverSelected)
    requestServerStatus().then(res => {
      dispatch({ type: 'SERVER_UPDATE', payload: res })
    })
  }

  return (
    <>
      {!serverSelected ?
        <Result
          title={servers.length > 0 ? 'Выберите сервер для подключения' : 'Создайте ваш первый сервер!'}
        />
        :
        (
          serverSelected.status === "fail" ?
            <Result
              status="error"
              title="Ошибка настройки сервера"
              extra={
                <p>{ (serverSelected.server_histories || []).length > 0 ? serverSelected.server_histories[0].description : "Системная ошибка. Повторите попытку." }</p>
              }
            />
          :
            <Result
            icon={<SyncOutlined spin />}
            title="Ожидается запуск сервера"
            extra={
            <p>Время ожидания 2 - 3 минуты</p>
          }
            />
        )

      }
    </>
  )
}
