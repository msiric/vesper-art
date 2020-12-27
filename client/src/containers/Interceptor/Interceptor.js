import axios from "axios";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import openSocket from "socket.io-client";
import useSound from "use-sound";
import notificationSound from "../../assets/sounds/notification-sound.wav";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useTracked as useAppContext } from "../../contexts/App.js";
import { useTracked as useEventsContext } from "../../contexts/Events.js";
import { useTracked as useUserContext } from "../../contexts/User.js";
import App from "../../pages/App/App.js";
import { postLogout } from "../../services/user.js";

const ENDPOINT = "http://localhost:5000";

const ax = axios.create();
let socket = openSocket(ENDPOINT);

const Interceptor = ({ children }) => {
  const [appStore, appDispatch] = useAppContext();
  const [userStore, userDispatch] = useUserContext();
  const [eventsStore, eventsDispatch] = useEventsContext();

  const [playNotification] = useSound(notificationSound);

  const classes = {};

  const history = useHistory();

  const getRefreshToken = async () => {
    try {
      if (!userStore.token) {
        appDispatch({
          type: "SET_APP",
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
          userDispatch({
            type: "SET_USER",
            authenticated: true,
            token: data.accessToken,
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            avatar: data.user.avatar,
            stripeId: data.user.stripeId,
            country: data.user.country,
          });
          eventsDispatch({
            type: "SET_EVENTS",
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
          appDispatch({
            type: "SET_APP",
            loading: false,
            error: false,
            theme: appStore.theme,
          });
        } else {
          appDispatch({
            type: "SET_APP",
            loading: false,
            error: false,
            theme: appStore.theme,
          });
        }
      }
    } catch (err) {
      appDispatch({
        type: "SET_APP",
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
            type: "RESET_USER",
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
          type: "UPDATE_USER",
          token: data.accessToken,
          email: data.user.email,
          avatar: data.user.avatar,
          stripeId: data.user.stripeId,
          country: data.user.country,
        });

        eventsDispatch({
          type: "UPDATE_EVENTS",
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
    eventsDispatch({
      type: "ADD_NOTIFICATION",
      notification: data,
    });
    playNotification();
  };

  const handleSocketRefresh = async (payload) => {
    try {
      const { data } = await axios.post(`/api/auth/refresh_token`, {
        headers: {
          credentials: "include",
        },
      });

      userDispatch({
        type: "UPDATE_USER",
        token: data.accessToken,
        email: data.user.email,
        avatar: data.user.avatar,
        stripeId: data.user.stripeId,
        country: data.user.country,
      });
      socket.emit("authenticateUser", {
        token: `Bearer ${data.accessToken}`,
        data: payload,
      });
    } catch (err) {
      userDispatch({
        type: "RESET_USER",
      });
    }
  };

  const handleSocket = (token) => {
    socket = openSocket(ENDPOINT);

    socket.emit("authenticateUser", {
      token: token ? `Bearer ${token}` : null,
    });
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
    interceptTraffic(userStore.token);
    return () => {
      axios.interceptors.request.eject(ax);
      axios.interceptors.response.eject(ax);
    };
  }, [userStore.token]);

  return appStore.loading ? <LoadingSpinner /> : <App socket={socket} />;
};

export { ax };
export default Interceptor;
