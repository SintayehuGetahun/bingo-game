require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { initSocket } = require('./socket/gameSocket');
const GameRoom = require('./models/GameRoom');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();
// ✅ TEMP CLEAN DATABASE
(async () => {
  await GameRoom.deleteMany({});
  console.log("🧹 All rooms deleted (clean start)");
})();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Bingo Backend Running'));

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

initSocket(server);