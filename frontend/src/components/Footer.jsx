export default function Footer() {
    return (
      <footer className="bg-black/60 border-t border-white/10 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            
            {/* Left - About */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-yellow-400 rounded-xl flex items-center justify-center text-2xl">🎲</div>
                <h2 className="text-2xl font-bold text-white">BINGO</h2>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                Real-time multiplayer bingo game built with MERN Stack and Socket.io. 
                Perfect for family, friends, and parties.
              </p>
            </div>
  
            {/* Middle - Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
              <div className="space-y-3 text-white/70">
                <a href="/" className="block hover:text-yellow-400 transition">Create New Room</a>
                <a href="/" className="block hover:text-yellow-400 transition">Join Existing Room</a>
                <a href="/" className="block hover:text-yellow-400 transition">How to Play</a>
              </div>
            </div>
  
            {/* Right - Info */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Made with ❤️Sintayehu Getahun</h3>
              <p className="text-white/60 text-sm">
                Using:<br />
                •Mern Stack • Socket.io • Tailwind CSS
              </p>
              
              <div className="mt-6 text-xs text-white/50">
                made in Ethiopia • March 2026
              </div>
            </div>
          </div>
  
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-white/50 text-sm">
            © 2026 Bingo Game. Built for fun. All rights reserved.
          </div>
        </div>
      </footer>
    );
  }