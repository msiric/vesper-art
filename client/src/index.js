import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Interceptor from './shared/Interceptor/Interceptor.js';
import App from './components/App/App.js';
import Store from './components/Store/Store.js';
import * as serviceWorker from './serviceWorker.js';

ReactDOM.render(
  <React.StrictMode>
    <Store>
      <Interceptor>{(socket) => <App socket={socket} />}</Interceptor>
    </Store>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
