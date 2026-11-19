import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchWrapper } from '../utils/fetchWrapper';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { useUser } from '../contexts/UserContext';

const statusColors = {
  'Pending': 'bg-yellow-500',
  'In Progress': 'bg-blue-500',
  'Completed': 'bg-green-600',
};

const TaskList = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    status: 'Pending',
    percentageComplete: 0,
    priority: 'Medium',
    details: '',
    startDate: '',
    targetDate: '',
  });
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });
  const lastTaskRef = useRef(null);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await fetchWrapper(`/api/projects/${name}/tasks`);
      setTasks(data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setTasks([]);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title || !user) return;
    setStatus({ loading: true, error: '', success: '' });

    const payload = {
      title: newTask.title,
      details: newTask.details,
      projectID: parseInt(name, 10),
      userID: user.userID,
      status: newTask.status,
      percentageComplete: newTask.percentageComplete,
      priority: newTask.priority,
      startDate: newTask.startDate,
      targetDate: newTask.targetDate,
    };

    try {
      if (editingTask) {
        // Update existing task - fixed path and method
        await fetchWrapper(`/tasks/${editingTask}`, {
          method: 'PATCH', // Changed from PUT to PATCH to match backend controller
          body: payload, // No need for JSON.stringify with fetchWrapper
        });
        
        // Update local state
        setTasks(tasks.map(task => 
          task.id === editingTask ? { ...task, ...payload } : task
        ));
        
        setStatus({ loading: false, error: '', success: 'Task updated successfully!' });
      } else {
        // Create new task - fixed path
        const saved = await fetchWrapper(`/tasks`, {
          method: 'POST',
          body: payload, // No need for JSON.stringify with fetchWrapper
        });
        const taskToAdd = saved || { ...payload, id: Date.now() };
        setTasks((prev) => [...prev, taskToAdd]);
        setTimeout(() => lastTaskRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        setStatus({ loading: false, error: '', success: 'Task added successfully!' });
      }
    } catch (err) {
      console.error(`Task ${editingTask ? 'update' : 'add'} failed:`, err);
      setStatus({ loading: false, error: err.message || `Failed to ${editingTask ? 'update' : 'add'} task`, success: '' });
    }

    // Reset form and editing state
    setNewTask({
      title: '',
      status: 'Pending',
      percentageComplete: 0,
      priority: 'Medium',
      details: '',
      startDate: '',
      targetDate: '',
    });
    setEditingTask(null);
  };

  const handleDelete = async (id) => {
    try {
      // Fixed delete path
      await fetchWrapper(`/tasks/${id}`, {
        method: 'DELETE'
      });
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const handleEditTask = (task, e) => {
    e.stopPropagation(); // Prevent navigation to task details
    setEditingTask(task.id);
    setNewTask({
      title: task.title,
      status: task.status,
      percentageComplete: task.percentageComplete,
      priority: task.priority,
      details: task.details || '',
      startDate: task.startDate || '',
      targetDate: task.targetDate || '',
    });
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

      <form
        onSubmit={handleAddTask}
        className="flex flex-col gap-3 bg-zinc-900/60 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-subtle"
      >
        <h3 className="text-lg font-semibold">{editingTask ? 'Edit Task' : 'Add New Task'}</h3>
        
        <input
          type="text"
          placeholder="Task title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          className="bg-zinc-800 border border-zinc-700 text-white rounded p-2"
        />
        <textarea
          placeholder="Task details"
          value={newTask.details}
          onChange={(e) => setNewTask({ ...newTask, details: e.target.value })}
          className="bg-zinc-800 border border-zinc-700 text-white rounded p-2"
        />
        <div className="flex flex-wrap gap-3">
          <select
            value={newTask.status}
            onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
            className="bg-zinc-800 border border-zinc-700 text-white rounded p-2"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <select
            value={newTask.priority}
            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
            className="bg-zinc-800 border border-zinc-700 text-white rounded p-2"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <input
            type="number"
            placeholder="Percentage Complete"
            value={newTask.percentageComplete}
            onChange={(e) =>
              setNewTask({ ...newTask, percentageComplete: parseInt(e.target.value) })
            }
            className="bg-zinc-800 border border-zinc-700 text-white rounded p-2 w-40"
          />
          <input
            type="date"
            placeholder="Start Date"
            value={newTask.startDate}
            onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })}
            className="bg-zinc-800 border border-zinc-700 text-white rounded p-2 w-40"
          />
          <input
            type="date"
            placeholder="Target Date"
            value={newTask.targetDate}
            onChange={(e) => setNewTask({ ...newTask, targetDate: e.target.value })}
            className="bg-zinc-800 border border-zinc-700 text-white rounded p-2 w-40"
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded text-sm font-medium transition"
            disabled={status.loading}
          >
            {status.loading ? 'Processing...' : editingTask ? 'Update Task' : '+ Add Task'}
          </button>
          
          {editingTask && (
            <button
              type="button"
              onClick={() => {
                setEditingTask(null);
                setNewTask({
                  title: '',
                  status: 'Pending',
                  percentageComplete: 0,
                  priority: 'Medium',
                  details: '',
                  startDate: '',
                  targetDate: '',
                });
              }}
              className="px-4 py-2 bg-zinc-600 hover:bg-zinc-500 rounded text-sm font-medium transition"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {status.error && <p className="text-red-400 text-sm">{status.error}</p>}
      {status.success && <p className="text-green-400 text-sm">{status.success}</p>}

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
              className="bg-zinc-900/60 border border-white/10 rounded-xl p-4 cursor-pointer group relative shadow-soft transition-all"
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            >
              <h3 className="text-lg font-semibold text-white group-hover:underline">
                {task.title}
              </h3>
              <p className="text-sm text-zinc-400 mt-1">{task.details}</p>
              <p className="text-sm text-zinc-400 mt-1">Priority: {task.priority}</p>
              <p className="text-sm text-zinc-400 mt-1">
                Complete: {task.percentageComplete}%
              </p>
              <p className="text-sm text-zinc-400 mt-1">Start Date: {task.startDate}</p>
              <p className="text-sm text-zinc-400 mt-1">Target Date: {task.targetDate}</p>
              <span
                className={`mt-2 inline-block px-2 py-0.5 text-xs rounded-full text-white ${statusColors[task.status]}`}
              >
                {task.status}
              </span>

              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  onClick={(e) => handleEditTask(task, e)}
                  className="text-yellow-500 hover:text-yellow-400 text-xs"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(task.id);
                  }}
                  className="text-red-500 hover:text-red-400 text-xs"
                >
                  <FaTrash />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default TaskList;