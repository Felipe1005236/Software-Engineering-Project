import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWrapper } from '../utils/fetchWrapper';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [status, setStatus] = useState({ loading: false, message: '', error: false });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: '', error: false });

    try {
      const data = await fetchWrapper('/api/auth/signup', {
        method: 'POST',
        body: formData,
      });

      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setStatus({ loading: false, message: err.message, error: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-subtle space-y-5"
      >
        <h2 className="text-2xl font-bold text-indigo-400">📝 Create Your Account</h2>

        <input
          className="w-full p-3 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          className="w-full p-3 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          className="w-full p-3 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button
          className={`w-full p-3 rounded font-medium transition ${
            status.loading
              ? 'bg-indigo-700'
              : 'bg-indigo-500 hover:bg-indigo-600'
          }`}
          disabled={status.loading}
        >
          {status.loading ? 'Creating...' : 'Create Account'}
        </button>

        {status.message && (
          <div className={`text-sm ${status.error ? 'text-red-400' : 'text-green-400'}`}>
            {status.message}
          </div>
        )}
      </form>
    </div>
  );
};

export default Signup;
