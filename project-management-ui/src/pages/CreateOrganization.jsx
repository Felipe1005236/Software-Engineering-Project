import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchWrapper } from '../utils/fetchWrapper';

export default function CreateOrganization() {
  const [form, setForm] = useState({
    organization: {
      name: '',
      description: ''
    },
    unit: {
      name: '',
      description: ''
    }
  });
  const [createUnit, setCreateUnit] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const [section, field] = name.split('.');
    setForm(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.organization.name.trim()) {
      setError('Organization name is required.');
      return;
    }

    if (createUnit && !form.unit.name.trim()) {
      setError('Unit name is required when creating a unit.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Get user data from localStorage
      const userData = JSON.parse(localStorage.getItem('signupData') || '{}');
      
      // Create organization with user and optional unit data
      const response = await fetchWrapper('/organizations', {
        method: 'POST',
        body: JSON.stringify({
          organization: form.organization,
          unit: createUnit ? form.unit : undefined,
          user: userData
        })
      });

      if (!response?.organization?.organizationID) {
        throw new Error('Invalid response: organization data not found.');
      }

      // Clear signup data from localStorage
      localStorage.removeItem('signupData');

      // Store the token if it's in the response
      if (response.user) {
        navigate('/login', { 
          state: { 
            message: 'Organization created successfully! Please log in with your credentials.',
            email: response.user.email
          } 
        });
      } else {
        navigate('/login');
      }

    } catch (err) {
      console.error('Create org error:', err);
      setError(err.message || 'An error occurred while creating the organization.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6">Create Organization</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Organization Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-indigo-400">Organization Details</h2>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Organization Name</label>
              <input
                type="text"
                name="organization.name"
                value={form.organization.name}
                onChange={handleChange}
                className="w-full p-3 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter organization name"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Organization Description (Optional)</label>
              <textarea
                name="organization.description"
                value={form.organization.description}
                onChange={handleChange}
                className="w-full p-3 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter organization description"
                rows="2"
              />
            </div>
          </div>

          {/* Unit Creation Toggle */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="createUnit"
              checked={createUnit}
              onChange={(e) => setCreateUnit(e.target.checked)}
              className="w-4 h-4 text-indigo-600 bg-zinc-800 border-zinc-700 rounded focus:ring-indigo-500 focus:ring-offset-zinc-900"
            />
            <label htmlFor="createUnit" className="text-sm text-zinc-400">
              Create a unit now (You can also create units later)
            </label>
          </div>

          {/* Unit Section */}
          {createUnit && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-indigo-400">Unit Details</h2>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Unit Name</label>
                <input
                  type="text"
                  name="unit.name"
                  value={form.unit.name}
                  onChange={handleChange}
                  className="w-full p-3 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter unit name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Unit Description (Optional)</label>
                <textarea
                  name="unit.description"
                  value={form.unit.description}
                  onChange={handleChange}
                  className="w-full p-3 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter unit description"
                  rows="2"
                />
              </div>
            </div>
          )}

          {error && (
            <div className="text-red-400 text-sm">{error}</div>
          )}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-900 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Creating...' : 'Create Organization'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}