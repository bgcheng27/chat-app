const io = require("socket.io")(3000, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

io.on("connection", (socket) => {
  socket.on("send-message", (message, roomId) => {
    console.log(message);
    socket.to(roomId).emit("receive-message", message);
  });
  socket.on("change-room", (room) => {
    socket.join(room);
  });
});
