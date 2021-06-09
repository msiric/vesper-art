import jwt from "jsonwebtoken";
import ioLib from "socket.io";

const io = ioLib();
export const socketApi = {};

socketApi.io = io;
socketApi.connections = new Map();

io.on("connection", (socket) => {
  console.log("SOCKET CONNECT", socket.id, socketApi.connections);
  socket.on("authenticateUser", (payload) => {
    console.log(
      "SOCKET AUTHENTICATE",
      socket.id,
      payload,
      socketApi.connections
    );
    try {
      const token = payload.token ? payload.token.split(" ")[1] : null;
      if (token) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const data = jwt.decode(token);
        socketApi.connections.set(data.id, {
          id: socket.id,
          exp: data.exp,
        });
        if (payload.data) {
          if (payload.data.type === "notification")
            io.to(socketApi.connections.get(data.id).id).emit(
              "sendNotification",
              payload.data.event
            );
        }
      }
    } catch (err) {
      console.log(err);
    }
    socket.on("disconnectUser", () => {
      console.log(
        "SOCKET AUTHENTICATED DISCONNECT",
        socket.id,
        socketApi.connections
      );
      for (let [key, value] of socketApi.connections) {
        if (value.id === socket.id) {
          socketApi.connections.delete(key);
          break;
        }
      }
      socket.disconnect(true);
    });
  });
  socket.on("disconnect", () => {
    console.log("SOCKET  DISCONNECT", socket.id, socketApi.connections);
    socket.disconnect();
  });
  socket.on("reconnect", (attemptNumber) => {
    console.log("SOCKET RECONNECT", socket.id, socketApi.connections);
    console.log(socket.id, attemptNumber);
  });
});

socketApi.sendNotification = (userId, data) => {
  console.log("SOCKET SEND NOTIF", userId, data, socketApi.connections);
  if (socketApi.connections.has(userId)) {
    if (Date.now() < socketApi.connections.get(userId).exp * 1000) {
      console.log("SOCKET NOTIF SENT");
      io.to(socketApi.connections.get(userId).id).emit(
        "sendNotification",
        data
      );
    } else {
      console.log("SOCKET NOTIF EXPIRED");
      io.to(socketApi.connections.get(userId).id).emit("expiredToken", {
        type: "notification",
        event: data,
      });
    }
  }
};

export default socketApi;
