import React from "react";
import ReactDOM from "react-dom";
import { ReactQueryCacheProvider } from "react-query";
import Interceptor from "./containers/Interceptor/Interceptor.js";
import {
  appReducer,
  appStore,
  Provider as AppProvider,
} from "./contexts/App.js";
import {
  eventsReducer,
  eventsStore,
  Provider as EventsProvider,
} from "./contexts/Events.js";
import {
  Provider as UserProvider,
  userReducer,
  userStore,
} from "./contexts/User.js";
import "./index.css";
import * as serviceWorker from "./serviceWorker.js";
import queryCache from "./utils/cache.js";

ReactDOM.render(
  <React.StrictMode>
    <AppProvider reducer={appReducer} store={appStore}>
      <UserProvider reducer={userReducer} store={userStore}>
        <EventsProvider reducer={eventsReducer} store={eventsStore}>
          <ReactQueryCacheProvider queryCache={queryCache}>
            <Interceptor />
          </ReactQueryCacheProvider>
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
