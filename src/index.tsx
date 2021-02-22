import React from 'react';
import { render } from 'react-dom';
import App from '@modules/app/components/App';

import { Provider } from "react-redux";
import store from "@modules/app/store";

render(
  <Provider store={store}>
    <App />
  </Provider>
  , document.getElementById('root'));
