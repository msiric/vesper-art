import jwt from "jsonwebtoken";
import ioLib from "socket.io";

const io = ioLib();
const socketApi = {};

socketApi.io = io;
socketApi.connections = new Map();

io.on("connection", (socket) => {
  socket.on("authenticateUser", (payload) => {
    try {
      console.log("authenitcate payload", payload);
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
  });
  socket.on("disconnect", () => {
    for (let [key, value] of socketApi.connections) {
      if (value.id === socket.id) {
        socketApi.connections.delete(key);
        break;
      }
    }
    socket.disconnect();
  });
});

socketApi.sendNotification = (id, data) => {
  const userId = id.toString();
  if (socketApi.connections.has(userId)) {
    if (Date.now() < socketApi.connections.get(userId).exp * 1000)
      io.to(socketApi.connections.get(userId).id).emit(
        "sendNotification",
        data
      );
    else
      io.to(socketApi.connections.get(userId).id).emit("expiredToken", {
        type: "notification",
        event: data,
      });
  }
};

export default socketApi;
