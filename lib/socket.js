import jwt from "jsonwebtoken";
import ioLib from "socket.io";

const io = ioLib();
const socketApi = {};

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
        const foundUser = socketApi.connections.get(data.id);
        if (!foundUser) {
          socketApi.connections.set(data.id, [
            {
              id: socket.id,
              exp: data.exp,
            },
          ]);
        } else {
          socketApi.connections.set(data.id, [
            ...foundUser,
            {
              id: socket.id,
              exp: data.exp,
            },
          ]);
        }
        if (payload.data) {
          if (payload.data.type === "notification")
            for (let item of socketApi.connections.get(data.id)) {
              io.to(item.id).emit("sendNotification", payload.data.event);
            }
        }
      }
    } catch (err) {
      console.log(err);
    }
    socket.on("disconnectUser", (payload) => {
      console.log(
        "SOCKET AUTHENTICATED DISCONNECT",
        socket.id,
        socketApi.connections
      );
      const filteredData = socketApi.connections
        .get(payload.data.id)
        .filter((item) => item.id !== socket.id);
      console.log("FILTERED DATA", filteredData, socketApi.connections);
      socketApi.connections.set(payload.data.id, [filteredData]);
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
  const foundUser = socketApi.connections.get(userId);
  if (foundUser) {
    for (let item of foundUser) {
      if (Date.now() < item.exp * 1000) {
        console.log("SOCKET NOTIF SENT");
        io.to(item.id).emit("sendNotification", data);
      } else {
        console.log("SOCKET NOTIF EXPIRED");
        io.to(item.id).emit("expiredToken", {
          type: "notification",
          event: data,
        });
      }
    }
  }
};

export default socketApi;
