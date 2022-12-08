import ioLib from "socket.io";
import { tokens } from "../config/secret";
import { verifyTokenValidity } from "../utils/helpers";

const io = ioLib();
const socketApi = {};

socketApi.io = io;
socketApi.users = new Map();
socketApi.sockets = new Map();

const handleDisconnect = (socketApi, socket) => {
  const foundUser = socketApi.sockets.get(socket.id);
  if (foundUser) {
    const filteredData = socketApi.users
      .get(foundUser)
      .filter((item) => item.id !== socket.id);
    socketApi.users.set(foundUser, filteredData);
    socketApi.sockets.delete(socket.id);
  }
  socket.disconnect(true);
};

io.on("connection", (socket) => {
  socket.on("authenticateUser", (payload) => {
    try {
      const token = payload.token ? payload.token.split(" ")[1] : null;
      if (token) {
        const { data } = verifyTokenValidity(token, tokens.accessToken, false);
        const foundUser = socketApi.users.get(data.id);
        if (!foundUser) {
          socketApi.users.set(data.id, [
            {
              id: socket.id,
              exp: data.exp,
            },
          ]);
        } else {
          socketApi.users.set(data.id, [
            ...foundUser,
            {
              id: socket.id,
              exp: data.exp,
            },
          ]);
        }
        socketApi.sockets.set(socket.id, data.id);
      }
    } catch (err) {
      // do nothing
    }
    socket.on("disconnectUser", () => {
      handleDisconnect(socketApi, socket);
    });
  });
  socket.on("disconnect", () => {
    handleDisconnect(socketApi, socket);
  });
  socket.on("reconnect", (attemptNumber) => {
    // do nothing
  });
});

socketApi.sendNotification = (userId, data) => {
  const foundUser = socketApi.users.get(userId);
  if (foundUser) {
    for (let item of foundUser) {
      if (Date.now() < item.exp * 1000) {
        io.to(item.id).emit("sendNotification", data);
      } else {
        io.to(item.id).emit("expiredToken", {
          type: "notification",
          event: data,
        });
      }
    }
  }
};

export default socketApi;
