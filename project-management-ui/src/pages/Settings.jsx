import { useState } from 'react';
import { fetchWrapper } from '../utils/fetchWrapper';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [personalInfo, setPersonalInfo] = useState({
    name: 'Saim Malik',
    email: 'saim@example.com',
    role: 'Developer',
    team: 'Frontend',
  });
  const [passwordInfo, setPasswordInfo] = useState({ current: '', new: '', confirm: '' });
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    taskReminders: true,
  });

  const handleSavePersonal = async () => {
    try {
      await fetchWrapper('/api/user/update-profile', {
        method: 'POST',
        body: personalInfo,
      });
      alert('Profile updated successfully.');
    } catch (err) {
      console.error('Profile update failed:', err);
    }
  };

  const handleChangePassword = async () => {
    if (passwordInfo.new !== passwordInfo.confirm) {
      alert("Passwords don't match");
      return;
    }
    try {
      await fetchWrapper('/api/user/change-password', {
        method: 'POST',
        body: passwordInfo,
      });
      alert('Password updated successfully.');
    } catch (err) {
      console.error('Password change failed:', err);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm('Are you sure? This cannot be undone.')) {
      try {
        await fetchWrapper('/api/user/delete-account', { method: 'DELETE' });
        alert('Account deleted.');
      } catch (err) {
        console.error('Account deletion failed:', err);
      }
    }
  };

  const tabButton = (id, label) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-4 py-2 text-sm font-medium border-b-2 transition-all duration-300 ${
        activeTab === id
          ? 'border-indigo-500 text-indigo-400'
          : 'border-transparent text-zinc-500 hover:text-white'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="p-6 space-y-10 text-white">
      <h1 className="text-3xl font-bold">⚙️ Settings</h1>

      {/* Tabs */}
      <div className="flex border-b border-white/10 mb-6 gap-2">{[
        tabButton('account', 'Account'),
        tabButton('password', 'Password'),
        tabButton('notifications', 'Notifications'),
        tabButton('danger', 'Danger Zone')
      ]}</div>

      {/* Account Tab */}
      {activeTab === 'account' && (
        <section className="space-y-4 bg-zinc-800/60 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-sm">
          <h2 className="text-xl font-semibold">👤 Account</h2>
          {['name', 'email'].map((field) => (
            <div key={field}>
              <label className="block text-sm text-zinc-400 mb-1 capitalize">{field}</label>
              <input
                type={field === 'email' ? 'email' : 'text'}
                value={personalInfo[field]}
                onChange={(e) => setPersonalInfo({ ...personalInfo, [field]: e.target.value })}
                className="w-full bg-zinc-700 p-2 rounded border border-zinc-600"
              />
            </div>
          ))}
          {['role', 'team'].map((field) => (
            <div key={field}>
              <label className="block text-sm text-zinc-400 mb-1 capitalize">{field}</label>
              <input
                type="text"
                value={personalInfo[field]}
                readOnly
                className="w-full bg-zinc-700 p-2 rounded opacity-60 cursor-not-allowed border border-zinc-600"
              />
            </div>
          ))}
          <div className="flex justify-end">
            <button className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded transition" onClick={handleSavePersonal}>
              Save Changes
            </button>
          </div>
        </section>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <section className="space-y-4 bg-zinc-800/60 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-sm">
          <h2 className="text-xl font-semibold">🔐 Change Password</h2>
          {['current', 'new', 'confirm'].map((field, i) => (
            <input
              key={i}
              type="password"
              placeholder={`${field === 'confirm' ? 'Confirm New' : field[0].toUpperCase() + field.slice(1)} Password`}
              value={passwordInfo[field]}
              onChange={(e) => setPasswordInfo({ ...passwordInfo, [field]: e.target.value })}
              className="w-full bg-zinc-700 p-2 rounded border border-zinc-600"
            />
          ))}
          <button
            className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded transition"
            onClick={handleChangePassword}
          >
            Update Password
          </button>
        </section>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <section className="space-y-4 bg-zinc-800/60 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-sm">
          <h2 className="text-xl font-semibold">🔔 Notifications</h2>
          {[
            { key: 'emailUpdates', label: 'Email me product updates' },
            { key: 'taskReminders', label: 'Remind me of upcoming tasks' }
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-3 text-zinc-300">
              <input
                type="checkbox"
                checked={notifications[key]}
                onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
              />
              {label}
            </label>
          ))}
        </section>
      )}

      {/* Danger Zone */}
      {activeTab === 'danger' && (
        <section className="space-y-4 bg-zinc-900/60 backdrop-blur-md p-6 rounded-xl border border-red-600 shadow-md">
          <h2 className="text-xl font-semibold text-red-400">🚨 Danger Zone</h2>
          <p className="text-zinc-400 text-sm">
            Deleting your account is irreversible. All your data will be lost.
          </p>
          <button
            className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded transition"
            onClick={handleDeleteAccount}
          >
            Delete My Account
          </button>
        </section>
      )}
    </div>
  );
};

export default Settings;
