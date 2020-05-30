import './wdyr';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Interceptor from './shared/Interceptor/Interceptor';
import App from './components/App/App';
import Store from './components/Store/Store';
import * as serviceWorker from './serviceWorker';
import openSocket from 'socket.io-client';
const ENDPOINT = 'http://localhost:5000';
const socket = openSocket(ENDPOINT);

ReactDOM.render(
  <React.StrictMode>
    <Store>
      <Interceptor socket={socket}>
        <App socket={socket} />
      </Interceptor>
    </Store>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
