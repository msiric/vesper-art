import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import openSocket from "socket.io-client";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner.js";
import { AppContext } from "../../contexts/App.js";
import { EventsContext } from "../../contexts/Events.js";
import { UserContext } from "../../contexts/User.js";
import App from "../../pages/App/App.js";
import { postLogout } from "../../services/user.js";
const ENDPOINT = "http://localhost:5000";

const ax = axios.create();
let socket = openSocket(ENDPOINT);

const Interceptor = ({ children }) => {
  const [appStore, appDispatch] = useContext(AppContext);
  const [userStore, userDispatch] = useContext(UserContext);
  const [eventsStore, eventsDispatch] = useContext(EventsContext);

  const classes = {};

  const history = useHistory();

  const getRefreshToken = async () => {
    try {
      if (!userStore.token) {
        appDispatch({
          type: "setApp",
          loading: true,
          error: false,
          theme: appStore.theme,
        });

        const { data } = await axios.post("/api/auth/refresh_token", {
          headers: {
            credentials: "include",
          },
        });

        if (data.user) {
          appDispatch({
            type: "setApp",
            loading: false,
            error: false,
            theme: appStore.theme,
          });
          userDispatch({
            type: "setUser",
            authenticated: true,
            token: data.accessToken,
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            photo: data.user.photo,
            stripeId: data.user.stripeId,
            country: data.user.country,
            saved: data.user.saved.reduce(function (object, item) {
              object[item] = true;
              return object;
            }, {}),
            intents: data.user.intents.reduce(function (object, item) {
              object[item.artworkId] = item.intentId;
              return object;
            }, {}),
          });
          eventsDispatch({
            type: "setEvents",
            messages: {
              items: [],
              count: data.user.messages,
            },
            notifications: {
              items: [],
              count: data.user.notifications,
              hasMore: true,
              dataCursor: 0,
              dataCeiling: 10,
            },
          });
        } else {
          appDispatch({
            type: "setApp",
            loading: false,
            error: false,
            theme: appStore.theme,
          });
        }
      }
    } catch (err) {
      appDispatch({
        type: "setApp",
        loading: false,
        error: true,
        theme: appStore.theme,
      });
    }
  };

  const interceptTraffic = (token) => {
    if (token) {
      ax.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete ax.defaults.headers.common["Authorization"];
    }

    ax.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        console.log(error);
        if (error.response.status !== 401) {
          return new Promise((resolve, reject) => {
            reject(error);
          });
        }

        if (
          error.config.url === "/api/auth/refresh_token" ||
          error.response.message === "Forbidden"
        ) {
          await postLogout.request();
          userDispatch({
            type: "resetUser",
          });
          history.push("/login");

          return new Promise((resolve, reject) => {
            reject(error);
          });
        }

        const { data } = await axios.post("/api/auth/refresh_token", {
          headers: {
            credentials: "include",
          },
        });

        userDispatch({
          type: "updateUser",
          token: data.accessToken,
          email: data.user.email,
          photo: data.user.photo,
          stripeId: data.user.stripeId,
          country: data.user.country,
          saved: data.user.saved,
        });
        eventsDispatch({
          type: "updateEvents",
          messages: { items: [], count: data.user.messages },
          notifications: { count: data.user.notifications },
        });

        const config = error.config;
        config.headers["Authorization"] = `Bearer ${data.accessToken}`;

        return new Promise((resolve, reject) => {
          axios
            .request(config)
            .then((response) => {
              resolve(response);
            })
            .catch((error) => {
              reject(error);
            });
        });
      }
    );

    handleSocket(token);
  };

  const handleSocketNotification = (data) => {
    console.log("data", data);
    eventsDispatch({
      type: "addNotification",
      notification: data,
    });
  };

  const handleSocketRefresh = async () => {
    try {
      const { data } = await axios.post(`/api/auth/refresh_token`, {
        headers: {
          credentials: "include",
        },
      });
      userDispatch({
        type: "updateUser",
        token: data.accessToken,
        email: data.user.email,
        photo: data.user.photo,
        stripeId: data.user.stripeId,
        country: data.user.country,
        saved: data.user.saved,
      });
      eventsDispatch({
        type: "updateEvents",
        messages: { items: [], count: data.user.messages },
        notifications: { count: data.user.notifications },
      });
      socket.emit("authenticateUser", `Bearer ${data.accessToken}`);
    } catch (err) {
      userDispatch({
        type: "resetUser",
      });
    }
  };

  const handleSocket = (token) => {
    socket = openSocket(ENDPOINT);

    socket.emit("authenticateUser", token ? `Bearer ${token}` : null);
    socket.on("sendNotification", handleSocketNotification);
    socket.on("expiredToken", handleSocketRefresh);
  };

  useEffect(() => {
    getRefreshToken();
    return () => {
      socket.off("sendNotification", handleSocketNotification);
      socket.off("expiredToken", handleSocketRefresh);
    };
  }, []);

  useEffect(() => {
    if (!appStore.loading) interceptTraffic(userStore.token);
  }, [userStore.token]);

  return !appStore.loading ? <App socket={socket} /> : <LoadingSpinner />;
};

export { ax };
export default Interceptor;
