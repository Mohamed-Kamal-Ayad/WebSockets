"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = require("path");
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://127.0.0.1:8000",
    },
});
app.get("/", (req, res) => {
    res.sendFile((0, path_1.join)(__dirname, "../index.html"));
});
io.on("connection", (socket) => {
    console.log("new user connected with socket id:", socket.id);
    socket.on("chat message", (msg) => {
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
