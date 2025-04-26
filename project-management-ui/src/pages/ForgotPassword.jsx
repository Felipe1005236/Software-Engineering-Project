import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ loading: false, message: '', error: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: '', error: false });

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ loading: false, message: data.message || 'Reset link sent!', error: false });
      } else {
        throw new Error(data.message || 'Something went wrong.');
      }
    } catch (err) {
      setStatus({ loading: false, message: err.message, error: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white px-4">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900/60 backdrop-blur border border-white/10 shadow-soft p-8 rounded-xl w-full max-w-md space-y-6"
      >
        <div>
          <h2 className="text-2xl font-bold">🔐 Forgot Password</h2>
          <p className="text-sm text-zinc-400 pt-1">We'll send a reset link to your email.</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm text-zinc-400">
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={status.loading}
          className={`w-full p-2 rounded font-medium transition ${
            status.loading
              ? 'bg-indigo-700 cursor-not-allowed'
              : 'bg-indigo-500 hover:bg-indigo-600'
          }`}
        >
          {status.loading ? 'Sending...' : 'Send Reset Link'}
        </button>

        {status.message && (
          <p className={`text-sm ${status.error ? 'text-red-400' : 'text-green-400'}`}>
            {status.message}
          </p>
        )}

        <p className="text-sm text-zinc-400 text-center pt-3">
          Remembered your password?{' '}
          <Link to="/login" className="text-indigo-400 hover:underline">
            Back to Login
          </Link>
        </p>
      </motion.form>
    </div>
  );
};

export default ForgotPassword;
