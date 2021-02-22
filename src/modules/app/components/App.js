import React from 'react';
import { RestfulProvider } from "restful-react";
import { useSelector } from "react-redux";

import Servers from '@modules/servers/components/Servers';
import Login from '@modules/auth/components/Login';
import Register from '@modules/auth/components/Register';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

export default function App() {

  const apiUrl = process.env.NODE_ENV === 'development' ? 'https://localhost/api/v1' : 'https://remote-desktop.myvpn.run/api/v1'
  const token = useSelector(state => state.token);

  return (
    <RestfulProvider
      resolve={data => data}
      requestOptions={(url, method, requestBody) => ({ headers: token ? { Authorization: `Bearer ${token}` } : {} })}
      base={apiUrl}
    >
      <Router>
        <Switch>
          <Route path="/register">
            <Register />
          </Route>
         <Route path="/servers">
            <Servers />
          </Route>
          <Route path="/">
            <Login />
          </Route>
        </Switch>
      </Router>
    </RestfulProvider>
  );
}
