import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchWrapper } from '../utils/fetchWrapper';
import { FaArrowLeft, FaCalendarAlt, FaUser, FaFlag, FaChartLine } from 'react-icons/fa';

const STATUS_OPTIONS = [
  { value: 'PROPOSED', label: 'Proposed' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'CANCELED', label: 'Canceled' }
];

const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' }
];

const TaskDetails = () => {
  const { id, taskId } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [editedTask, setEditedTask] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [status, setStatus] = useState({ loading: true, error: '', success: '' });

  useEffect(() => {
    fetchTaskDetails();
  }, [id, taskId]);

  const fetchTaskDetails = async () => {
    setStatus({ loading: true, error: '', success: '' });
    try {
      const data = await fetchWrapper(`/api/projects/${id}/tasks/${taskId}`);
      if (data) {
        setTask(data);
        setEditedTask(data);
        setStatus({ loading: false, error: '', success: '' });
      } else {
        throw new Error('Failed to load task details');
      }
    } catch (err) {
      console.error('Failed to fetch task details:', err);
      setStatus({ loading: false, error: 'Failed to load task details', success: '' });
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setStatus({ loading: true, error: '', success: '' });
    try {
      const updated = await fetchWrapper(`/api/projects/${id}/tasks/${taskId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });
      
      if (updated) {
        setTask(updated);
        setEditedTask(updated);
        setStatus({ loading: false, error: '', success: 'Status updated successfully!' });
      } else {
        throw new Error('Failed to update status');
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      setStatus({ loading: false, error: 'Failed to update status', success: '' });
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setStatus({ loading: true, error: '', success: '' });
    
    try {
      const updated = await fetchWrapper(`/api/projects/${id}/tasks/${taskId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ comment: newComment })
      });
      
      if (updated) {
        setTask(updated);
        setEditedTask(updated);
        setNewComment('');
        setStatus({ loading: false, error: '', success: 'Comment added successfully!' });
      } else {
        throw new Error('Failed to add comment');
      }
    } catch (err) {
      console.error('Failed to add comment:', err);
      setStatus({ loading: false, error: 'Failed to add comment', success: '' });
    }
  };

  const handleSave = async () => {
    if (!editedTask) return;
    setStatus({ loading: true, error: '', success: '' });
    
    try {
      const updated = await fetchWrapper(`/api/projects/${id}/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify(editedTask)
      });
      
      if (updated) {
        setTask(updated);
        setEditedTask(updated);
        setStatus({ loading: false, error: '', success: 'Task updated successfully!' });
      } else {
        throw new Error('Failed to update task');
      }
    } catch (err) {
      console.error('Update failed:', err);
      setStatus({ loading: false, error: 'Failed to update task', success: '' });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    setStatus({ loading: true, error: '', success: '' });
    
    try {
      const response = await fetchWrapper(`/api/projects/${id}/tasks/${taskId}`, {
        method: 'DELETE'
      });
      
      if (response) {
        navigate(`/projects/${id}/tasks`);
      } else {
        throw new Error('Failed to delete task');
      }
    } catch (err) {
      console.error('Delete failed:', err);
      setStatus({ loading: false, error: 'Failed to delete task', success: '' });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (status.loading && !task) {
    return <div className="p-6 text-zinc-400">Loading task...</div>;
  }

  if (!task) {
    return <div className="p-6 text-red-400">Task not found</div>;
  }

  return (
    <div className="p-6 space-y-8 text-white">
      <div className="flex justify-between items-center">
        <motion.h1
          className="text-3xl font-bold"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          📝 Task Details
        </motion.h1>
        <button
          onClick={() => navigate(`/projects/${id}/tasks`)}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg border border-white/10"
        >
          <FaArrowLeft className="w-4 h-4" />
          Back to Tasks
        </button>
      </div>

      {status.error && <p className="text-red-400 text-sm">{status.error}</p>}
      {status.success && <p className="text-green-400 text-sm">{status.success}</p>}

      <motion.div
        className="bg-zinc-900/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-6 shadow-subtle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="space-y-4">
          <div>
            <input
              type="text"
              value={editedTask?.title || ''}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              className="text-xl font-semibold bg-zinc-800 border border-zinc-700 rounded p-2 w-full"
              placeholder="Task Title"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <FaUser className="text-zinc-400" />
              <span className="text-zinc-400">Assigned to:</span>
              <span className="text-white">{task.assignedTo || 'Unassigned'}</span>
            </div>

            <div className="flex items-center gap-2">
              <FaFlag className="text-zinc-400" />
              <span className="text-zinc-400">Priority:</span>
              <select
                value={editedTask?.priority || task.priority}
                onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
                className="bg-zinc-800 border border-zinc-600 text-sm rounded px-2 py-1"
              >
                {PRIORITY_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <FaChartLine className="text-zinc-400" />
              <span className="text-zinc-400">Progress:</span>
              <input
                type="number"
                min="0"
                max="100"
                value={editedTask?.percentageComplete || task.percentageComplete}
                onChange={(e) => setEditedTask({ ...editedTask, percentageComplete: parseInt(e.target.value) })}
                className="bg-zinc-800 border border-zinc-600 text-sm rounded px-2 py-1 w-20"
              />
              <span className="text-zinc-400">%</span>
            </div>

            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-zinc-400" />
              <span className="text-zinc-400">Status:</span>
              <select
                value={editedTask?.status || task.status}
                onChange={(e) => handleStatusUpdate(e.target.value)}
                className="bg-zinc-800 border border-zinc-600 text-sm rounded px-2 py-1"
              >
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-zinc-700">
            <div>
              <p className="text-sm text-zinc-400">Start Date</p>
              <p className="text-white">{formatDate(task.startDate)}</p>
            </div>
            <div>
              <p className="text-sm text-zinc-400">Target Date</p>
              <p className="text-white">{formatDate(task.targetDate)}</p>
            </div>
            <div>
              <p className="text-sm text-zinc-400">Completion Date</p>
              <p className="text-white">{formatDate(task.actualCompletion)}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-zinc-400">Description</label>
          <textarea
            value={editedTask?.details || ''}
            onChange={(e) => setEditedTask({ ...editedTask, details: e.target.value })}
            className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-zinc-300 whitespace-pre-line"
            rows={4}
            placeholder="Enter task description..."
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm bg-indigo-500 hover:bg-indigo-600 rounded transition"
            disabled={status.loading}
          >
            {status.loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 rounded transition"
            disabled={status.loading}
          >
            Delete Task
          </button>
        </div>

        <div className="space-y-4 pt-4 border-t border-zinc-700">
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
              disabled={status.loading}
            >
              {status.loading ? 'Adding...' : 'Add'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TaskDetails;