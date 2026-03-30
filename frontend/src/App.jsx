import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Navbar and Footer
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Lobby from './pages/Lobby';
import Game from './pages/Game';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-violet-950 flex flex-col text-white">
        
        {/* Navbar - Shown on all pages */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lobby" element={<Lobby />} />
            <Route path="/game/:roomCode" element={<Game />} />
          </Routes>
        </main>

        {/* Footer - Shown on all pages */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;