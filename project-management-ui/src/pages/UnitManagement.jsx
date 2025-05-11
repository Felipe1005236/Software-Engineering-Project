import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchWrapper } from '../utils/fetchWrapper';

export default function Unit() {
  const [form, setForm] = useState({ name: '', description: '', manager: '' });
  const [error, setError] = useState('');
  const [orgID, setOrgID] = useState(null);
  const [orgName, setOrgName] = useState('');
  const [status, setStatus] = useState({ loading: false, message: '', error: false });
  const navigate = useNavigate();

  useEffect(() => {
    // Get orgDraft from localStorage
    const orgDraft = JSON.parse(localStorage.getItem('orgDraft'));
    if (orgDraft && orgDraft.name) {
      setOrgName(orgDraft.name);
      // If orgDraft has an ID (from backend), use it; otherwise, handle after org creation
      setOrgID(orgDraft.organizationID || null);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Unit name is required.');
      return;
    }
    setError('');
    setStatus({ loading: true, message: '', error: false });
    try {
      const orgDraft = JSON.parse(localStorage.getItem('orgDraft'));
      if (!orgDraft || !orgDraft.organizationID) {
        setError('Organization ID not found. Please create an organization first.');
        setStatus({ loading: false, message: '', error: true });
        return;
      }
      const data = await fetchWrapper('/api/units', {
        method: 'POST',
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          organizationID: orgDraft.organizationID,
        }),
      });
      setStatus({ loading: false, message: 'Unit created successfully!', error: false });
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      setStatus({ loading: false, message: err.message, error: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-subtle space-y-5"
      >
        <h2 className="text-2xl font-bold text-indigo-400 mb-2">Create Unit</h2>
        {orgName && <div className="mb-2 text-zinc-400 text-sm">For Organization: <span className="text-white font-semibold">{orgName}</span></div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Unit Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full p-3 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter unit name"
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Description (optional)</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Describe your unit (optional)"
            />
          </div>
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full p-3 rounded font-medium transition bg-indigo-500 hover:bg-indigo-600"
            disabled={status.loading}
          >
            {status.loading ? 'Creating...' : 'Create Unit'}
          </button>
        </form>
        {status.message && !status.error && (
          <button
            className="w-full p-3 rounded font-medium transition bg-green-500 hover:bg-green-600 mt-2"
            onClick={() => navigate('/dashboard')}
          >
            Go to Dashboard
          </button>
        )}
      </motion.div>
    </div>
  );
}
