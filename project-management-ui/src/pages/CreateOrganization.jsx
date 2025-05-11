import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function CreateOrganization() {
  const [form, setForm] = useState({ name: '', description: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setError('Organization name is required.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Server error: ${errText}`);
      }

      const data = await response.json();
      const orgID = data?.organizationID;

      if (!orgID) {
        throw new Error('Invalid response: organization ID not found.');
      }

      localStorage.setItem('orgDraft', JSON.stringify({
        ...form,
        organizationID: orgID
      }));

      navigate('/units');

    } catch (err) {
      console.error('Create org error:', err);
      setError(err.message || 'An error occurred while creating the organization.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-subtle space-y-5"
      >
        <h2 className="text-2xl font-bold text-indigo-400 mb-2">Create Organization</h2>
        <form onSubmit={handleNext} className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Organization Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full p-3 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter organization name"
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
              placeholder="Describe your organization (optional)"
            />
          </div>
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full p-3 rounded font-medium transition bg-indigo-500 hover:bg-indigo-600"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Next Step'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}