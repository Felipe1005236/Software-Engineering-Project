import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Legend, CartesianGrid, PieChart, Pie, Cell
} from 'recharts';
import { useNavigate, useParams } from 'react-router-dom';
import { FaPlus, FaClipboardCheck, FaUsers, FaChartLine, FaUsersCog, FaUserCircle, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import TeamMembershipManager from '../components/TeamMembershipManager';
import { fetchWrapper } from '../utils/fetchWrapper';
import { motion } from 'framer-motion';

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

const HEALTH_OPTIONS = ['GREEN', 'YELLOW', 'RED'];

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
  const [editingTaskId, setEditingTaskId] = useState(null);
  
  // Stakeholders state
  const [stakeholders, setStakeholders] = useState([]);
  const [stakeholderForm, setStakeholderForm] = useState({ name: '' });
  const [editingStakeholderIndex, setEditingStakeholderIndex] = useState(null);
  const [showStakeholderForm, setShowStakeholderForm] = useState(false);

  const [editingProjectDetails, setEditingProjectDetails] = useState(false);
  const [projectForm, setProjectForm] = useState({
    title: '',
    status: '',
    phase: '',
    startDate: '',
    targetDate: '',
    teamId: '',
    health: {
      scope: 'GREEN',
      schedule: 'GREEN',
      cost: 'GREEN',
      resource: 'GREEN',
      overall: 'GREEN'
    }
  });

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await fetchWrapper(`/projects/${id}`);
        setProject(data);
        
        // Initialize project form with fetched data
        setProjectForm({
          title: data.title || '',
          status: data.status || 'PROPOSED',
          phase: data.phase || 'INITIATING',
          startDate: data.dates?.startDate || '',
          targetDate: data.dates?.targetDate || '',
          teamId: data.team?.teamID || '',
          health: {
            scope: data.health?.scope || 'GREEN',
            schedule: data.health?.schedule || 'GREEN',
            cost: data.health?.cost || 'GREEN',
            resource: data.health?.resource || 'GREEN',
            overall: data.health?.overall || 'GREEN'
          }
        });
        
        // Fetch stakeholders data
        try {
          const stakeholdersData = await fetchWrapper(`/projects/${id}/stakeholders`);
          setStakeholders(stakeholdersData || []);
        } catch (stakeholderErr) {
          console.error('Error fetching stakeholders:', stakeholderErr);
          setStakeholders([]);
          // Don't set the main error state just for stakeholders
        }
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
      if (editingTaskId) {
        // Update existing task
        const updatedTask = await fetchWrapper(`/tasks/${editingTaskId}`, {
          method: 'PATCH',
          body: {
            title: newTaskTitle,
            details: newTaskDescription,
            projectID: parseInt(id),
            status: newTaskStatus,
            percentageComplete: Number(newTaskPercentage),
            priority: newTaskPriority,
            startDate: newTaskStartDate,
            targetDate: newTaskTargetDate
          }
        });
        
        // Update UI
        setProject(prev => ({
          ...prev,
          tasks: prev.tasks.map(task => 
            task.taskID === editingTaskId ? updatedTask : task
          )
        }));
        
        // Reset editing state
        setEditingTaskId(null);
      } else {
        // Create new task
        const newTask = await fetchWrapper(`/tasks`, {
        method: 'POST',
          body: {
          title: newTaskTitle,
          details: newTaskDescription,
          projectID: parseInt(id),
          userID: 1, // TODO: Get from authenticated user
          status: newTaskStatus,
          percentageComplete: Number(newTaskPercentage),
          priority: newTaskPriority,
          startDate: newTaskStartDate,
          targetDate: newTaskTargetDate
          }
      });
        
      setProject(prev => ({
        ...prev,
        tasks: [newTask, ...prev.tasks]
      }));
      }
      
      // Reset form
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskStatus('PROPOSED');
      setNewTaskPriority('MEDIUM');
      setNewTaskPercentage(0);
      setNewTaskStartDate('');
      setNewTaskTargetDate('');
    } catch (err) {
      setError(err.message);
      console.error('Error with task operation:', err);
    }
  };
  
  const handleEditTask = (task) => {
    setEditingTaskId(task.taskID);
    setNewTaskTitle(task.title);
    setNewTaskDescription(task.details || '');
    setNewTaskStatus(task.status);
    setNewTaskPriority(task.priority);
    setNewTaskPercentage(task.percentageComplete || 0);
    setNewTaskStartDate(task.startDate || '');
    setNewTaskTargetDate(task.targetDate || '');
    
    // Scroll to form
    document.getElementById('taskForm')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      try {
        // Use fetchWrapper instead of fetch
        await fetchWrapper(`/tasks/${taskId}`, {
          method: 'DELETE'
        });
        
        // Update UI
        setProject(prev => ({
          ...prev,
          tasks: prev.tasks.filter(task => task.taskID !== taskId)
        }));
      } catch (err) {
        setError(err.message);
        console.error('Error deleting task:', err);
      }
    }
  };

  // Stakeholders handlers
  const handleStakeholderSubmit = async (e) => {
    e.preventDefault();
    if (!stakeholderForm.name) {
      console.error('Stakeholder name is required');
      return;
    }

    console.log('Submitting stakeholder form:', stakeholderForm);
    
    try {
      if (editingStakeholderIndex !== null) {
        // Update existing stakeholder
        const stakeholder = stakeholders[editingStakeholderIndex];
        console.log(`Updating stakeholder ${stakeholder.stakeholderID} with data:`, stakeholderForm);
        
        const updatedStakeholder = await fetchWrapper(`/projects/${id}/stakeholders/${stakeholder.stakeholderID}`, {
          method: 'PATCH',
          body: { name: stakeholderForm.name }
        });
        
        console.log('API response for update:', updatedStakeholder);
        
        // Update the local state
        const updatedList = [...stakeholders];
        updatedList[editingStakeholderIndex] = updatedStakeholder;
        setStakeholders(updatedList);
        setEditingStakeholderIndex(null);
      } else {
        // Create new stakeholder
        console.log(`Creating new stakeholder for project ${id} with data:`, stakeholderForm);
        
        const newStakeholder = await fetchWrapper(`/projects/${id}/stakeholders`, {
          method: 'POST',
          body: { 
            name: stakeholderForm.name, 
            projectID: parseInt(id) 
          }
        });
        
        console.log('API response for create:', newStakeholder);
        
        // Update the local state
        setStakeholders(prev => [...prev, newStakeholder]);
      }
      
      // Reset the form
      setStakeholderForm({ name: '' });
      setShowStakeholderForm(false);
    } catch (err) {
      console.error('Stakeholder operation failed:', err);
      alert(`Failed to ${editingStakeholderIndex !== null ? 'update' : 'add'} stakeholder: ${err.message}`);
    }
  };

  const handleStakeholderDelete = async (i) => {
    const deleted = stakeholders[i];
    const updated = stakeholders.filter((_, idx) => idx !== i);
    setStakeholders(updated);
    try {
      await fetchWrapper(`/projects/${id}/stakeholders/${deleted.stakeholderID}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.error('Delete stakeholder failed:', err);
      // Restore the stakeholder if delete fails
      setStakeholders(stakeholders);
    }
  };

  const handleStakeholderEdit = (i) => {
    setStakeholderForm(stakeholders[i]);
    setEditingStakeholderIndex(i);
    setShowStakeholderForm(true);
  };

  const handleEditProject = () => {
    setEditingProjectDetails(true);
  };
  
  const handleCancelEdit = () => {
    // Reset form to current project values
    setProjectForm({
      title: project.title || '',
      status: project.status || 'PROPOSED',
      phase: project.phase || 'INITIATING',
      startDate: project.dates?.startDate || '',
      targetDate: project.dates?.targetDate || '',
      teamId: project.team?.teamID || '',
      health: {
        scope: project.health?.scope || 'GREEN',
        schedule: project.health?.schedule || 'GREEN',
        cost: project.health?.cost || 'GREEN',
        resource: project.health?.resource || 'GREEN',
        overall: project.health?.overall || 'GREEN'
      }
    });
    setEditingProjectDetails(false);
  };
  
  const handleUpdateProject = async () => {
    try {
      // Use fetchWrapper instead of fetch
      const updatedProject = await fetchWrapper(`/projects/${id}`, {
        method: 'PATCH',
        body: {
          title: projectForm.title,
          status: projectForm.status,
          phase: projectForm.phase,
          teamId: projectForm.teamId ? parseInt(projectForm.teamId, 10) : undefined,
          startDate: projectForm.startDate,
          targetDate: projectForm.targetDate,
          health: {
            scope: projectForm.health.scope,
            schedule: projectForm.health.schedule,
            cost: projectForm.health.cost,
            resource: projectForm.health.resource,
            overall: projectForm.health.overall
          }
        }
      });
      
      setProject(updatedProject);
      setEditingProjectDetails(false);
    } catch (err) {
      setError(err.message);
      console.error('Error updating project:', err);
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
        <button
          className={`py-2 px-4 font-medium flex items-center gap-2 ${
            activeTab === 'stakeholders' 
              ? 'text-indigo-400 border-b-2 border-indigo-400' 
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
          onClick={() => setActiveTab('stakeholders')}
        >
          <FaUserCircle />
          Stakeholders
        </button>
      </div>
      
      {/* Tab Content */}
      {activeTab === 'details' && (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-800/60 backdrop-blur border border-white/10 p-4 rounded-lg shadow-subtle relative">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-zinc-300">Project Details</h2>
                {!editingProjectDetails ? (
                  <button 
                    onClick={handleEditProject}
                    className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-1"
                  >
                    <FaEdit /> Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button 
                      onClick={handleUpdateProject}
                      className="text-green-500 hover:text-green-400 text-sm flex items-center gap-1"
                    >
                      <FaSave /> Save
                    </button>
                    <button 
                      onClick={handleCancelEdit}
                      className="text-red-500 hover:text-red-400 text-sm flex items-center gap-1"
                    >
                      <FaTimes /> Cancel
                    </button>
                  </div>
                )}
              </div>
              
              {!editingProjectDetails ? (
              <div className="space-y-2">
                  <p><span className="font-medium text-zinc-400">Title:</span> <span className="text-white">{project.title}</span></p>
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
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">Title</label>
                    <input 
                      type="text"
                      value={projectForm.title}
                      onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
                      className="bg-zinc-700 p-2 rounded w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">Status</label>
                    <select
                      value={projectForm.status}
                      onChange={(e) => setProjectForm({...projectForm, status: e.target.value})}
                      className="bg-zinc-700 p-2 rounded w-full"
                    >
                      {STATUS_OPTIONS.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">Phase</label>
                    <select
                      value={projectForm.phase}
                      onChange={(e) => setProjectForm({...projectForm, phase: e.target.value})}
                      className="bg-zinc-700 p-2 rounded w-full"
                    >
                      <option value="INITIATING">INITIATING</option>
                      <option value="PLANNING">PLANNING</option>
                      <option value="EXECUTING">EXECUTING</option>
                      <option value="MONITORING_CONTROLLING">MONITORING_CONTROLLING</option>
                      <option value="CLOSING">CLOSING</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">Start Date</label>
                    <input 
                      type="date"
                      value={projectForm.startDate}
                      onChange={(e) => setProjectForm({...projectForm, startDate: e.target.value})}
                      className="bg-zinc-700 p-2 rounded w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">Target Date</label>
                    <input 
                      type="date"
                      value={projectForm.targetDate}
                      onChange={(e) => setProjectForm({...projectForm, targetDate: e.target.value})}
                      className="bg-zinc-700 p-2 rounded w-full"
                    />
                  </div>
                </div>
              )}
        </div>
            
            {project.health && (
              <div className="bg-zinc-800/60 backdrop-blur border border-white/10 p-4 rounded-lg shadow-subtle">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-zinc-300">Health Status</h2>
                </div>
                
                {!editingProjectDetails ? (
                <div className="grid grid-cols-2 gap-4">
                  <p><span className="font-medium text-zinc-400">Scope:</span> <span className={`text-${project.health.scope.toLowerCase()}-400`}>{project.health.scope}</span></p>
                  <p><span className="font-medium text-zinc-400">Schedule:</span> <span className={`text-${project.health.schedule.toLowerCase()}-400`}>{project.health.schedule}</span></p>
                  <p><span className="font-medium text-zinc-400">Cost:</span> <span className={`text-${project.health.cost.toLowerCase()}-400`}>{project.health.cost}</span></p>
                  <p><span className="font-medium text-zinc-400">Resource:</span> <span className={`text-${project.health.resource.toLowerCase()}-400`}>{project.health.resource}</span></p>
                  <p className="col-span-2"><span className="font-medium text-zinc-400">Overall:</span> <span className={`text-${project.health.overall.toLowerCase()}-400`}>{project.health.overall}</span></p>
                </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-zinc-400 mb-1">Scope</label>
                      <select
                        value={projectForm.health.scope}
                        onChange={(e) => setProjectForm({
                          ...projectForm, 
                          health: {...projectForm.health, scope: e.target.value}
                        })}
                        className="bg-zinc-700 p-2 rounded w-full border-l-4"
                        style={{borderLeftColor: getHealthColor(projectForm.health.scope)}}
                      >
                        {HEALTH_OPTIONS.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-zinc-400 mb-1">Schedule</label>
                      <select
                        value={projectForm.health.schedule}
                        onChange={(e) => setProjectForm({
                          ...projectForm, 
                          health: {...projectForm.health, schedule: e.target.value}
                        })}
                        className="bg-zinc-700 p-2 rounded w-full border-l-4"
                        style={{borderLeftColor: getHealthColor(projectForm.health.schedule)}}
                      >
                        {HEALTH_OPTIONS.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-zinc-400 mb-1">Cost</label>
                      <select
                        value={projectForm.health.cost}
                        onChange={(e) => setProjectForm({
                          ...projectForm, 
                          health: {...projectForm.health, cost: e.target.value}
                        })}
                        className="bg-zinc-700 p-2 rounded w-full border-l-4"
                        style={{borderLeftColor: getHealthColor(projectForm.health.cost)}}
                      >
                        {HEALTH_OPTIONS.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-zinc-400 mb-1">Resource</label>
                      <select
                        value={projectForm.health.resource}
                        onChange={(e) => setProjectForm({
                          ...projectForm, 
                          health: {...projectForm.health, resource: e.target.value}
                        })}
                        className="bg-zinc-700 p-2 rounded w-full border-l-4"
                        style={{borderLeftColor: getHealthColor(projectForm.health.resource)}}
                      >
                        {HEALTH_OPTIONS.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="col-span-2">
                      <label className="block text-sm text-zinc-400 mb-1">Overall</label>
                      <select
                        value={projectForm.health.overall}
                        onChange={(e) => setProjectForm({
                          ...projectForm, 
                          health: {...projectForm.health, overall: e.target.value}
                        })}
                        className="bg-zinc-700 p-2 rounded w-full border-l-4"
                        style={{borderLeftColor: getHealthColor(projectForm.health.overall)}}
                      >
                        {HEALTH_OPTIONS.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
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
            
            <form id="taskForm" onSubmit={handleCreateTask} className="bg-zinc-800/60 backdrop-blur p-4 border border-white/10 rounded-lg mb-6">
              <h3 className="text-lg font-medium mb-4">
                {editingTaskId ? 'Edit Task' : 'Create New Task'}
              </h3>
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
              
              <div className="flex gap-3">
              <button
                type="submit"
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded"
              >
                  {editingTaskId ? 'Update Task' : <><FaPlus className="inline mr-1" /> Add Task</>}
                </button>
                
                {editingTaskId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingTaskId(null);
                      setNewTaskTitle('');
                      setNewTaskDescription('');
                      setNewTaskStatus('PROPOSED');
                      setNewTaskPriority('MEDIUM');
                      setNewTaskPercentage(0);
                      setNewTaskStartDate('');
                      setNewTaskTargetDate('');
                    }}
                    className="bg-zinc-600 hover:bg-zinc-500 text-white px-4 py-2 rounded"
                  >
                    Cancel Edit
              </button>
                )}
              </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.tasks?.map((task) => (
                <div key={task.taskID} className="bg-zinc-800/60 backdrop-blur border border-white/10 p-4 rounded-lg shadow-subtle relative">
                  <h3 className="font-semibold mb-2 text-white pr-16">{task.title}</h3>
                  <p className="text-zinc-400 mb-2">{task.details}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-400">Status: {task.status}</span>
                    <span className="text-sm text-zinc-400">{task.percentageComplete}% complete</span>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      onClick={() => handleEditTask(task)}
                      className="text-yellow-500 hover:text-yellow-400 text-xs"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.taskID)}
                      className="text-red-500 hover:text-red-400 text-xs"
                    >
                      <FaTrash />
                    </button>
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

      {activeTab === 'stakeholders' && (
        <div className="space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <FaUserCircle className="mr-2" /> Stakeholders
            </h2>
            <button
              onClick={() => {
                setStakeholderForm({ name: '' });
                setEditingStakeholderIndex(null);
                setShowStakeholderForm(!showStakeholderForm);
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-sm rounded shadow transition"
            >
              {showStakeholderForm ? 'Cancel' : '+ Add Stakeholder'}
            </button>
              </div>

          {/* Form */}
          {showStakeholderForm && (
            <motion.form
              onSubmit={handleStakeholderSubmit}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 gap-4 bg-zinc-900/60 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-subtle"
            >
              <div className="flex flex-col space-y-2">
                <label className="text-sm text-zinc-400">Name</label>
                <input
                  type="text"
                  placeholder="Enter stakeholder name"
                  value={stakeholderForm.name}
                  onChange={(e) => setStakeholderForm({ ...stakeholderForm, name: e.target.value })}
                  className="bg-zinc-800 p-3 rounded border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded text-sm font-medium"
                >
                  {editingStakeholderIndex !== null ? 'Update' : 'Add Stakeholder'}
                </button>
              </div>
            </motion.form>
          )}

          {/* Stakeholders List */}
          <motion.ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stakeholders.map((p, i) => (
              <motion.li
                key={i}
                className="bg-zinc-900/60 backdrop-blur-md p-5 rounded-xl border border-white/10 shadow-subtle hover:shadow-lg transition"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <FaUserCircle className="text-3xl text-indigo-400" />
                  <div>
                    <p className="font-semibold">{p.name}</p>
                  </div>
                </div>
                <div className="flex gap-3 text-xs mt-2">
                  <button
                    onClick={() => handleStakeholderEdit(i)}
                    className="text-indigo-400 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleStakeholderDelete(i)}
                    className="text-red-400 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      )}
    </div>
  );
};

// Helper function to get health status color
const getHealthColor = (status) => {
  switch (status) {
    case 'GREEN': return '#22c55e'; // green-500
    case 'YELLOW': return '#eab308'; // yellow-500
    case 'RED': return '#ef4444'; // red-500
    default: return '#22c55e';
  }
};

export default ProjectDetails;
