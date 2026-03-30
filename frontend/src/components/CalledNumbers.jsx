export default function CalledNumbers({ calledNumbers }) {
    return (
      <div className="bg-white/10 p-6 rounded-3xl">
        <h3 className="text-2xl mb-4">Called Numbers</h3>
        <div className="grid grid-cols-8 gap-3 text-center">
          {calledNumbers.map((num, i) => (
            <div key={i} className="bg-yellow-400 text-black font-bold text-2xl py-4 rounded-2xl">
              {num}
            </div>
          ))}
        </div>
        {calledNumbers.length === 0 && <p className="text-center text-gray-400 mt-8">Waiting for host to start...</p>}
      </div>
    );
  }