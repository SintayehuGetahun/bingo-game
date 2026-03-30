export default function PlayerList({ players }) {
    return (
      <div className="bg-white/10 backdrop-blur p-6 rounded-3xl">
        <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          Players Online 
          <span className="text-sm bg-green-500 px-3 py-1 rounded-full text-white text-xs">
            {players.length}
          </span>
        </h3>
  
        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
          {players.map((player, index) => (
            <div 
              key={player.socketId || index}
              className="flex items-center justify-between bg-white/5 hover:bg-white/10 px-5 py-4 rounded-2xl transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 bg-gradient-to-br from-yellow-400 to-orange-500 text-black font-bold rounded-full flex items-center justify-center text-lg">
                  {player.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-lg">{player.name}</p>
                  {player.socketId === players[0]?.socketId && (
                    <p className="text-yellow-400 text-sm">Host</p>
                  )}
                </div>
              </div>
  
              <div className="text-right">
                {player.socketId === socket.id && (
                  <span className="text-xs bg-blue-500 px-3 py-1 rounded-full">You</span>
                )}
              </div>
            </div>
          ))}
        </div>
  
        {players.length === 0 && (
          <p className="text-center text-gray-400 py-10">No players yet...</p>
        )}
      </div>
    );
  }