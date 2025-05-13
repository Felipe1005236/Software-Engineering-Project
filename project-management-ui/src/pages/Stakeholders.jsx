import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchWrapper } from '../utils/fetchWrapper';
import { FaUserCircle } from 'react-icons/fa';

const Stakeholders = () => {
  const [stakeholders, setStakeholders] = useState([]);
  const [form, setForm] = useState({ name: '', role: '', team: '' });
  const [filterTeam, setFilterTeam] = useState('All');
  const [editingIndex, setEditingIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadStakeholders();
  }, []);

  const loadStakeholders = async () => {
    try {
      // const data = await fetchWrapper('/api/stakeholders');
      const data = [
        { name: 'Alice Zhang', role: 'Product Manager', team: 'Frontend' },
        { name: 'Javier Ramos', role: 'Tech Lead', team: 'Backend' },
        { name: 'Kavya Shah', role: 'UX Designer', team: 'Design' },
      ];
      setStakeholders(data);
    } catch (err) {
      console.error('Load error:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.role || !form.team) return;

    const updatedList = [...stakeholders];
    if (editingIndex !== null) {
      updatedList[editingIndex] = form;
      setEditingIndex(null);
    } else {
      updatedList.push(form);
      try {
        await fetchWrapper('/stakeholders', {
          method: 'POST',
          body: form,
        });
      } catch (err) {
        console.error('Add failed:', err);
      }
    }

    setStakeholders(updatedList);
    setForm({ name: '', role: '', team: '' });
    setShowForm(false);
  };

  const handleDelete = async (i) => {
    const deleted = stakeholders[i];
    const updated = stakeholders.filter((_, idx) => idx !== i);
    setStakeholders(updated);
    try {
      await fetchWrapper('/stakeholders', {
        method: 'DELETE',
        body: deleted,
      });
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleEdit = (i) => {
    setForm(stakeholders[i]);
    setEditingIndex(i);
    setShowForm(true);
  };

  const filteredList =
    filterTeam === 'All'
      ? stakeholders
      : stakeholders.filter((s) => s.team === filterTeam);

  const teams = ['All', ...new Set(stakeholders.map((s) => s.team))];

  return (
    <div className="p-6 space-y-8 text-white">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">🎯 Stakeholders</h1>
        <button
          onClick={() => {
            setForm({ name: '', role: '', team: '' });
            setEditingIndex(null);
            setShowForm(!showForm);
          }}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-sm rounded shadow transition"
        >
          {showForm ? 'Cancel' : '+ Add Stakeholder'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-zinc-900/60 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-subtle"
        >
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="bg-zinc-800 p-3 rounded border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            placeholder="Role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="bg-zinc-800 p-3 rounded border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            placeholder="Team"
            value={form.team}
            onChange={(e) => setForm({ ...form, team: e.target.value })}
            className="bg-zinc-800 p-3 rounded border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="sm:col-span-4 bg-green-600 hover:bg-green-500 px-4 py-2 rounded text-sm font-medium"
          >
            {editingIndex !== null ? 'Update' : 'Add'}
          </button>
        </motion.form>
      )}

      {/* Filter Buttons */}
      <div className="flex gap-2 text-sm">
        {teams.map((t) => (
          <button
            key={t}
            onClick={() => setFilterTeam(t)}
            className={`px-3 py-1 rounded-full border text-sm transition ${
              filterTeam === t
                ? 'bg-indigo-600 text-white border-indigo-500'
                : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Stakeholders Grid */}
      <motion.ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredList.map((p, i) => (
          <motion.li
            key={i}
            className="bg-zinc-900/60 backdrop-blur-md p-5 rounded-xl border border-white/10 shadow-subtle hover:shadow-lg transition"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <FaUserCircle className="text-3xl text-indigo-400" />
              <div>
                <p className="font-semibold">{p.name}</p>
                <p className="text-sm text-zinc-400">{p.role} — <span className="text-indigo-300">{p.team}</span></p>
              </div>
            </div>
            <div className="flex gap-3 text-xs mt-2">
              <button
                onClick={() => handleEdit(i)}
                className="text-indigo-400 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(i)}
                className="text-red-400 hover:underline"
              >
                Delete
              </button>
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
};

export default Stakeholders;
