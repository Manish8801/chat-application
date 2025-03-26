import { Server } from "socket.io";
import http from "http";
import express from "express";

function getReceiverSocketId(userId: string) {
  return userSocketMap[userId];
}
const app = express();
const server = http.createServer(app);

// io setup
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

// stores socket.id for each user by their _id
const userSocketMap: { [key: string]: string } = {};

io.on("connect", (socket) => {

  const { userId } = socket.handshake.query as { userId: string }; // gets the userId from the client

  userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap)); // will send the online users'ids

  socket.on("disconnect", (reason) => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server, getReceiverSocketId };
