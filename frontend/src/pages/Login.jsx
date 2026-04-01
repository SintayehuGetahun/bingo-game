import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { login } = useAuth();   // ← Using AuthContext

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        // Use AuthContext login function
        login(data.user, data.token);
        
        alert('Login successful! 🎉');
        navigate('/');           // Redirect to Home
      } else {
        setError(data.msg || 'Login failed');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 to-purple-950 p-4">
      <div className="bg-white/10 backdrop-blur-xl p-8 sm:p-10 rounded-3xl w-full max-w-md">
        <h2 className="text-4xl font-bold text-center text-white mb-2">Welcome Back</h2>
        <p className="text-white/60 text-center mb-8">Sign in to continue playing Bingo</p>

        {error && <p className="text-red-400 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input 
            type="email" 
            name="email" 
            placeholder="Email Address" 
            required 
            onChange={handleChange}
            className="w-full px-6 py-4 bg-white/20 border border-white/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
          />
          
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            required 
            onChange={handleChange}
            className="w-full px-6 py-4 bg-white/20 border border-white/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
          />

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-600 text-black font-bold rounded-2xl text-lg transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-white/70 mt-6">
          Don't have an account? 
          <a href="/register" className="text-yellow-400 hover:underline ml-1">Register</a>
        </p>
      </div>
    </div>
  );
}