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
            "Storm", "Tomorrow", "Sweet", "Rise", "Horizon", "Whisper", "Chasing", "Fate", "Embrace", 
            "Wings", "Hurt", "Pain", "Faith", "Lonely", "Heaven", "Glimmer", "Tides", "Bliss", 
            "Journey", "Voice", "Echo", "Touch", "Lover", "Stranger", "Smile", "Run", "Crush", 
            "Wild", "Courage", "Reflection", "Star", "Moonlight", "Chained", "Unfold", "Glow", 
            "Shadow", "Bound", "Scream", "Fading", "Whirlwind", "Mystery", "Desire", "Tidal", 
            "Destruction", "Survive", "Dreamer", "Lost", "Truth", "Rise", "Prison", "Regret", 
            "Shattered", "Violet", "Shine", "Stars", "Firework", "Golden", "Hollow", "Wander", 
            "Storm", "Revelation", "Pain", "Surrender", "Guilt", "Highway", "Bitter", "Rush", 
            "Crave", "On Fire", "Whispers", "Addicted", "Nocturnal", "Shattered", "Blaze", 
            "Lullaby", "Eclipse", "Runaway", "Electric", "Dreams", "Undercover", "Healing", 
            "Starlight", "Free", "Echoes", "Gravity", "Desire", "Toxic", "Flicker", "Rhythm", 
            "Unbreakable", "Voices", "Shivers", "Thunder", "Melt", "Gaze", "Prisoner", "Wildfire", 
            "Addiction", "Fall", "Surrender", "Breathe", "Chasing", "Mourn", "Magic", "Famous", 
            "Wicked", "Reflection", "Crash", "Falling", "Unstoppable", "Bleeding", "Moment", 
            "Whirl", "Sound", "Undone", "Rise", "Alive", "Skyfall", "Higher", "Fate", "Guilt", 
            "Madness", "Whispered", "Unravel", "Lost", "Pursuit", "Crimson", "Adore", "Rise", 
            "Tear", "Panic", "Starship", "Fly", "Gold", "Twist", "Rewind", "Scream", "Poison", 
            "Bleed", "Endless", "Destruction", "Voices", "Shattered", "Heavenly", "Instinct", 
            "Together", "Hands", "Frozen", "Flame", "Chase", "Phoenix", "Delight", "Supernova", 
            "Reckless", "Haven", "Illusion", "Loyalty", "Power", "Raven", "Mercy", "Twilight", 
            "Dreamscape", "Fallen", "Nightmare", "Scream", "Tidal", "Sunset", "Stranger", "Blinding", 
            "Soulmate", "Fever", "Glorious", "Timeless", "Memories", "Vibration", "Creeping", 
            "Escape", "Poisoned", "Dare", "Vivid", "Restless", "Fallout", "Escape", "Roar", "Sweet", 
            "Chasing", "Tempest", "Euphoria", "Sick", "Lover", "Shattered", "Runaway", "Fix", 
            "Regret", "Angels", "High", "Tearful", "Firefly", "Lover", "Grave", "Cloud", "Infatuation", 
            "Haze", "Sick", "Unholy", "Wanderer", "Lost", "Bleeding", "Endless", "Graveyard", "Dare", 
            "Eternal", "Raging", "Pulse", "Waves", "Fall", "Luminous", "Revival", "Electric", 
            "Shattered", "Vow", "Nightfall", "Glimpse", "Lurking", "Escaping", "Flames", "Whispers", 
            "Livid", "Flicker", "Alone", "Truth", "Shivers", "Alive", "Pulse", "Destruction", "Stolen", 
            "Blaze", "Frenzy", "Pray", "Melancholy", "Faith", "Thief", "Echoing", "Steal", "Screaming", 
            "Illusion", "Ravishing", "Unravel", "Bright", "Unfold", "Tremor", "Twisted", "Hunt", 
            "Candle", "Fleeting", "Haunting", "Bleak", "Fireworks", "Rush", "Chill", "Spin", 
            "Desire", "Reckless", "Wings", "Falling", "Grace", "Puzzle", "Chasing", "Caught", "Feeding", 
            "Whispers", "Moonbeam", "Chasing", "Rebel", "Believer", "Riding", "Wake", "Solace", 
            "Timeless", "Gravity", "Bliss", "Fury", "Hunger", "Wandering", "Tremble", "Boundless", 
            "Revive", "Shooting", "Hidden", "Worship", "Lament", "Forget", "Voice", "Unleashed", 
            "Fury", "Voices", "On Fire", "Revolt", "Running", "Hollow", "Touched", "Sparks", 
            "Waves", "Glare", "Awake", "Sacred", "Fire", "Inhale", "Desperate", "Liberation", 
            "Glimpse", "Echoes", "Ambush", "Blinding", "Vibration", "Victory", "Rising", "Darkness"
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
