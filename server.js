const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*", 
    }
});

app.use(express.static('public'));
app.use(cors());

let players = {}; 
let winner = null;

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("setName", (name) => {
        socket.username = name;
        players[socket.id] = name; 
        io.emit('updatePlayerList', Object.values(players)); 
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
        console.log("A user disconnected");
        delete players[socket.id]; 
        io.emit('updatePlayerList', Object.values(players));
    });
});

const PORT = process.env.PORT || 4000; 
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
