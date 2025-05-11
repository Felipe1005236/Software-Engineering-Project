import { useState, useEffect } from 'react';
import { fetchWrapper } from '../utils/fetchWrapper';
import { motion } from 'framer-motion';

const API_BASE_URL = 'http://localhost:3000/api';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState({ loading: false, message: '', error: false });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await fetchWrapper(`${API_BASE_URL}/user-management/me`);
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setEmail(data.email);
      } catch (err) {
        setStatus({ loading: false, message: err.message || 'Failed to fetch user data', error: true });
      }
    };
    fetchUserData();
  }, []);

  const handleAccountUpdate = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: '', error: false });
    try {
      await fetchWrapper(`${API_BASE_URL}/user-management/me`, {
        method: 'PATCH',
        body: JSON.stringify({ firstName, lastName, email }),
      });
      setStatus({ loading: false, message: 'Account updated successfully', error: false });
    } catch (err) {
      setStatus({ loading: false, message: err.message || 'Failed to update account', error: true });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setStatus({ loading: false, message: 'Passwords do not match', error: true });
      return;
    }
    setStatus({ loading: true, message: '', error: false });
    try {
      await fetchWrapper(`${API_BASE_URL}/user-management/me`, {
        method: 'PATCH',
        body: JSON.stringify({ password: newPassword }),
      });
      setStatus({ loading: false, message: 'Password updated successfully', error: false });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setStatus({ loading: false, message: err.message || 'Failed to update password', error: true });
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }
    setStatus({ loading: true, message: '', error: false });
      try {
      await fetchWrapper(`${API_BASE_URL}/user-management/me`, {
        method: 'DELETE',
      });
      localStorage.removeItem('token');
      window.location.href = '/login';
      } catch (err) {
      setStatus({ loading: false, message: err.message || 'Failed to delete account', error: true });
      }
  };

  return (
    <div className="p-6 space-y-10 text-white">
      <h1 className="text-3xl font-bold">⚙️ Settings</h1>

      <div className="flex border-b border-white/10 mb-6 gap-2">
        <button
          onClick={() => setActiveTab('account')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-all duration-300 ${
            activeTab === 'account'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-zinc-500 hover:text-white'
          }`}
        >
          Account
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-all duration-300 ${
            activeTab === 'password'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-zinc-500 hover:text-white'
          }`}
        >
          Password
        </button>
        <button
          onClick={() => setActiveTab('danger')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-all duration-300 ${
            activeTab === 'danger'
              ? 'border-red-500 text-red-400'
              : 'border-transparent text-zinc-500 hover:text-white'
          }`}
        >
          Danger Zone
        </button>
      </div>

      {activeTab === 'account' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4 bg-zinc-800/60 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-sm"
        >
          <h2 className="text-xl font-semibold">👤 Account</h2>
          <form onSubmit={handleAccountUpdate}>
            <div className="mb-4">
              <label className="block text-sm text-zinc-400 mb-1">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-zinc-700 p-2 rounded border border-zinc-600"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-zinc-400 mb-1">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-zinc-700 p-2 rounded border border-zinc-600"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-zinc-400 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-700 p-2 rounded border border-zinc-600"
                required
              />
            </div>
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded transition">
              Update Account
            </button>
          </form>
        </motion.div>
      )}

      {activeTab === 'password' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4 bg-zinc-800/60 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-sm"
        >
          <h2 className="text-xl font-semibold">🔐 Change Password</h2>
          <form onSubmit={handlePasswordChange}>
            <div className="mb-4">
              <label className="block text-sm text-zinc-400 mb-1">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-zinc-700 p-2 rounded border border-zinc-600"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-zinc-400 mb-1">New Password</label>
            <input
              type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-zinc-700 p-2 rounded border border-zinc-600"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-zinc-400 mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-zinc-700 p-2 rounded border border-zinc-600"
                required
              />
            </div>
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded transition">
              Change Password
            </button>
          </form>
        </motion.div>
      )}

      {activeTab === 'danger' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4 bg-zinc-900/60 backdrop-blur-md p-6 rounded-xl border border-red-600 shadow-md"
        >
          <h2 className="text-xl font-semibold text-red-400">🚨 Danger Zone</h2>
          <p className="text-zinc-400 text-sm">
            Deleting your account is irreversible. All your data will be lost.
          </p>
          <button
            onClick={handleDeleteAccount}
            className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded transition"
          >
            Delete My Account
          </button>
        </motion.div>
      )}

      {status.message && (
        <div className={`mt-4 p-4 rounded ${status.error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {status.message}
        </div>
      )}
    </div>
  );
};

export default Settings;
