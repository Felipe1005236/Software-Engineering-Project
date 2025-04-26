import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchWrapper } from '../utils/fetchWrapper';
import { FaTrash } from 'react-icons/fa';

const statusColors = {
  'Pending': 'bg-yellow-500',
  'In Progress': 'bg-blue-500',
  'Completed': 'bg-green-600',
};

const TaskList = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', status: 'Pending' });
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });
  const lastTaskRef = useRef(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await fetchWrapper(`/api/projects/${name}/tasks`);
      setTasks(data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setTasks([
        { id: 1, title: 'Fix UI bugs', status: 'In Progress' },
        { id: 2, title: 'Update documentation', status: 'Pending' },
      ]);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title) return;
    setStatus({ loading: true, error: '', success: '' });

    try {
      const saved = await fetchWrapper(`/api/projects/${name}/tasks`, 'POST', newTask);
      const taskToAdd = saved || { ...newTask, id: Date.now() };
      setTasks((prev) => [...prev, taskToAdd]);
      setTimeout(() => lastTaskRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      setStatus({ loading: false, error: '', success: 'Task added successfully!' });
    } catch (err) {
      console.error('Add task failed:', err);
      const fallback = { ...newTask, id: Date.now() };
      setTasks((prev) => [...prev, fallback]);
      setStatus({ loading: false, error: '', success: 'Task added locally (no backend).' });
    }

    setNewTask({ title: '', status: 'Pending' });
  };

  const handleDelete = async (id) => {
    try {
      await fetchWrapper(`/api/projects/${name}/tasks/${id}`, 'DELETE');
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
      setTasks((prev) => prev.filter((t) => t.id !== id)); // fallback
    }
  };

  return (
    <div className="p-6 space-y-8 text-white">
      <motion.h1
        className="text-3xl font-bold"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🧩 Tasks for: {decodeURIComponent(name)}
      </motion.h1>

      {/* Task Form */}
      <form
        onSubmit={handleAddTask}
        className="flex flex-col sm:flex-row items-center gap-3 bg-zinc-900/60 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-subtle"
      >
        <input
          type="text"
          placeholder="Task title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          className="bg-zinc-800 border border-zinc-700 text-white rounded p-2 w-full sm:w-1/2"
        />
        <select
          value={newTask.status}
          onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
          className="bg-zinc-800 border border-zinc-700 text-white rounded p-2 w-full sm:w-1/4"
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded text-sm font-medium transition"
          disabled={status.loading}
        >
          {status.loading ? 'Adding...' : '+ Add Task'}
        </button>
      </form>

      {status.error && <p className="text-red-400 text-sm">{status.error}</p>}
      {status.success && <p className="text-green-400 text-sm">{status.success}</p>}

      {/* Task Grid */}
      {tasks.length === 0 ? (
        <p className="text-zinc-500 italic">No tasks yet. Start by adding one! 🚀</p>
      ) : (
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
        >
          {tasks.map((task, i) => (
            <motion.div
              key={task.id}
              ref={i === tasks.length - 1 ? lastTaskRef : null}
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate(`/projects/${name}/tasks/${task.id}`)}
              className="bg-zinc-900/60 backdrop-blur border border-white/10 rounded-xl p-4 cursor-pointer group relative shadow-soft transition-all"
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            >
              <h3 className="text-lg font-semibold text-white group-hover:underline">
                {task.title}
              </h3>
              <span
                className={`mt-2 inline-block px-2 py-0.5 text-xs rounded-full text-white ${statusColors[task.status]}`}
              >
                {task.status}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(task.id);
                }}
                className="absolute top-3 right-3 text-red-500 hover:text-red-400 text-xs"
              >
                <FaTrash />
              </button>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default TaskList;
