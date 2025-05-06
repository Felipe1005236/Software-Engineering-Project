import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Legend, CartesianGrid, PieChart, Pie, Cell
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaClipboardCheck, FaCommentDots } from 'react-icons/fa';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];
const BASE_URL = 'http://localhost:3000/api';

const ProjectDetails = () => {
  const navigate = useNavigate();

  const project = {
    id: 1,
    name: 'Website Redesign',
    description: 'Revamp the company website to improve user experience and SEO.',
    manager: 'Alice Smith',
    deadline: '2025-05-30',
    createdAt: '2025-03-15',
    updatedAt: '2025-04-25',
    category: 'UI/UX & Frontend',
    priority: 'High',
    status: 'In Progress',
  };

  const budget = {
    projectID: 1,
    totalBudget: 10000,
    actualCost: 7500,
    forecastCost: 9800,
  };

  const teamMembers = ['Alice Smith', 'Bob Johnson', 'Charlie Davis', 'Dana Lee'];

  const [tasks, setTasks] = useState([
    { id: 1, name: 'Design mockups', completed: true, description: 'Create wireframes and high-fidelity mockups.' },
    { id: 2, name: 'Frontend implementation', completed: false, description: 'Implement in React and Tailwind.' },
    { id: 3, name: 'SEO optimization', completed: false, description: 'Improve search engine visibility.' },
  ]);

  const [selectedTask, setSelectedTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    assignee: ''
  });

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await fetch(`${BASE_URL}/projects/${project.id}/comments`);
      if (!res.ok) throw new Error('Failed to fetch comments');
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error('Error loading comments:', err);
    }
  };

  const handleAddTask = () => {
    const nextId = tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
    const task = {
      id: nextId,
      name: newTask.name,
      completed: false,
      description: `${newTask.description} (Assigned to: ${newTask.assignee})`
    };
    setTasks(prev => [...prev, task]);
    setNewTask({ name: '', description: '', assignee: '' });
    setShowForm(false);
  };

  const handleAddComment = async () => {
    if (newComment.trim() === '') return;
  
    // === TEMP FALLBACK UNTIL BACKEND IS READY ===
    const comment = {
      id: Date.now(),
      text: newComment,
      createdAt: new Date().toISOString(),
    };
    setComments((prev) => [comment, ...prev]);
    setNewComment('');
    
    // === UNCOMMENT BELOW WHEN BACKEND IS READY ===
    /*
    try {
      const res = await fetch(`${BASE_URL}/projects/${project.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newComment }),
      });
      if (!res.ok) throw new Error('Failed to post comment');
      const saved = await res.json();
      setComments((prev) => [saved, ...prev]);
      setNewComment('');
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
    */
  };
  

  /* edit this out when backe nd ready for delete const handleDeleteComment = async (id) => {
    try {
      await fetch(`${BASE_URL}/comments/${id}`, { method: 'DELETE' });
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };
*/

// TEMP mock delete until backend is connected
const handleDeleteComment = (id) => {
  setComments((prev) => prev.filter((c) => c.id !== id));
};

  const startEditing = (id, text) => {
    setEditingCommentId(id);
    setEditingText(text);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditingText('');
  };

  const saveEditedComment = async () => {
    if (!editingText.trim()) return;
    try {
      const res = await fetch(`${BASE_URL}/comments/${editingCommentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: editingText }),
      });
      if (!res.ok) throw new Error('Failed to update comment');
      const updated = await res.json();
      setComments((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      );
      cancelEditing();
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const completedTasks = tasks.filter(t => t.completed).length;
  const projectProgress = tasks.length ? (completedTasks / tasks.length) * 100 : 0;

  return (
    <div className="p-6 text-white">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
      <p className="text-sm text-zinc-400 mb-4">
        Status: {project.status} | Priority: {project.priority} | Category: {project.category}<br />
        Manager: {project.manager} | Created: {project.createdAt} | Updated: {project.updatedAt}<br />
        Deadline: {project.deadline}
      </p>
      <p className="mb-8 text-sm text-zinc-300">{project.description}</p>

      {/* Progress */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Progress</h2>
        <div className="w-full bg-zinc-800 rounded h-4 overflow-hidden">
          <div className="bg-green-500 h-full" style={{ width: `${projectProgress}%` }} />
        </div>
        <p className="text-sm text-zinc-400 mt-1">{projectProgress.toFixed(1)}% complete</p>
      </section>

      {/* Budget Charts */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Budget Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[budget]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="projectID" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalBudget" fill="#8884d8" />
              <Bar dataKey="actualCost" fill="#82ca9d" />
              <Bar dataKey="forecastCost" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Total Budget', value: budget.totalBudget },
                  { name: 'Actual Cost', value: budget.actualCost },
                  { name: 'Forecast Cost', value: budget.forecastCost }
                ]}
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
                dataKey="value"
              >
                {COLORS.map((color, idx) => <Cell key={idx} fill={color} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Tasks */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Tasks</h2>
          <div className="flex gap-2">
            <button
              className="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 rounded text-sm"
              onClick={() => {
                localStorage.setItem('currentProjectId', project.id);
                navigate(`/projects/${project.id}/tasks`);
              }}
            >
              View All Tasks
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-500 text-white text-sm"
              onClick={() => setShowForm(!showForm)}
            >
              <FaPlus /> Assign Task
            </button>
          </div>
        </div>

        {showForm && (
          <div className="mb-6 bg-zinc-900 p-4 rounded-lg border border-white/10 space-y-3">
            <input
              type="text"
              placeholder="Task name"
              className="w-full p-2 bg-zinc-800 rounded text-white border border-white/10"
              value={newTask.name}
              onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Description"
              className="w-full p-2 bg-zinc-800 rounded text-white border border-white/10"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
            <select
              className="w-full p-2 bg-zinc-800 rounded text-white border border-white/10"
              value={newTask.assignee}
              onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
            >
              <option value="">Assign to...</option>
              {teamMembers.map((member, idx) => (
                <option key={idx} value={member}>{member}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <button onClick={handleAddTask} className="px-4 py-2 bg-green-600 rounded text-sm">Save Task</button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-700 rounded text-sm">Cancel</button>
            </div>
          </div>
        )}

        <ul className="space-y-4">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="bg-zinc-800 p-4 rounded shadow cursor-pointer hover:bg-zinc-700"
              onClick={() => setSelectedTask(selectedTask?.id === task.id ? null : task)}
            >
              <div className="flex justify-between items-center">
                <span className={`font-medium ${task.completed ? 'line-through text-zinc-400' : ''}`}>
                  {task.name}
                </span>
                <span className={`text-xs ${task.completed ? 'text-green-400' : 'text-yellow-400'}`}>
                  {task.completed ? 'Done' : 'Pending'}
                </span>
              </div>
              {selectedTask?.id === task.id && (
                <p className="text-sm mt-2 text-zinc-300 border-t border-white/10 pt-2">{task.description}</p>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Participants */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Participants</h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {teamMembers.map((name, idx) => (
            <li key={idx} className="bg-zinc-800 p-4 rounded text-sm text-center shadow">
              {name}
            </li>
          ))}
        </ul>
      </section>

      {/* Summary */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Summary</h2>
        <div className="bg-zinc-900 p-4 rounded border border-white/10 shadow-subtle text-sm text-zinc-400 space-y-2">
          <p><FaClipboardCheck className="inline mr-2 text-green-400" />Tasks Completed: {completedTasks}/{tasks.length}</p>
          <p>Total Participants: {teamMembers.length}</p>
          <p>Budget Remaining: ${(budget.totalBudget - budget.actualCost).toFixed(2)}</p>
          <p>Forecast Overrun: ${Math.max(0, budget.forecastCost - budget.totalBudget).toFixed(2)}</p>
        </div>
      </section>

      {/* Team Journal */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Team Journal</h2>
        <div className="bg-zinc-900 p-4 rounded border border-white/10 shadow-subtle space-y-4">
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Write a journal entry..."
              className="flex-grow px-4 py-2 bg-zinc-800 text-white rounded border border-white/10 focus:outline-none focus:ring focus:ring-indigo-500/40"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
            />
            <button
              onClick={handleAddComment}
              className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-500 text-white text-sm shadow"
            >
              Post
            </button>
          </div>

          <ul className="space-y-3">
            {comments.length === 0 && (
              <p className="text-zinc-500 text-sm italic">No entries yet. Be the first to write one!</p>
            )}
            {comments.map((c) => (
              <li key={c.id} className="text-sm text-zinc-300 border-t border-white/10 pt-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <FaCommentDots className="inline mr-2 text-indigo-400" />
                    {editingCommentId === c.id ? (
                      <input
                        className="w-full mt-1 p-2 bg-zinc-800 border border-white/10 rounded text-white"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && saveEditedComment()}
                      />
                    ) : (
                      <span className="font-medium">{c.text}</span>
                    )}
                    <span className="block text-xs text-zinc-500 mt-1">{new Date(c.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="flex gap-2 ml-4 mt-1">
                    {editingCommentId === c.id ? (
                      <>
                        <button onClick={saveEditedComment} className="text-xs text-green-400 hover:underline">Save</button>
                        <button onClick={cancelEditing} className="text-xs text-zinc-400 hover:underline">Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEditing(c.id, c.text)} className="text-xs text-zinc-400 hover:underline">Edit</button>
                        <button onClick={() => handleDeleteComment(c.id)} className="text-xs text-red-400 hover:underline">Delete</button>
                      </>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetails;
