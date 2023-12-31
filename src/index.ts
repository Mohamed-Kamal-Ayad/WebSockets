import express, { Request, Response, NextFunction } from "express";
import { join } from "path";
import { Server, Socket } from "socket.io";
import http from "http";
import cors from "cors";

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:8000",
  },
});

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "../index.html"));
});

io.on("connection", (socket: Socket) => {
  console.log("new user connected with socket id:", socket.id);
  socket.on("chat message", (msg: string) => {
    console.log("message: " + msg);
    io.emit("send_messages_to_all_users", msg);
  });

  socket.on("typing", () => {
    socket.broadcast.emit("show_typing_status");
  });
  socket.on("stop_typing", () => {
    socket.broadcast.emit("clear_typing_status");
  });
  socket.on("disconnect", () => {
    console.log(`${socket.id} has left the chat!`);
  });
});

server.listen(3000, () => {
  console.log("listening");
});
