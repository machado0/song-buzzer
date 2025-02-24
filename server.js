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

    socket.on('generateRandomWord', () => {
        const randomWords = [
            "Love", "Heart", "Dream", "Night", "Fire", "Shine", "Touch", "Tears", "Fear", "Freedom",
            "Soul", "Angels", "Dancing", "Light", "Hope", "Strength", "Alive", "Grace", "Whisper", 
            "Storm", "Tomorrow", "Sweet", "Rise", "Horizon", "Chasing", "Fate", "Embrace", "Wings", 
            "Hurt", "Pain", "Faith", "Lonely", "Heaven", "Glimmer", "Tides", "Bliss", "Journey", 
            "Voice", "Echo", "Lover", "Stranger", "Smile", "Run", "Crush", "Wild", "Courage", 
            "Reflection", "Star", "Moonlight", "Chained", "Unfold", "Glow", "Shadow", "Bound", 
            "Scream", "Fading", "Whirlwind", "Mystery", "Desire", "Tidal", "Destruction", "Survive", 
            "Dreamer", "Lost", "Truth", "Prison", "Regret", "Shattered", "Violet", "Stars", "Firework", 
            "Golden", "Hollow", "Wander", "Revelation", "Surrender", "Guilt", "Highway", "Bitter", 
            "Rush", "Crave", "On Fire", "Whispers", "Addicted", "Nocturnal", "Blaze", "Lullaby", 
            "Eclipse", "Runaway", "Electric", "Dreams", "Undercover", "Healing", "Starlight", "Free", 
            "Echoes", "Gravity", "Toxic", "Flicker", "Rhythm", "Unbreakable", "Shivers", "Thunder", 
            "Melt", "Gaze", "Prisoner", "Wildfire", "Addiction", "Fall", "Breathe", "Mourn", "Magic", 
            "Famous", "Wicked", "Reflection", "Crash", "Unstoppable", "Bleeding", "Moment", "Whirl", 
            "Sound", "Undone", "Skyfall", "Higher", "Madness", "Unravel", "Pursuit", "Crimson", "Adore", 
            "Tear", "Panic", "Starship", "Fly", "Gold", "Twist", "Rewind", "Poison", "Bleed", "Endless", 
            "Heavenly", "Instinct", "Together", "Frozen", "Flame", "Chase", "Phoenix", "Delight", 
            "Supernova", "Reckless", "Haven", "Illusion", "Loyalty", "Power", "Raven", "Mercy", 
            "Twilight", "Dreamscape", "Nightmare", "Blinding", "Soulmate", "Fever", "Glorious", 
            "Timeless", "Vibration", "Creeping", "Escape", "Poisoned", "Dare", "Vivid", "Restless", 
            "Fallout", "Roar", "Tempest", "Euphoria", "Sick", "Fix", "Regret", "Tearful", "Firefly", 
            "Grave", "Cloud", "Infatuation", "Haze", "Unholy", "Wanderer", "Graveyard", "Dare", 
            "Eternal", "Raging", "Pulse", "Waves", "Luminous", "Revival", "Vow", "Nightfall", "Glimpse", 
            "Lurking", "Escaping", "Flames", "Livid", "Flicker", "Alone", "Truth", "Stolen", "Blaze", 
            "Frenzy", "Pray", "Melancholy", "Thief", "Steal", "Screaming", "Ravishing", "Bright", 
            "Unfold", "Tremor", "Twisted", "Hunt", "Candle", "Fleeting", "Haunting", "Fireworks", "Rush", 
            "Chill", "Spin", "Puzzle", "Caught", "Feeding", "Moonbeam", "Rebel", "Believer", "Riding", 
            "Wake", "Solace", "Timeless", "Bliss", "Fury", "Hunger", "Wandering", "Tremble", "Boundless", 
            "Revive", "Shooting", "Hidden", "Worship", "Lament", "Forget", "Unleashed", "Revolt", 
            "Running", "Hollow", "Touched", "Sparks", "Glare", "Awake", "Sacred", "Grave", "Desperate", 
            "Liberation", "Ambush", "Victory", "Rising", "Darkness"
        ];
        

        const randomIndex = Math.floor(Math.random() * randomWords.length);
        const randomWord = randomWords[randomIndex];

        io.emit('randomWordGenerated', randomWord);
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
