import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import openSocket from "socket.io-client";
import useSound from "use-sound";
import notificationSound from "../../assets/sounds/notification-sound.wav";
import Backdrop from "../../components/Backdrop";
import { useAppStore } from "../../contexts/global/app";
import { useEventsStore } from "../../contexts/global/events";
import { useUserStore } from "../../contexts/global/user";
import App from "../../pages/App/App";
import { postLogout } from "../../services/user";

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

  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

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
            email: data.user.email,
            avatar: data.user.avatar,
            stripeId: data.user.stripeId,
            country: data.user.country,
            favorites: data.user.favorites.reduce((object, item) => {
              object[item.artworkId] = true;
              return object;
            }, {}),
            intents: data.user.intents.reduce((object, item) => {
              object[item.artworkId] = item.intentId;
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
              limit: 10,
            },
          });
          setApp({ loading: false, error: false, theme });
        } else {
          setApp({ loading: false, error: false, theme });
        }
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
        return response;
      },
      async (error) => {
        console.log("ERROR", error);
        if (error.response.status !== 401) {
          if (error.response.data && error.response.data.expose) {
            enqueueSnackbar(error.response.data.error, {
              variant: "error",
            });
          }
          return new Promise((resolve, reject) => {
            reject(error);
          });
        }
        socket.instance.emit("disconnectUser");
        if (
          error.config.url === "/api/auth/refresh_token" ||
          error.response.message === "Forbidden"
        ) {
          await postLogout.request();
          resetUser();
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
        console.log("UPDATE REFRESH TOKEN");
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
          intents: data.user.intents.reduce((object, item) => {
            object[item.artworkId] = item.intentId;
            return object;
          }, {}),
        });
        updateEvents({
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
        intents: data.user.intents.reduce((object, item) => {
          object[item.artworkId] = item.intentId;
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
