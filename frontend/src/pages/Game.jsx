import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import socket from '../services/socket';
import BingoCard from '../components/BingoCard';

export default function Game() {
  const { roomCode } = useParams();
  const navigate = useNavigate();

  const [players, setPlayers] = useState([]);
  const [calledNumbers, setCalledNumbers] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [myCard, setMyCard] = useState(null);
  const [myMarked, setMyMarked] = useState(new Map());
  const [winner, setWinner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false); // New state

  // Join room
  useEffect(() => {
    socket.emit('joinRoom', { 
      roomCode, 
      playerName: localStorage.getItem('playerName') || 'Player' 
    });
  }, [roomCode]);

  useEffect(() => {
    const handlePlayerJoined = (updatedPlayers) => {
      setPlayers(updatedPlayers);
      setLoading(false);

      const me = updatedPlayers.find(p => p.socketId === socket.id);
      if (me) {
        setMyCard(me.card);
        setMyMarked(new Map(Object.entries(me.marked || {})));
        setIsHost(updatedPlayers[0]?.socketId === socket.id);
      }
    };

    const handleGameStarted = (data) => {
      setGameStarted(true); // Show "Game Started" text
      setCalledNumbers(data.calledNumbers || []);
      setPlayers(data.players || []);
    };

    const handleNumberCalled = (data) => {
      setCalledNumbers(data.calledNumbers || []);
    };

    const handleBingo = ({ winner: winName }) => {
      setWinner(winName);
      alert(`🎉 ${winName} shouted BINGO! 🎉`);
    };

    const handleError = (msg) => {
      alert(msg);
      navigate('/');
    };

    socket.on('playerJoined', handlePlayerJoined);
    socket.on('gameStarted', handleGameStarted);
    socket.on('numberCalled', handleNumberCalled);
    socket.on('bingo', handleBingo);
    socket.on('error', handleError);

    return () => {
      socket.off('playerJoined', handlePlayerJoined);
      socket.off('gameStarted', handleGameStarted);
      socket.off('numberCalled', handleNumberCalled);
      socket.off('bingo', handleBingo);
      socket.off('error', handleError);
    };
  }, [navigate]);

  const markNumber = (row, col, number) => {
    if (number !== "FREE" && !calledNumbers.includes(number)) {
      alert("This number hasn't been called yet!");
      return;
    }

    const newMarked = new Map(myMarked);
    newMarked.set(`${row}-${col}`, true);
    setMyMarked(newMarked);

    socket.emit('markNumber', { roomCode, row, col, number });
  };

  const startGame = () => {
    socket.emit('startGame', { roomCode });
  };

  const callNumber = () => {
    socket.emit('callNumber', { roomCode });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-3xl text-white">Joining room...</div>;
  if (!myCard) return <div className="min-h-screen flex items-center justify-center text-3xl text-white">Loading card...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-violet-950 p-4 sm:p-6">
      
      {/* Top Nav */}
      <nav className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-2 sm:gap-0">
        <h1 className="text-3xl sm:text-4xl font-bold text-white">
          Room: <span className="text-yellow-400">{roomCode}</span>
        </h1>
        {gameStarted && (
          <div className="text-xl sm:text-2xl font-semibold text-green-400">✅ Game Started</div>
        )}
        {winner && (
          <div className="text-2xl sm:text-4xl font-bold text-green-400">🏆 {winner} WINS!</div>
        )}
      </nav>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8">

        {/* Left - Your Card */}
        <div className="lg:flex-1">
          <h2 className="text-2xl sm:text-3xl mb-4 text-white">Your Card</h2>
          <BingoCard 
            card={myCard} 
            marked={myMarked} 
            onMark={markNumber} 
          />
        </div>

        {/* Right Sidebar */}
        <div className="lg:w-[400px] flex flex-col gap-4 lg:gap-6">
          
          {/* Called Numbers */}
          <div className="bg-white/10 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-white/20">
            <h3 className="text-xl sm:text-2xl mb-2 text-white">Called Numbers</h3>
            {calledNumbers.length === 0 ? (
              <p className="text-gray-400 italic text-sm sm:text-base">Waiting for host to start the game...</p>
            ) : (
              <div className="grid grid-cols-5 sm:grid-cols-8 gap-2 sm:gap-3">
                {calledNumbers.map((num, i) => (
                  <div key={i} className="bg-yellow-400 text-black font-bold text-lg sm:text-2xl py-2 sm:py-3 rounded-2xl text-center">
                    {num}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Host Controls */}
          {isHost && (
            <div className="bg-white/10 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-white/20">
              <h3 className="text-xl sm:text-2xl mb-2 text-white">Host Controls</h3>
              <button 
                onClick={startGame}
                className="w-full bg-green-600 hover:bg-green-700 py-3 sm:py-4 rounded-2xl font-bold text-lg sm:text-xl mb-2 sm:mb-4 transition"
              >
                Start Game
              </button>
              <button 
                onClick={callNumber}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-3 sm:py-4 rounded-2xl font-bold text-lg sm:text-xl transition disabled:opacity-50"
                disabled={calledNumbers.length === 75}
              >
                Call Next Number
              </button>
            </div>
          )}

          {/* Players List */}
          <div className="bg-white/10 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-white/20">
            <h3 className="text-xl sm:text-2xl mb-2 text-white">Players ({players.length})</h3>
            <div className="space-y-2 sm:space-y-3">
              {players.map((p, i) => (
                <div key={i} className="flex justify-between bg-white/5 px-3 sm:px-5 py-2 sm:py-3 rounded-2xl text-sm sm:text-base">
                  <span>{p.name} {p.socketId === socket.id && '(You)'}</span>
                  {i === 0 && <span className="text-yellow-400">👑 Host</span>}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}