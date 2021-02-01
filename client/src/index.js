import React from "react";
import ReactDOM from "react-dom";
import Interceptor from "./containers/Interceptor/Interceptor.js";
import {
  eventsReducer,
  eventsStore,
  Provider as EventsProvider,
} from "./contexts/global/events.js";
import {
  Provider as UserProvider,
  userReducer,
  userStore,
} from "./contexts/global/user.js";
import "./index.css";
import * as serviceWorker from "./serviceWorker.js";

ReactDOM.render(
  <React.StrictMode>
    <UserProvider reducer={userReducer} store={userStore}>
      <EventsProvider reducer={eventsReducer} store={eventsStore}>
        <Interceptor />
      </EventsProvider>
    </UserProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
