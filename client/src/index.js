import React from "react";
import ReactDOM from "react-dom";
import Interceptor from "./containers/Interceptor/Interceptor.js";
import AppProvider from "./contexts/App.js";
import EventsProvider from "./contexts/Events.js";
import UserProvider from "./contexts/User.js";
import "./index.css";
import * as serviceWorker from "./serviceWorker.js";

ReactDOM.render(
  <React.StrictMode>
    <AppProvider>
      <UserProvider>
        <EventsProvider>
          <Interceptor />
        </EventsProvider>
      </UserProvider>
    </AppProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
