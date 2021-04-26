import React from 'react';
import styled from 'styled-components';
import { Card } from 'antd';
import LogoSvg from '@modules/app/images/logo.svg';

const LogoImage = styled.img`
  width: 70px;
  margin-bottom: 10px;
`
const LogoText = styled.div`
  font-size: 20px;
`

const CardHead = styled.div`
  text-align: center;
  margin-bottom: 20px;
`
const Content = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const Layout =({children}) =>{
  return(
    <Content>

      <Card bordered={false} title={
        <CardHead>
          <LogoImage src={LogoSvg} />
          <LogoText>My Remote Desktop</LogoText>
        </CardHead>
      }
            style={{marginTop: '-100px'}}
            bodyStyle={{boxShadow: '0px 15px 40px rgba(0,0,0,.13)'}}>
        {children}
      </Card>
    </Content>
  )
}

export default Layout;
