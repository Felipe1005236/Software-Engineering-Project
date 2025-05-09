import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Legend, CartesianGrid, PieChart, Pie, Cell
} from 'recharts';
import { useNavigate, useParams } from 'react-router-dom';
import { FaPlus, FaClipboardCheck, FaUsers, FaChartLine, FaUsersCog } from 'react-icons/fa';
import TeamMembershipManager from '../components/TeamMembershipManager';

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
  const [activeTab, setActiveTab] = useState('details');
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
    <div className="p-6 space-y-8 text-white">
      {/* Project Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
        <p className="text-zinc-400 mb-6">
          <span className="inline-block px-2 py-1 bg-zinc-800 rounded mr-2">Status: {project.status}</span>
          <span className="inline-block px-2 py-1 bg-zinc-800 rounded">Phase: {project.phase}</span>
        </p>
      </div>
      
      {/* Project Tabs */}
      <div className="flex border-b border-zinc-800 mb-6">
        <button
          className={`py-2 px-4 font-medium flex items-center gap-2 ${
            activeTab === 'details' 
              ? 'text-indigo-400 border-b-2 border-indigo-400' 
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
          onClick={() => setActiveTab('details')}
        >
          <FaChartLine />
          Details
        </button>
        <button
          className={`py-2 px-4 font-medium flex items-center gap-2 ${
            activeTab === 'tasks' 
              ? 'text-indigo-400 border-b-2 border-indigo-400' 
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
          onClick={() => setActiveTab('tasks')}
        >
          <FaClipboardCheck />
          Tasks
        </button>
        <button
          className={`py-2 px-4 font-medium flex items-center gap-2 ${
            activeTab === 'team' 
              ? 'text-indigo-400 border-b-2 border-indigo-400' 
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
          onClick={() => setActiveTab('team')}
        >
          <FaUsersCog />
          Team
        </button>
      </div>
      
      {/* Tab Content */}
      {activeTab === 'details' && (
        <div className="space-y-10">
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
        </div>
      )}
      
      {activeTab === 'tasks' && (
        <div>
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-white flex items-center">
              <FaClipboardCheck className="mr-2" /> Tasks
            </h2>
            
            <form onSubmit={handleCreateTask} className="bg-zinc-800/60 backdrop-blur p-4 border border-white/10 rounded-lg mb-6">
              <h3 className="text-lg font-medium mb-4">Create New Task</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-zinc-400 text-sm mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="bg-zinc-700 p-2 rounded w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-zinc-400 text-sm mb-1">Status</label>
                  <select
                    value={newTaskStatus}
                    onChange={(e) => setNewTaskStatus(e.target.value)}
                    className="bg-zinc-700 p-2 rounded w-full"
                  >
                    {STATUS_OPTIONS.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-zinc-400 text-sm mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                    className="bg-zinc-700 p-2 rounded w-full"
                  >
                    {PRIORITY_OPTIONS.map(priority => (
                      <option key={priority} value={priority}>{priority}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-zinc-400 text-sm mb-1">Completion %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newTaskPercentage}
                    onChange={(e) => setNewTaskPercentage(e.target.value)}
                    className="bg-zinc-700 p-2 rounded w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-zinc-400 text-sm mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newTaskStartDate}
                    onChange={(e) => setNewTaskStartDate(e.target.value)}
                    className="bg-zinc-700 p-2 rounded w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-zinc-400 text-sm mb-1">Target Date</label>
                  <input
                    type="date"
                    value={newTaskTargetDate}
                    onChange={(e) => setNewTaskTargetDate(e.target.value)}
                    className="bg-zinc-700 p-2 rounded w-full"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-zinc-400 text-sm mb-1">Description</label>
                  <textarea
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    className="bg-zinc-700 p-2 rounded w-full"
                    rows="3"
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded"
              >
                <FaPlus className="inline mr-1" /> Add Task
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
        </div>
      )}
      
      {activeTab === 'team' && (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
            <FaUsersCog className="mr-2" /> Team Management
          </h2>
          
          {project.team ? (
            <TeamMembershipManager 
              teamId={project.team.teamID} 
              projectId={project.projectID} 
            />
          ) : (
            <div className="bg-zinc-800/60 backdrop-blur border border-white/10 p-6 rounded-lg text-center">
              <p className="text-zinc-400 mb-4">No team has been assigned to this project yet.</p>
              <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded">
                Create Project Team
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
