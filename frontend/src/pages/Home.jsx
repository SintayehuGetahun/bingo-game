import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../services/socket';

export default function Home() {
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleRoomCreated = ({ roomCode: newRoomCode }) => {
      setLoading(false);
      navigate(`/game/${newRoomCode}`);
    };

    const handlePlayerJoined = () => {
      setLoading(false);
      navigate(`/game/${roomCode.toUpperCase()}`);
    };

    const handleError = (msg) => {
      setLoading(false);
      alert(msg || 'Something went wrong');
    };

    socket.on('roomCreated', handleRoomCreated);
    socket.on('playerJoined', handlePlayerJoined);
    socket.on('error', handleError);

    return () => {
      socket.off('roomCreated', handleRoomCreated);
      socket.off('playerJoined', handlePlayerJoined);
      socket.off('error', handleError);
    };
  }, [navigate, roomCode]);

  const createRoom = () => {
    if (!playerName.trim()) return alert('Please enter your name');
    setLoading(true);
    socket.emit('createRoom', { playerName: playerName.trim() });
  };

  const joinRoom = () => {
    if (!playerName.trim()) return alert('Please enter your name');
    if (!roomCode.trim()) return alert('Please enter room code');
    setLoading(true);
    socket.emit('joinRoom', { roomCode: roomCode.trim().toUpperCase(), playerName: playerName.trim() });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-violet-950 flex flex-col">

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="text-center max-w-md w-full">

          <div className="mb-8 sm:mb-12">
            <h1 className="text-6xl sm:text-8xl font-black text-yellow-400 tracking-widest mb-3 sm:mb-4">BINGO!</h1>
            <p className="text-lg sm:text-2xl text-white/80">Play with friends instantly</p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl p-6 sm:p-10 rounded-3xl shadow-2xl border border-white/20">

            {/* Name Input */}
            <input
              type="text"
              placeholder="Your Name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/20 border border-white/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 text-base sm:text-lg mb-4 sm:mb-6"
              disabled={loading}
            />

            {/* Create Room Button */}
            <button
              onClick={createRoom}
              disabled={loading || !playerName.trim()}
              className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-600 text-black font-bold py-3 sm:py-4 rounded-2xl text-base sm:text-xl mb-4 sm:mb-6 transition-all"
            >
              {loading ? 'Creating Room...' : '🎮 Create New Room'}
            </button>

            <div className="text-white/60 text-sm mb-4 sm:mb-6">— OR —</div>

            {/* Join Room */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-3">
              <input
                type="text"
                placeholder="ROOM CODE"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                maxLength={6}
                className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-white/20 border border-white/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 text-base sm:text-lg uppercase tracking-widest"
                disabled={loading}
              />
              <button
                onClick={joinRoom}
                disabled={loading || !roomCode.trim() || !playerName.trim()}
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-600 px-6 sm:px-10 py-3 sm:py-4 rounded-2xl font-bold text-base sm:text-lg transition-all"
              >
                {loading ? 'Joining...' : 'JOIN'}
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}