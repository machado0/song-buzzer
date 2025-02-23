const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors()); 

let winner = null;

io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("setName", (name) => {
        socket.username = name;
    });

    socket.on("pressButton", () => {
        if (!winner) {
            winner = socket.username;
            io.emit("winnerDeclared", winner);
            setTimeout(() => {
                winner = null;
                io.emit("resetGame");
            }, 5000);
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
