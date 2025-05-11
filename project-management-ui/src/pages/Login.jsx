import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchWrapper } from '../utils/fetchWrapper';
import { motion } from 'framer-motion';

const API_BASE_URL = 'http://localhost:3000/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState({ loading: false, message: '', error: false });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: '', error: false });

    try {
      const data = await fetchWrapper(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (!data.access_token) {
        throw new Error('Invalid response from server');
      }

      localStorage.setItem('token', data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setStatus({
        loading: false,
        message: err.message || 'Login failed',
        error: true,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 text-white">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-zinc-900/60 backdrop-blur-md border border-white/10 p-8 rounded-xl shadow-soft space-y-6"
      >
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">🔐 Login</h2>
          <p className="text-sm text-zinc-400">Sign in to continue managing your projects.</p>
        </div>

        <div className="space-y-2">
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
          />
        </div>

        <button
          type="submit"
          disabled={status.loading}
          className={`w-full p-2 rounded font-medium transition ${
            status.loading ? 'bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'
          }`}
        >
          {status.loading ? 'Logging in...' : 'Sign In'}
        </button>

        {status.message && (
          <p className={`text-sm ${status.error ? 'text-red-400' : 'text-green-400'}`}>
            {status.message}
          </p>
        )}

        <div className="flex justify-between text-sm text-zinc-400 pt-2">
          <Link to="/forgot" className="hover:underline text-indigo-400">
            Forgot password?
          </Link>
          <Link to="/signup" className="hover:underline text-indigo-400">
            Sign up
          </Link>
        </div>
      </motion.form>
    </div>
  );
};

export default Login;
