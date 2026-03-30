import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import socket from '../services/socket';

export default function Lobby() {
  const [players, setPlayers] = useState([]);
  const [roomCode, setRoomCode] = useState('');
  const [isHost, setIsHost] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get roomCode from URL if passed
    const params = new URLSearchParams(location.search);
    const code = params.get('roomCode');
    if (code) setRoomCode(code);

    socket.on('playerJoined', (updatedPlayers) => {
      setPlayers(updatedPlayers);
      // Check if current user is host (first player)
      setIsHost(updatedPlayers[0]?.socketId === socket.id);
    });

    socket.on('gameStarted', () => {
      navigate(`/game/${roomCode}`);
    });

    socket.on('error', (msg) => {
      alert(msg);
      navigate('/');
    });

    return () => {
      socket.off('playerJoined');
      socket.off('gameStarted');
      socket.off('error');
    };
  }, [roomCode, navigate, location]);

  const startGame = () => {
    socket.emit('startGame', { roomCode });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-10 max-w-lg w-full text-center">
        <h1 className="text-5xl font-bold text-yellow-400 mb-2">Waiting Room</h1>
        <p className="text-2xl mb-8">Room Code: <span className="font-mono tracking-widest text-white">{roomCode}</span></p>

        <div className="mb-10">
          <h2 className="text-2xl mb-6 text-white/90">Players in Room ({players.length})</h2>
          
          <div className="space-y-3">
            {players.length > 0 ? (
              players.map((player, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between bg-white/10 hover:bg-white/20 transition px-6 py-4 rounded-2xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-yellow-400 text-black rounded-full flex items-center justify-center font-bold">
                      {player.name[0].toUpperCase()}
                    </div>
                    <span className="text-xl font-medium">
                      {player.name}
                      {index === 0 && " 👑 (Host)"}
                      {player.socketId === socket.id && " (You)"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 py-8">Waiting for players to join...</p>
            )}
          </div>
        </div>

        {isHost && (
          <button
            onClick={startGame}
            disabled={players.length < 2}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition py-5 rounded-2xl text-2xl font-bold mt-6"
          >
            {players.length < 2 ? "Need at least 2 players" : "🚀 Start the Game"}
          </button>
        )}

        {!isHost && (
          <p className="text-gray-400 mt-8">Waiting for host to start the game...</p>
        )}

        <button
          onClick={() => navigate('/')}
          className="mt-8 text-white/70 hover:text-white underline"
        >
          Leave Room
        </button>
      </div>
    </div>
  );
}