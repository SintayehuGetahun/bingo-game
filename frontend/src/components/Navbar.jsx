import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import socket from '../services/socket';

export default function Navbar() {
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleJoinRoom = () => {
    if (!playerName.trim()) return alert('Please enter your name');
    if (!roomCode.trim()) return alert('Please enter room code');

    setLoading(true);
    localStorage.setItem('playerName', playerName.trim());

    socket.emit('joinRoom', { 
      roomCode: roomCode.trim().toUpperCase(), 
      playerName: playerName.trim() 
    });
  };

  useEffect(() => {
    socket.on('playerJoined', () => {
      setLoading(false);
      setShowJoinModal(false);
      const currentRoomCode = roomCode.trim().toUpperCase();
      if (currentRoomCode) {
        navigate(`/game/${currentRoomCode}`);
      }
    });

    socket.on('error', (msg) => {
      setLoading(false);
      alert(msg || 'Failed to join room');
    });

    return () => {
      socket.off('playerJoined');
      socket.off('error');
    };
  }, [roomCode, navigate]);

  return (
    <>
      <nav className="bg-black/40 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-11 h-11 bg-yellow-400 rounded-2xl flex items-center justify-center text-3xl animate-pulse">🎲</div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tighter">BINGO</h1>
              <p className="text-xs text-yellow-400 -mt-1">Real-time Game</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 text-white font-medium">
            <Link to="/" className="hover:text-yellow-400 transition-all duration-300">Home</Link>
            <button 
              onClick={() => setShowJoinModal(true)}
              className="hover:text-yellow-400 transition-all duration-300"
            >
              Join Room
            </button>
            <Link to="/" className="hover:text-yellow-400 transition-all duration-300">Create Room</Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white text-3xl"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? '✖️' : '☰'}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black/60 backdrop-blur-md text-white flex flex-col gap-4 px-6 py-4 border-t border-white/10">
            <Link 
              to="/" 
              className="hover:text-yellow-400 transition-all duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <button 
              onClick={() => { setShowJoinModal(true); setMobileMenuOpen(false); }}
              className="hover:text-yellow-400 transition-all duration-300 text-left"
            >
              Join Room
            </button>
            <Link 
              to="/" 
              className="hover:text-yellow-400 transition-all duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Create Room
            </Link>
          </div>
        )}
      </nav>

      {/* Join Room Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100]">
          <div className="bg-white/10 backdrop-blur-2xl p-10 rounded-3xl w-full max-w-md border border-white/30 animate-scaleUp">
            <h2 className="text-3xl font-bold text-center mb-8 text-white">Join a Room</h2>

            <input
              type="text"
              placeholder="Your Name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-6 py-4 bg-white/20 border border-white/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 mb-6"
              disabled={loading}
            />

            <input
              type="text"
              placeholder="ROOM CODE (6 characters)"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              maxLength={7}
              className="w-full px-6 py-4 bg-white/20 border border-white/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 mb-8 uppercase tracking-widest"
              disabled={loading}
            />

            <div className="flex gap-4 flex-col sm:flex-row">
              <button
                onClick={() => {
                  setShowJoinModal(false);
                  setPlayerName('');
                  setRoomCode('');
                }}
                className="flex-1 py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-medium transition"
                disabled={loading}
              >
                Cancel
              </button>

              <button
                onClick={handleJoinRoom}
                disabled={loading || !playerName.trim() || !roomCode.trim()}
                className="flex-1 py-4 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 rounded-2xl font-bold text-white transition"
              >
                {loading ? 'Joining...' : 'JOIN ROOM'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}