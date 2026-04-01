require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { initSocket } = require('./socket/gameSocket');

// Import Auth Routes
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Temporary clean database (remove in production)
(async () => {
  const GameRoom = require('./models/GameRoom');
  await GameRoom.deleteMany({});
  console.log("🧹 All old rooms deleted for clean start");
})();

app.use(cors({
  origin: "http://localhost:5173",   // Your frontend URL
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);     // ← Added Authentication Routes

app.get('/', (req, res) => res.send('Bingo Backend Running'));

// Start Server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Initialize Socket.io
initSocket(server);