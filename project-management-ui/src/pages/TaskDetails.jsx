import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchWrapper } from '../utils/fetchWrapper';

const TaskDetails = () => {
  const { id, name } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTask();
  }, []);

  const fetchTask = async () => {
    try {
      const data = await fetchWrapper(`/api/projects/${name}/tasks/${id}`);
      setTask(data);
      setStatus(data.status);
    } catch (err) {
      console.error('Failed to load task details. Using fallback.');
      setTask({
        title: 'Fix Login Bug',
        assignedTo: 'Kavya Shah',
        status: 'In Progress',
        percentageComplete: 60,
        priority: 'High',
        dueDate: '2025-04-05',
        details: 'Users are unable to log in with expired sessions. We need to handle token refresh or force re-login smoothly.',
        taskDates: {
          startDate: '2025-04-01',
          targetDate: '2025-04-10',
          actualCompletion: '2025-04-12'
        },
        comments: [
          { user: 'Alice', text: 'I think this might be an auth header issue.' },
          { user: 'Javier', text: 'Need to check the backend refresh logic.' },
        ],
      });
      setStatus('In Progress');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setStatus(newStatus);
    try {
      await fetchWrapper(`/api/projects/${name}/tasks/${id}/status`, 'PUT', { status: newStatus });
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    const updated = {
      ...task,
      comments: [...task.comments, { user: 'You', text: newComment }],
    };
    setTask(updated);
    setNewComment('');

    try {
      await fetchWrapper(`/api/projects/${name}/tasks/${id}/comments`, 'POST', {
        comment: newComment,
      });
    } catch (err) {
      console.error('Failed to post comment:', err);
    }
  };

  if (loading || !task) {
    return <div className="p-6 text-zinc-400">Loading task...</div>;
  }

  return (
    <div className="p-6 space-y-8 text-white">
      <motion.h1
        className="text-3xl font-bold"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        📝 Task Details
      </motion.h1>

      <motion.div
        className="bg-zinc-900/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-6 shadow-subtle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">{task.title}</h2>
          <p className="text-zinc-400 text-sm">Assigned to: {task.assignedTo}</p>
          <p className="text-zinc-400 text-sm">Due: {task.dueDate}</p>
          <p className="text-sm">Priority: {task.priority}</p>
          <p className="text-sm">Progress: {task.percentageComplete}%</p>
          <div className="flex items-center gap-2">
            <label className="text-sm text-zinc-400">Status:</label>
            <select
              value={status}
              onChange={(e) => handleStatusUpdate(e.target.value)}
              className="bg-zinc-800 border border-zinc-600 text-sm rounded px-2 py-1"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* TaskDates from schema */}
          <div className="space-y-1 text-sm text-zinc-300 pt-4">
            <p><strong>Start Date:</strong> {task.taskDates?.startDate || '—'}</p>
            <p><strong>Target Date:</strong> {task.taskDates?.targetDate || '—'}</p>
            <p><strong>Actual Completion:</strong> {task.taskDates?.actualCompletion || '—'}</p>
          </div>
        </div>

        <p className="text-zinc-300 whitespace-pre-line">{task.details}</p>

        <div className="flex justify-end">
          <button
            onClick={() => navigate(`/projects/${name}/tasks`)}
            className="px-4 py-2 text-sm bg-zinc-700 hover:bg-zinc-600 rounded transition"
          >
            ← Back to Tasks
          </button>
        </div>

        {/* Comments Section */}
        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-semibold">💬 Comments</h3>
          <ul className="space-y-2">
            {task.comments?.map((c, i) => (
              <li key={i} className="bg-zinc-800 p-3 rounded-lg text-sm border border-zinc-700">
                <span className="text-indigo-400 font-medium">{c.user}</span>: {c.text}
              </li>
            ))}
          </ul>

          <div className="flex gap-2 pt-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 p-2 rounded bg-zinc-800 border border-zinc-700 text-sm"
            />
            <button
              onClick={handleAddComment}
              className="px-4 py-1.5 bg-indigo-500 hover:bg-indigo-600 rounded text-sm"
            >
              Add
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TaskDetails;