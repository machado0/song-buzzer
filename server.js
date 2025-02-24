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
            "Love/Amor", "Heart/Coração", "Dream/Sonho", "Night/Noite", "Fire/Fogo", "Shine/Brilho", 
            "Touch/Tocar", "Tears/Lágrimas", "Fear/Medo", "Freedom/Liberade", "Soul/Alma", "Angels/Anjos", 
            "Dancing/Dançando", "Light/Luz", "Hope/Esperança", "Strength/Fortaleza", "Alive/Vivo", 
            "Grace/Graça", "Whisper/Sussurro", "Storm/Tempestade", "Tomorrow/Amanhã", "Sweet/Doce", 
            "Rise/Subir", "Horizon/Horizonte", "Chasing/Perseguindo", "Fate/Destino", "Embrace/Abraço", 
            "Wings/Asas", "Hurt/Dor", "Pain/Dor", "Faith/Fé", "Lonely/Solitário", "Heaven/Céu", 
            "Glimmer/Brilho", "Tides/Mares", "Bliss/Felicidade", "Journey/Jornada", "Voice/Voz", 
            "Echo/Eco", "Lover/Amante", "Stranger/Estranho", "Smile/Sorriso", "Run/Correr", "Crush/Paixão", 
            "Wild/ Selvagem", "Courage/Coração", "Reflection/Reflexão", "Star/Estrela", "Moonlight/Luz da lua", 
            "Chained/Acorrentado", "Unfold/Desdobrar", "Glow/Brilhar", "Shadow/Sombra", "Bound/Amarrado", 
            "Scream/Grito", "Fading/Desaparecendo", "Whirlwind/Tornado", "Mystery/Mistério", "Desire/Desire", 
            "Tidal/Tidal", "Destruction/Destruição", "Survive/Sobreviver", "Dreamer/Sonhador", "Lost/Perdido", 
            "Truth/Verdade", "Prison/Prisão", "Regret/Arrependimento", "Shattered/Quebrado", "Violet/Violeta", 
            "Stars/Estrelas", "Firework/Fogos de artifício", "Golden/Dourado", "Hollow/Vazio", "Wander/Vagar", 
            "Revelation/Revelação", "Surrender/Rendição", "Guilt/Culpa", "Highway/Estrada", "Bitter/Amargo", 
            "Rush/Pressa", "Crave/Ansiar", "On Fire/Em chamas", "Whispers/Sussurros", "Addicted/Adicto", 
            "Nocturnal/Noturno", "Blaze/Chama", "Lullaby/Ninar", "Eclipse/Eclipse", "Runaway/Fugir", 
            "Electric/Elétrico", "Dreams/Sonhos", "Undercover/Disfarçado", "Healing/Cura", "Starlight/Luz das estrelas", 
            "Free/Livre", "Echoes/Ecos", "Gravity/Gravidade", "Toxic/Tóxico", "Flicker/Flicker", "Rhythm/Ritmo", 
            "Unbreakable/Inquebrável", "Shivers/Calafrios", "Thunder/Trovão", "Melt/Fundir", "Gaze/Olhada", 
            "Prisoner/Prisioneiro", "Wildfire/Fogo selvagem", "Addiction/Dependência", "Fall/Queda", "Breathe/Respirar", 
            "Mourn/Lamentar", "Magic/Mágica", "Famous/Famoso", "Wicked/Ímpio", "Reflection/Reflexão", 
            "Crash/Bater", "Unstoppable/Incontrolável", "Bleeding/Sangrando", "Moment/Momento", "Whirl/Girar", 
            "Sound/Som", "Undone/Desfeito", "Skyfall/Queda do céu", "Higher/Acima", "Madness/Loucura", "Unravel/Desenrolar", 
            "Pursuit/Pursuit", "Crimson/Carmesim", "Adore/Adorar", "Tear/Lágrima", "Panic/Pânico", "Starship/Nave estelar", 
            "Fly/Voar", "Gold/Ouro", "Twist/Twist", "Rewind/Rebobinar", "Poison/Veneno", "Bleed/Sangrar", "Endless/Infinitos", 
            "Heavenly/Celestial", "Instinct/Instinto", "Together/Juntos", "Frozen/ Congelado", "Flame/Chama", "Chase/Perseguir", 
            "Phoenix/Fênix", "Delight/Delícia", "Supernova/Supernova", "Reckless/Imprudente", "Haven/Refúgio", "Illusion/Ilusão", 
            "Loyalty/Lealdade", "Power/Poder", "Raven/Corvo", "Mercy/Misericórdia", "Twilight/Crepúsculo", 
            "Dreamscape/Mundo dos sonhos", "Nightmare/Pesadelo", "Blinding/Cegante", "Soulmate/Alma gêmea", 
            "Fever/Febre", "Glorious/Glorioso", "Timeless/Imortal", "Vibration/Vibração", "Creeping/Rastejando", 
            "Escape/Escape", "Poisoned/Envenenado", "Dare/Ousar", "Vivid/Vivo", "Restless/Descansando", "Fallout/Falha", 
            "Roar/Rugir", "Tempest/Tempestade", "Euphoria/Euforia", "Sick/Doente", "Fix/Consertar", "Regret/Arrependimento", 
            "Tearful/Choroso", "Firefly/Vaga-lume", "Grave/Cova", "Cloud/Nuvem", "Infatuation/Paixão", "Haze/Névoa", 
            "Unholy/Santo", "Wanderer/Viajante", "Graveyard/Cemitério", "Dare/Ousar", "Eternal/Eterno", "Raging/Enfurecendo", 
            "Pulse/Pulso", "Waves/Ondas", "Luminous/Luminoso", "Revival/Renascimento", "Vow/Jurar", "Nightfall/Queda da noite", 
            "Glimpse/Vislumbre", "Lurking/Escondido", "Escaping/Escapando", "Flames/Chamas", "Livid/Bravo", 
            "Flicker/Flicker", "Alone/Só", "Truth/Verdade", "Stolen/Roubado", "Blaze/Chama", "Frenzy/Frenesi", 
            "Pray/Rezar", "Melancholy/Melancolia", "Thief/Ladrão", "Steal/Roubar", "Screaming/Gritando", 
            "Ravishing/Deslumbrante", "Bright/Brilhante", "Unfold/Desdobrar", "Tremor/Tremor", "Twisted/Retorcido", 
            "Hunt/Caçar", "Candle/Candeeiro", "Fleeting/Passageiro", "Haunting/Assombrando", "Fireworks/Fogos de artifício", 
            "Rush/Pressa", "Chill/Calafrio", "Spin/Girar", "Puzzle/Puzzle", "Caught/Pego", "Feeding/Alimentando", 
            "Moonbeam/Raio da lua", "Rebel/Rebelde", "Believer/Crente", "Riding/Andando", "Wake/Acordar", 
            "Solace/Consolo", "Timeless/Imortal", "Bliss/Felicidade", "Fury/Fúria", "Hunger/Fome", "Wandering/Vagando", 
            "Tremble/Tremor", "Boundless/Sem limites", "Revive/Renovar", "Shooting/Tiro", "Hidden/Escondido", 
            "Worship/Adoração", "Lament/Lamentar", "Forget/Esquecer", "Unleashed/Liberado", "Revolt/Revolta", 
            "Running/Correndo", "Hollow/Vazio", "Touched/Tocado", "Sparks/Fagulhas", "Glare/Brilho", "Awake/Acordado", 
            "Sacred/Sagrado", "Inhale/Inalar", "Desperate/Desesperado", "Liberation/Libertação", "Ambush/Emboscada", 
            "Victory/Vitória", "Rising/Ascensão", "Darkness/Escuridão"
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
