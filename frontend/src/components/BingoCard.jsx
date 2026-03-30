export default function BingoCard({ card, marked, onMark, isMyCard = true }) {
    const letters = ['B', 'I', 'N', 'G', 'O'];
  
    return (
      <div className="bg-white/10 p-6 rounded-3xl shadow-2xl">
        <div className="grid grid-cols-5 gap-2 text-center">
          {letters.map((letter, i) => (
            <div key={i} className="font-bold text-2xl text-yellow-400 py-2">
              {letter}
            </div>
          ))}
  
          {card.flat().map((num, index) => {
            const row = Math.floor(index / 5);
            const col = index % 5;
            const key = `${row}-${col}`;
            const isMarked = num === "FREE" || marked?.get?.(key) || marked?.[key];
  
            return (
              <div
                key={index}
                onClick={() => isMyCard && num !== "FREE" && onMark(row, col, num)}
                className={`aspect-square flex items-center justify-center text-3xl font-bold rounded-2xl border-2 transition-all cursor-pointer
                  ${isMarked 
                    ? 'bg-yellow-400 text-black border-yellow-500 scale-105' 
                    : 'bg-white/10 border-white/30 hover:bg-white/20'}`}
              >
                {num}
              </div>
            );
          })}
        </div>
      </div>
    );
  }