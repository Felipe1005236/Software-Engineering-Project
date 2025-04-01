import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const priorities = ['High', 'Medium', 'Low'];
const statuses = ['Planning', 'In Progress', 'Completed'];

const ProjectModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    priority: 'Medium',
    members: '',
    status: 'Planning',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        members: initialData.members.join(', '),
      });
    } else {
      setFormData({
        name: '',
        priority: 'Medium',
        members: '',
        status: 'Planning',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanedData = {
      ...formData,
      members: formData.members.split(',').map((m) => m.trim()),
    };
    onSave(cleanedData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="bg-zinc-900/80 backdrop-blur-md border border-white/10 shadow-subtle rounded-2xl p-6 w-full max-w-lg space-y-6 text-white"
          >
            <h2 className="text-2xl font-bold tracking-tight">
              {initialData ? '✏️ Edit Project' : '➕ New Project'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="text"
                name="name"
                placeholder="Project Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-3 bg-zinc-800 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <div className="flex gap-4">
                <div className="w-1/2 space-y-1">
                  <label className="text-sm text-zinc-400">Priority</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full p-3 bg-zinc-800 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {priorities.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-1/2 space-y-1">
                  <label className="text-sm text-zinc-400">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full p-3 bg-zinc-800 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <input
                type="text"
                name="members"
                placeholder="Team members (comma-separated)"
                value={formData.members}
                onChange={handleChange}
                className="w-full p-3 bg-zinc-800 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm bg-zinc-700 hover:bg-zinc-600 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-indigo-500 hover:bg-indigo-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  Save
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;
