const { generateBingoCard } = require('../utils/cardGenerator');
const { checkWin } = require('../utils/winChecker');
const GameRoom = require('../models/GameRoom');

let io;

function initSocket(server) {
  io = require('socket.io')(server, {
    cors: { origin: "*" }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Create Room
    socket.on('createRoom', async ({ playerName }) => {
      const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const card = generateBingoCard();

      const newRoom = new GameRoom({
        roomCode,
        host: socket.id,
        players: [{ socketId: socket.id, name: playerName, card, marked: new Map() }]
      });
      await newRoom.save();

      socket.join(roomCode);
      socket.emit('roomCreated', { roomCode, players: newRoom.players });
    });

    // Join Room
    socket.on('joinRoom', async ({ roomCode, playerName }) => {
      const room = await GameRoom.findOne({ roomCode });
      if (!room) return socket.emit('error', 'Room not found');

      if (room.isStarted) return socket.emit('error', 'Game already started');

      // Prevent duplicate players
      const existingPlayer = room.players.find(p => p.socketId === socket.id);
      if (!existingPlayer) {
        const card = generateBingoCard();
        room.players.push({ socketId: socket.id, name: playerName, card, marked: new Map() });
        await room.save();
      }

      socket.join(roomCode);

      // Emit unique players
      const uniquePlayers = room.players.filter(
        (player, index, self) =>
          index === self.findIndex(p => p.socketId === player.socketId)
      );
      io.to(roomCode).emit('playerJoined', uniquePlayers);
    });

    // Start Game (Host only)
    socket.on('startGame', async ({ roomCode }) => {
      const room = await GameRoom.findOne({ roomCode });
      if (!room || room.host !== socket.id) return;

      room.isStarted = true;
      await room.save();

      io.to(roomCode).emit('gameStarted', {
        calledNumbers: room.calledNumbers,
        players: room.players
      });
    });

    // Call Next Number (Host only)
    socket.on('callNumber', async ({ roomCode }) => {
      const room = await GameRoom.findOne({ roomCode });
      if (!room || room.host !== socket.id || !room.isStarted) return;

      let available = [];
      for (let i = 1; i <= 75; i++) {
        if (!room.calledNumbers.includes(i)) available.push(i);
      }

      if (available.length === 0) return;

      const nextNum = available[Math.floor(Math.random() * available.length)];
      room.calledNumbers.push(nextNum);
      await room.save();

      io.to(roomCode).emit('numberCalled', {
        number: nextNum,
        calledNumbers: room.calledNumbers
      });
    });

    // Mark Number on Card
    socket.on('markNumber', async ({ roomCode, row, col, number }) => {
      const room = await GameRoom.findOne({ roomCode });
      if (!room) return;

      const player = room.players.find(p => p.socketId === socket.id);
      if (!player) return;

      const key = `${row}-${col}`;
      player.marked.set(key, true);

      await room.save();

      // Check win
      const hasWon = checkWin(player.card, player.marked);
      if (hasWon && !room.winner) {
        room.winner = player.name;
        await room.save();
        io.to(roomCode).emit('bingo', { winner: player.name });
      }

      // Emit unique players
      const uniquePlayers = room.players.filter(
        (player, index, self) =>
          index === self.findIndex(p => p.socketId === player.socketId)
      );
      io.to(roomCode).emit('playerMarked', uniquePlayers);
    });

    // Leave room / disconnect
    socket.on('disconnect', async () => {
      console.log('User disconnected:', socket.id);

      const room = await GameRoom.findOne({ 'players.socketId': socket.id });
      if (room) {
        // Remove the disconnected player
        room.players = room.players.filter(player => player.socketId !== socket.id);
        await room.save();

        // Emit updated player list
        io.to(room.roomCode).emit('playerLeft', room.players);
      }
    });
  });
}

module.exports = { initSocket };