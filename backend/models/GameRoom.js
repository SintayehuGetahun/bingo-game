const mongoose = require('mongoose');

const GameRoomSchema = new mongoose.Schema({
  roomCode: { type: String, required: true, unique: true },
  host: { type: String, required: true },
  players: [{
    socketId: String,
    name: String,
    card: Array,
    marked: { type: Map, of: Boolean, default: {} }
  }],
  calledNumbers: { type: [Number], default: [] },
  isStarted: { type: Boolean, default: false },
  winner: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GameRoom', GameRoomSchema);