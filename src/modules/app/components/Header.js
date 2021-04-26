import React from 'react';
import styled from 'styled-components';

import IconWindowClose from '@modules/app/images/window/close.svg';
import IconWindowMax from '@modules/app/images/window/maximize.svg';
import IconWindowMin from '@modules/app/images/window/minimize.svg';

const HeaderWrap = styled.div``
const HeaderText = styled.span`
  user-select: none;
`
const HeaderMove = styled.div`
  position: fixed;
  top: 0px;
  z-index: 1000;
  height: 24px;
  width: calc(100vw - 84px);
  -webkit-app-region: drag;
`
const HeaderLine = styled.div`
  height: 24px;
  padding: 2px;
  padding-left: 8px;
  width: 100%;
  background: #2d2d2d;
  letter-spacing: 1px;
  color: #b7b7b7;
  text-align: center;
  overflow: hidden;
  position: fixed;
  top: 0px;
  cursor: drag;
  z-index: 900;
`

const HeaderAction = styled.div`
  position: absolute;
  right: 0;
  top: 0;
`

const HeaderActionItem = styled.img`
  cursor: pointer;
  &:hover {
    opacity: 0.5;
  }
`

export default function Header() {

  const { BrowserWindow } = require('electron').remote

  const windowMaximize = () => {
    if (BrowserWindow.getFocusedWindow().isMaximized()) {
      BrowserWindow.getFocusedWindow().unmaximize();
    } else {
      BrowserWindow.getFocusedWindow().maximize();
    }
  }
  const windowMinimize = () => BrowserWindow.getFocusedWindow().minimize()
  const windowClose = () => BrowserWindow.getFocusedWindow().close()

  return (
    <HeaderWrap>
      <HeaderMove />
      <HeaderLine>
        <HeaderText>MyRemoteDesktop</HeaderText>
        <HeaderAction>
          <HeaderActionItem src={IconWindowMin} onClick={windowMinimize} />
          <HeaderActionItem src={IconWindowMax} onClick={windowMaximize} />
          <HeaderActionItem src={IconWindowClose} onClick={windowClose} />
        </HeaderAction>
      </HeaderLine>
    </HeaderWrap>
  )

}
