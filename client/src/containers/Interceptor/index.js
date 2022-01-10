import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect } from "react";
import openSocket from "socket.io-client";
import useSound from "use-sound";
import { auth } from "../../../../common/constants";
import App from "../../App";
import notificationSound from "../../assets/sounds/notification-sound.wav";
import Backdrop from "../../components/Backdrop";
import { useAppStore } from "../../contexts/global/app";
import { useEventsStore } from "../../contexts/global/events";
import { useUserStore } from "../../contexts/global/user";
import { postRefresh } from "../../services/auth";
import history from "../../utils/history";

const ax = axios.create();
export const socket = { instance: null, payload: null };

const Interceptor = () => {
  const theme = useAppStore((state) => state.theme);
  const loading = useAppStore((state) => state.loading);
  const setApp = useAppStore((state) => state.setApp);

  const userToken = useUserStore((state) => state.token);
  const setUser = useUserStore((state) => state.setUser);
  const updateUser = useUserStore((state) => state.updateUser);
  const resetUser = useUserStore((state) => state.resetUser);

  const notificationCount = useEventsStore(
    (state) => state.notifications.count
  );
  const setEvents = useEventsStore((state) => state.setEvents);
  const updateEvents = useEventsStore((state) => state.updateEvents);
  const incrementNotification = useEventsStore(
    (state) => state.incrementNotification
  );

  const [playNotification] = useSound(notificationSound);

  const classes = {};

  const { enqueueSnackbar } = useSnackbar();

  const handleAuthError = () => {
    resetUser();
    if (history) history.push("/login");
  };

  const getRefreshToken = async () => {
    try {
      if (!userToken) {
        console.log("GET REFRESH TOKEN");
        setApp({ loading: true, error: false, theme });

        const { data } = await axios.post("/api/auth/refresh_token", {
          headers: {
            credentials: "include",
          },
        });

        if (data.user) {
          setUser({
            authenticated: true,
            token: data.accessToken,
            id: data.user.id,
            name: data.user.name,
            fullName: data.user.fullName,
            email: data.user.email,
            avatar: data.user.avatar,
            stripeId: data.user.stripeId,
            country: data.user.country,
            favorites: data.user.favorites.reduce((object, item) => {
              object[item.artworkId] = true;
              return object;
            }, {}),
          });
          setEvents({
            notifications: {
              items: [],
              count: data.user.notifications,
              hasMore: true,
              cursor:
                data.user.notifications[data.user.notifications.length - 1] &&
                data.user.notifications[data.user.notifications.length - 1].id,
            },
          });
        }
        setApp({ loading: false, error: false, theme });
      }
    } catch (err) {
      setApp({ loading: false, error: err, theme });
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
        console.log("RESPONSE", response);
        if (response.data && response.data.expose) {
          enqueueSnackbar(response.data.message, {
            variant: "success",
          });
        }
        return Promise.resolve(response);
      },
      async (error) => {
        if (
          error.response &&
          error.response.data.message === auth.loginMessage
        ) {
          return history.push("/login");
        }
        if (
          error.response &&
          error.response.config.url === auth.refreshEndpoint
        ) {
          handleAuthError();
          return Promise.reject(error);
        }
        if (error.response && error.response.status === 401) {
          if (socket && socket.instance) socket.instance.emit("disconnectUser");
          const { data } = await postRefresh.request();
          updateUser({
            token: data.accessToken,
            email: data.user.email,
            avatar: data.user.avatar,
            stripeId: data.user.stripeId,
            country: data.user.country,
            favorites: data.user.favorites.reduce((object, item) => {
              object[item.artworkId] = true;
              return object;
            }, {}),
          });
          updateEvents({
            notifications: { count: data.user.notifications },
          });
          const config = error.config;
          config._retry = true;
          config.headers["Authorization"] = `Bearer ${data.accessToken}`;

          return ax(config);
        }
        if (error.response && error.response.status !== 401) {
          if (error.response.data && error.response.data.expose) {
            enqueueSnackbar(error.response.data.message, {
              variant: "error",
            });
          }
          return Promise.reject(error);
        }
        return Promise.reject(error);
      }
    );
    handleSocket(token);
  };

  const handleSocketNotification = (data) => {
    console.log("INCREMENT NOFIRICATION");
    incrementNotification({ notification: data, cursor: data.id });
    playNotification();
  };

  const handleSocketRefresh = async (payload) => {
    console.log("SOCKETT REFRESH");
    try {
      socket.instance.emit("disconnectUser");
      const { data } = await axios.post(`/api/auth/refresh_token`, {
        headers: {
          credentials: "include",
        },
      });
      updateUser({
        token: data.accessToken,
        email: data.user.email,
        avatar: data.user.avatar,
        stripeId: data.user.stripeId,
        country: data.user.country,
        favorites: data.user.favorites.reduce((object, item) => {
          object[item.artworkId] = true;
          return object;
        }, {}),
      });
      if (notificationCount !== data.user.notifications) {
        updateEvents({
          notifications: { count: data.user.notifications },
        });
        playNotification();
      }

      // not needed because of useEffect?
      // socket.emit("authenticateUser", {
      //   token: `Bearer ${data.accessToken}`,
      //   data: payload,
      // });
      socket.payload = payload;
    } catch (err) {
      resetUser();
    }
  };

  const handleSocket = (token) => {
    if (token) {
      socket.instance = openSocket();

      socket.instance.emit("authenticateUser", {
        token: token ? `Bearer ${token}` : null,
        data: socket.payload,
      });
      socket.payload = null;
      socket.instance.on("sendNotification", handleSocketNotification);
      socket.instance.on("expiredToken", handleSocketRefresh);
    } else {
      if (socket && socket.instance) socket.instance.emit("disconnectUser");
    }
  };

  useEffect(() => {
    getRefreshToken();
    return () => {
      socket.instance.off("sendNotification", handleSocketNotification);
      socket.instance.off("expiredToken", handleSocketRefresh);
    };
  }, []);

  useEffect(() => {
    interceptTraffic(userToken);
    return () => {
      axios.interceptors.request.eject(ax);
      axios.interceptors.response.eject(ax);
    };
  }, [userToken]);

  return loading ? <Backdrop loading={loading} /> : <App />;
};

export { ax };
export default Interceptor;
