import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Legend, CartesianGrid, PieChart, Pie, Cell
} from 'recharts';
import { useNavigate, useParams } from 'react-router-dom';
import { FaPlus, FaClipboardCheck } from 'react-icons/fa';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];
const API_BASE_URL = 'http://localhost:3000/api';

const ProjectDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [budget, setBudget] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    assignee: ''
  });

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const fetchOptions = {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        };

        console.log('Fetching project data from:', `${API_BASE_URL}/projects/${id}`);
        const response = await fetch(`${API_BASE_URL}/projects/${id}`, fetchOptions);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Project data received:', data);
        setProject(data);

        // Fetch budget data if budgetId exists
        if (data.budgetId) {
          console.log('Fetching budget data for:', data.budgetId);
          const budgetResponse = await fetch(`${API_BASE_URL}/budget/${data.budgetId}`, fetchOptions);
          if (budgetResponse.ok) {
            const budgetData = await budgetResponse.json();
            console.log('Budget data received:', budgetData);
            setBudget(budgetData);
          }
        }

        // Fetch tasks
        console.log('Fetching tasks for project:', id);
        const tasksResponse = await fetch(`${API_BASE_URL}/tasks?projectId=${id}`, fetchOptions);
        if (tasksResponse.ok) {
          const tasksData = await tasksResponse.json();
          console.log('Tasks data received:', tasksData);
          setTasks(tasksData);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching project data:', err);
        setError(`Failed to load project data: ${err.message}. Please ensure the backend server is running at ${API_BASE_URL}`);
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [id]);

  const handleAddTask = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: newTask.name,
          description: newTask.description,
          assignee: newTask.assignee,
          projectId: id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const newTaskData = await response.json();
      setTasks(prev => [...prev, newTaskData]);
      setNewTask({ name: '', description: '', assignee: '' });
      setShowForm(false);
    } catch (err) {
      console.error('Error creating task:', err);
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-white">
        <div className="animate-pulse">
          <div className="h-8 bg-zinc-700 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-zinc-700 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            <div className="h-32 bg-zinc-700 rounded"></div>
            <div className="h-32 bg-zinc-700 rounded"></div>
            <div className="h-32 bg-zinc-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-white">
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-400">Error loading project: {error}</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-6 text-white">
        <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4">
          <p className="text-yellow-400">Project not found</p>
        </div>
      </div>
    );
  }

  const completedTasks = tasks.filter(t => t.completed).length;
  const projectProgress = tasks.length ? (completedTasks / tasks.length) * 100 : 0;

  return (
    <div className="p-6 text-white">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
      <p className="text-sm text-zinc-400 mb-4">
        Status: {project.status} | Phase: {project.phase}<br />
        Team ID: {project.teamID}
      </p>

      {/* Progress */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Progress</h2>
        <div className="w-full bg-zinc-800 rounded h-4 overflow-hidden">
          <div className="bg-green-500 h-full" style={{ width: `${projectProgress}%` }} />
        </div>
        <p className="text-sm text-zinc-400 mt-1">{projectProgress.toFixed(1)}% complete</p>
      </section>

      {/* Budget Charts */}
      {budget && (
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
      )}

      {/* Tasks */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Tasks</h2>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-500 text-white text-sm"
            onClick={() => setShowForm(!showForm)}
          >
            <FaPlus /> Assign Task
          </button>
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

      {/* Summary */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Summary</h2>
        <div className="bg-zinc-900 p-4 rounded border border-white/10 shadow-subtle text-sm text-zinc-400 space-y-2">
          <p><FaClipboardCheck className="inline mr-2 text-green-400" />Tasks Completed: {completedTasks}/{tasks.length}</p>
          {budget && (
            <>
              <p>Budget Remaining: ${(budget.totalBudget - budget.actualCost).toFixed(2)}</p>
              <p>Forecast Overrun: ${Math.max(0, budget.forecastCost - budget.totalBudget).toFixed(2)}</p>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProjectDetails;
