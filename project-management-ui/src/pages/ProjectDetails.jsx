import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Legend, CartesianGrid, PieChart, Pie, Cell
} from 'recharts';

import { useNavigate, useParams } from 'react-router-dom';
import { FaPlus, FaClipboardCheck, FaUsers, FaChartLine, FaCommentDots } from 'react-icons/fa';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];
const API_BASE_URL = 'http://localhost:3000/api';
const fetchOptions = {
  method: 'GET',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

const STATUS_OPTIONS = [
  'PROPOSED',
  'IN_PROGRESS',
  'COMPLETED',
  'APPROVED',
  'CANCELED'
];
const PRIORITY_OPTIONS = [
  'LOW',
  'MEDIUM',
  'HIGH'
];

const ProjectDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskStatus, setNewTaskStatus] = useState('PROPOSED');
  const [newTaskPriority, setNewTaskPriority] = useState('MEDIUM');
  const [newTaskPercentage, setNewTaskPercentage] = useState(0);
  const [newTaskStartDate, setNewTaskStartDate] = useState('');
  const [newTaskTargetDate, setNewTaskTargetDate] = useState('');

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API_BASE_URL}/projects/${id}`, fetchOptions);
        if (!response.ok) throw new Error('Failed to fetch project details');
        const data = await response.json();
        setProject(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching project data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [id]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        ...fetchOptions,
        method: 'POST',
        body: JSON.stringify({
          title: newTaskTitle,
          details: newTaskDescription,
          projectID: parseInt(id),
          userID: 1, // TODO: Get from authenticated user
          status: newTaskStatus,
          percentageComplete: Number(newTaskPercentage),
          priority: newTaskPriority,
          startDate: newTaskStartDate,
          targetDate: newTaskTargetDate
        })
      });
      if (!response.ok) throw new Error('Failed to create task');
      const newTask = await response.json();
      setProject(prev => ({
        ...prev,
        tasks: [newTask, ...prev.tasks]
      }));
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskStatus('PROPOSED');
      setNewTaskPriority('MEDIUM');
      setNewTaskPercentage(0);
      setNewTaskStartDate('');
      setNewTaskTargetDate('');
    } catch (err) {
      setError(err.message);
      console.error('Error creating task:', err);
    }
  };

  if (loading) return <div className="p-6 text-white">Loading...</div>;
  if (error) return <div className="p-6 text-white text-red-500">Error: {error}</div>;
  if (!project) return <div className="p-6 text-white">Project not found</div>;

  const completedTasks = project.tasks?.filter(t => t.status === 'COMPLETED').length || 0;
  const projectProgress = project.tasks?.length ? (completedTasks / project.tasks.length) * 100 : 0;

  return (
    <div className="p-6 space-y-10 text-white">
      <div>
        <h1 className="text-3xl font-bold mb-6">{project.title}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-800/60 backdrop-blur border border-white/10 p-4 rounded-lg shadow-subtle">
            <h2 className="text-lg font-semibold mb-4 text-zinc-300">Project Details</h2>
            <div className="space-y-2">
              <p><span className="font-medium text-zinc-400">Status:</span> <span className="text-white">{project.status}</span></p>
              <p><span className="font-medium text-zinc-400">Phase:</span> <span className="text-white">{project.phase}</span></p>
              <p><span className="font-medium text-zinc-400">Team:</span> <span className="text-white">{project.team?.name || 'Not assigned'}</span></p>
              {project.dates && (
                <>
                  <p><span className="font-medium text-zinc-400">Start Date:</span> <span className="text-white">{new Date(project.dates.startDate).toLocaleDateString()}</span></p>
                  <p><span className="font-medium text-zinc-400">Target Date:</span> <span className="text-white">{new Date(project.dates.targetDate).toLocaleDateString()}</span></p>
                  {project.dates.actualCompletion && (
                    <p><span className="font-medium text-zinc-400">Completion Date:</span> <span className="text-white">{new Date(project.dates.actualCompletion).toLocaleDateString()}</span></p>
                  )}
                </>
              )}
            </div>
          </div>
          
          {project.health && (
            <div className="bg-zinc-800/60 backdrop-blur border border-white/10 p-4 rounded-lg shadow-subtle">
              <h2 className="text-lg font-semibold mb-4 text-zinc-300">Health Status</h2>
              <div className="grid grid-cols-2 gap-4">
                <p><span className="font-medium text-zinc-400">Scope:</span> <span className={`text-${project.health.scope.toLowerCase()}-400`}>{project.health.scope}</span></p>
                <p><span className="font-medium text-zinc-400">Schedule:</span> <span className={`text-${project.health.schedule.toLowerCase()}-400`}>{project.health.schedule}</span></p>
                <p><span className="font-medium text-zinc-400">Cost:</span> <span className={`text-${project.health.cost.toLowerCase()}-400`}>{project.health.cost}</span></p>
                <p><span className="font-medium text-zinc-400">Resource:</span> <span className={`text-${project.health.resource.toLowerCase()}-400`}>{project.health.resource}</span></p>
                <p className="col-span-2"><span className="font-medium text-zinc-400">Overall:</span> <span className={`text-${project.health.overall.toLowerCase()}-400`}>{project.health.overall}</span></p>
              </div>
            </div>
          )}
        </div>
      </div>

      {project.budget && (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-white">Budget Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-zinc-800/60 backdrop-blur border border-white/10 p-4 rounded-lg shadow-subtle">
              <h3 className="text-lg font-semibold mb-4 text-zinc-300">Budget Details</h3>
              <div className="space-y-2">
                <p><span className="font-medium text-zinc-400">Total Budget:</span> <span className="text-white">${project.budget.totalBudget}</span></p>
                <p><span className="font-medium text-zinc-400">Actual Cost:</span> <span className="text-white">${project.budget.actualCost}</span></p>
                <p><span className="font-medium text-zinc-400">Forecast Cost:</span> <span className="text-white">${project.budget.forecastCost}</span></p>
              </div>
            </div>
            <div className="bg-zinc-800/60 backdrop-blur border border-white/10 p-4 rounded-lg shadow-subtle">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Total Budget', value: project.budget.totalBudget },
                      { name: 'Actual Cost', value: project.budget.actualCost },
                      { name: 'Forecast Cost', value: project.budget.forecastCost }
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                    dataKey="value"
                  >
                    {COLORS.map((color, idx) => <Cell key={idx} fill={color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                  <Legend wrapperStyle={{ color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-6 text-white">Tasks</h2>
        <form onSubmit={handleCreateTask} className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Task title"
              className="bg-zinc-800/60 border border-white/10 text-white placeholder-zinc-400 p-2 rounded focus:outline-none focus:border-blue-400"
              required
            />
            <input
              type="text"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              placeholder="Task description"
              className="bg-zinc-800/60 border border-white/10 text-white placeholder-zinc-400 p-2 rounded focus:outline-none focus:border-blue-400"
              required
            />
            <select
              value={newTaskStatus}
              onChange={e => setNewTaskStatus(e.target.value)}
              className="bg-zinc-800/60 border border-white/10 text-white p-2 rounded focus:outline-none focus:border-blue-400"
              required
            >
              {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt.replace('_', ' ')}</option>)}
            </select>
            <select
              value={newTaskPriority}
              onChange={e => setNewTaskPriority(e.target.value)}
              className="bg-zinc-800/60 border border-white/10 text-white p-2 rounded focus:outline-none focus:border-blue-400"
              required
            >
              {PRIORITY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <input
              type="number"
              value={newTaskPercentage}
              onChange={e => setNewTaskPercentage(e.target.value)}
              min={0}
              max={100}
              placeholder="% Complete"
              className="bg-zinc-800/60 border border-white/10 text-white placeholder-zinc-400 p-2 rounded focus:outline-none focus:border-blue-400"
              required
            />
            <input
              type="date"
              value={newTaskStartDate}
              onChange={e => setNewTaskStartDate(e.target.value)}
              className="bg-zinc-800/60 border border-white/10 text-white p-2 rounded focus:outline-none focus:border-blue-400"
              required
            />
            <input
              type="date"
              value={newTaskTargetDate}
              onChange={e => setNewTaskTargetDate(e.target.value)}
              className="bg-zinc-800/60 border border-white/10 text-white p-2 rounded focus:outline-none focus:border-blue-400"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded hover:bg-blue-500/30 border border-blue-500/30 transition"
          >
            Add Task
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {project.tasks?.map((task) => (
            <div key={task.taskID} className="bg-zinc-800/60 backdrop-blur border border-white/10 p-4 rounded-lg shadow-subtle">
              <h3 className="font-semibold mb-2 text-white">{task.title}</h3>
              <p className="text-zinc-400 mb-2">{task.details}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-400">Status: {task.status}</span>
                <span className="text-sm text-zinc-400">{task.percentageComplete}% complete</span>
              </div>
            </div>
          ))}
        </div>
      </div>

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
