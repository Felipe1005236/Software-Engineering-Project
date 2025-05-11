import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState({ loading: false, message: '', error: false });
  const [showJoinFields, setShowJoinFields] = useState(false);
  const [orgName, setOrgName] = useState('');
  const [orgUnit, setOrgUnit] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: '', error: false });
    // You can add your sign up logic here
    setTimeout(() => {
      setStatus({ loading: false, message: 'Signed in (demo)', error: false });
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-subtle space-y-8 flex flex-col items-center"
      >
        <h2 className="text-2xl font-bold text-indigo-400 mb-2">Sign In</h2>
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              className="w-full p-3 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              required
            />
            <input
              className="w-full p-3 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              required
            />
          </div>
          <input
            className="w-full p-3 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full p-3 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <input
            className="w-full p-3 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            type="text"
            placeholder="Address"
            value={address}
            onChange={e => setAddress(e.target.value)}
          />
          <input
            className="w-full p-3 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            type="tel"
            placeholder="Phone"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
          <button
            type="submit"
            className={`w-full p-3 rounded font-medium transition ${status.loading ? 'bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'}`}
            disabled={status.loading}
          >
            {status.loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        {status.message && (
          <div className={`text-sm ${status.error ? 'text-red-400' : 'text-green-400'}`}>{status.message}</div>
        )}
        <div className="w-full flex flex-col gap-4 mt-6">
          <button
            onClick={() => setShowJoinFields(f => !f)}
            className="w-full p-4 rounded font-bold text-lg bg-indigo-500 hover:bg-indigo-600 transition"
          >
            Join Organization
          </button>
          {showJoinFields && (
            <div className="w-full flex flex-col gap-3 mt-2">
              <input
                className="w-full p-3 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="text"
                placeholder="Organization Name"
                value={orgName}
                onChange={e => setOrgName(e.target.value)}
              />
              <input
                className="w-full p-3 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="text"
                placeholder="Organization Unit"
                value={orgUnit}
                onChange={e => setOrgUnit(e.target.value)}
              />
            </div>
          )}
          <button
            onClick={() => navigate('/create-org')}
            className="w-full p-4 rounded font-bold text-lg bg-zinc-700 hover:bg-zinc-600 transition"
          >
            Create Organization
          </button>
        </div>
        <div className="text-center text-sm text-zinc-400 mt-4">
          Already have an account? <Link to="/login" className="text-indigo-400 hover:text-indigo-300">Login here</Link>
        </div>
      </motion.div>
    </div>
  );
}
