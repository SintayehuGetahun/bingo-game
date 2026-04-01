import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import socket from '../services/socket';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Handle Join Room Click - Check if logged in first
  const handleJoinClick = () => {
    if (!user) {
      alert("Please login first to join a room!");
      navigate('/login');
      return;
    }
    setShowJoinModal(true);
  };

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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <nav className="bg-black/40 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-11 h-11 bg-yellow-400 rounded-2xl flex items-center justify-center text-3xl">🎲</div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tighter">BINGO</h1>
              <p className="text-xs text-yellow-400 -mt-1">Real-time Game</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 text-white font-medium">
            <Link to="/" className="hover:text-yellow-400 transition">Home</Link>
            
            <button 
              onClick={handleJoinClick}           // ← Changed here
              className="hover:text-yellow-400 transition"
            >
              Join Room
            </button>

            <Link to="/" className="hover:text-yellow-400 transition">Create Room</Link>
          </div>

          {/* Right Side - User Info */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="hidden md:flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-white/70">Hi,</p>
                  <p className="font-semibold text-yellow-400">{user.name}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 rounded-xl text-sm font-medium transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                className="hidden md:block px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition"
              >
                Login 
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white text-3xl"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? '✖️' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black/80 backdrop-blur-md text-white px-6 py-6 border-t border-white/10">
            <div className="flex flex-col gap-5 text-lg">
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              
              <button 
                onClick={() => { 
                  setMobileMenuOpen(false); 
                  handleJoinClick(); 
                }}
                className="text-left"
              >
                Join Room
              </button>

              <Link to="/" onClick={() => setMobileMenuOpen(false)}>Create Room</Link>

              {user ? (
                <button 
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="text-red-400 text-left"
                >
                  Logout
                </button>
              ) : (
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  Login 
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Join Room Modal - Only shown if user is logged in */}
      {showJoinModal && user && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
          <div className="bg-white/10 backdrop-blur-2xl p-10 rounded-3xl w-full max-w-md border border-white/30">
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
              placeholder="ROOM CODE"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              maxLength={6}
              className="w-full px-6 py-4 bg-white/20 border border-white/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 mb-8 uppercase tracking-widest"
              disabled={loading}
            />

            <div className="flex gap-4">
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