import jwt from "jsonwebtoken";
import ioLib from "socket.io";
import { tokens } from "../config/secret";

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
    console.log(
      "FILTERED DATA",
      filteredData,
      socketApi.users,
      socketApi.sockets
    );
  }
  socket.disconnect(true);
};

io.on("connection", (socket) => {
  console.log("SOCKET CONNECT", socket.id, socketApi.users, socketApi.sockets);
  socket.on("authenticateUser", (payload) => {
    console.log(
      "SOCKET AUTHENTICATE",
      socket.id,
      payload,
      socketApi.users,
      socketApi.sockets
    );
    try {
      const token = payload.token ? payload.token.split(" ")[1] : null;
      if (token) {
        jwt.verify(token, tokens.accessToken);
        const data = jwt.decode(token);
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
        /*         if (payload.data) {
          if (payload.data.type === "notification")
            for (let item of socketApi.users.get(data.id)) {
              io.to(item.id).emit("sendNotification", payload.data.event);
            }
        } */
        console.log(
          "SOCKET AFTER AUTHENTICATE",
          socket.id,
          payload,
          socketApi.users,
          socketApi.sockets
        );
      }
    } catch (err) {
      console.log(err);
    }
    socket.on("disconnectUser", () => {
      console.log(
        "SOCKET AUTHENTICATED DISCONNECT",
        socket.id,
        socketApi.users,
        socketApi.sockets
      );
      handleDisconnect(socketApi, socket);
    });
  });
  socket.on("disconnect", () => {
    console.log(
      "SOCKET  DISCONNECT",
      socket.id,
      socketApi.users,
      socketApi.sockets
    );
    handleDisconnect(socketApi, socket);
  });
  socket.on("reconnect", (attemptNumber) => {
    console.log(
      "SOCKET RECONNECT",
      socket.id,
      socketApi.users,
      socketApi.sockets
    );
    console.log(socket.id, attemptNumber);
  });
});

socketApi.sendNotification = (userId, data) => {
  console.log(
    "SOCKET SEND NOTIF",
    userId,
    data,
    socketApi.users,
    socketApi.sockets
  );
  const foundUser = socketApi.users.get(userId);
  if (foundUser) {
    for (let item of foundUser) {
      if (Date.now() < item.exp * 1000) {
        console.log("SOCKET NOTIF SENT");
        io.to(item.id).emit("sendNotification", data);
      } else {
        console.log("SOCKET NOTIF EXPIRED", item.id);
        io.to(item.id).emit("expiredToken", {
          type: "notification",
          event: data,
        });
      }
    }
  }
};

export default socketApi;
