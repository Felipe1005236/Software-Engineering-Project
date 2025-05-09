import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Legend, CartesianGrid, PieChart, Pie, Cell
} from 'recharts';
import { useNavigate, useParams } from 'react-router-dom';
import { FaPlus, FaClipboardCheck, FaUsers, FaChartLine, FaArrowLeft, FaEdit, FaSave, FaTimes, FaTrash, FaInfoCircle, FaMoneyBill, FaUserFriends, FaUserPlus, FaUserMinus, FaList, FaExternalLinkAlt, FaArchive, FaUndo } from 'react-icons/fa';

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
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState(null);
  const [activeSection, setActiveSection] = useState('details');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskStatus, setNewTaskStatus] = useState('PROPOSED');
  const [newTaskPriority, setNewTaskPriority] = useState('MEDIUM');
  const [newTaskPercentage, setNewTaskPercentage] = useState(0);
  const [newTaskStartDate, setNewTaskStartDate] = useState('');
  const [newTaskTargetDate, setNewTaskTargetDate] = useState('');
  const [newTeamMember, setNewTeamMember] = useState({ firstName: '', lastName: '', email: '', role: '' });
  const [isArchiving, setIsArchiving] = useState(false);

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/projects/${id}`, fetchOptions);
      if (!response.ok) throw new Error('Failed to fetch project details');
      const data = await response.json();
      setProject(data);
      setEditedProject(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching project data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeamMember = () => {
    if (!newTeamMember.firstName || !newTeamMember.lastName || !newTeamMember.email || !newTeamMember.role) {
      alert('Please fill in all team member details');
      return;
    }

    setEditedProject(prev => ({
      ...prev,
      team: {
        ...prev.team,
        users: [
          ...(prev.team?.users || []),
          {
            userID: Date.now(), // Temporary ID
            ...newTeamMember
          }
        ]
      }
    }));

    setNewTeamMember({ firstName: '', lastName: '', email: '', role: '' });
  };

  const handleRemoveTeamMember = (userId) => {
    setEditedProject(prev => ({
      ...prev,
      team: {
        ...prev.team,
        users: prev.team.users.filter(user => user.userID !== userId)
      }
    }));
  };

  const handleSaveProject = async () => {
    try {
      const updatedProjectData = {
        ...editedProject,
        team: {
          ...editedProject.team,
          users: editedProject.team.users.map(user => ({
            userID: user.userID
          }))
        }
      };

      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        ...fetchOptions,
        method: 'PUT',
        body: JSON.stringify(updatedProjectData)
      });

      if (!response.ok) throw new Error('Failed to update project');
      
      const updatedProject = await response.json();
      setProject(updatedProject);
      setEditedProject(updatedProject);
      setIsEditing(false);
      alert('Project updated successfully!');
    } catch (err) {
      setError(err.message);
      console.error('Error updating project:', err);
      alert(`Failed to update project: ${err.message}`);
    }
  };

  const handleDeleteProject = async () => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        ...fetchOptions,
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete project');
      
      navigate('/project-dashboard');
    } catch (err) {
      setError(err.message);
      console.error('Error deleting project:', err);
      alert(`Failed to delete project: ${err.message}`);
    }
  };

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

  const handleArchiveProject = async () => {
    if (!window.confirm('Are you sure you want to archive this project?')) {
      return;
    }
    setProject(prev => ({ ...prev, archived: true }));
    setTimeout(() => navigate('/project-dashboard'), 300);
  };

  const handleUnarchiveProject = async () => {
    if (!window.confirm('Are you sure you want to unarchive this project?')) {
      return;
    }
    setProject(prev => ({ ...prev, archived: false }));
    setTimeout(() => navigate('/project-dashboard'), 300);
  };

  const renderEditTabs = () => {
    if (!isEditing) return null;

    return (
      <div className="mb-6 border-b border-white/10">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveSection('details')}
            className={`px-4 py-2 flex items-center gap-2 ${
              activeSection === 'details'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <FaInfoCircle className="w-4 h-4" />
            Project Details
          </button>
          <button
            onClick={() => setActiveSection('budget')}
            className={`px-4 py-2 flex items-center gap-2 ${
              activeSection === 'budget'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <FaMoneyBill className="w-4 h-4" />
            Budget
          </button>
          <button
            onClick={() => setActiveSection('team')}
            className={`px-4 py-2 flex items-center gap-2 ${
              activeSection === 'team'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <FaUserFriends className="w-4 h-4" />
            Team Members
          </button>
        </div>
      </div>
    );
  };

  const renderEditContent = () => {
    if (!isEditing) return null;

    switch (activeSection) {
      case 'details':
        return (
          <div className="space-y-4">
            <input
              type="text"
              value={editedProject?.title || ''}
              onChange={(e) => setEditedProject({ ...editedProject, title: e.target.value })}
              className="text-3xl font-bold bg-zinc-800/60 border border-white/10 p-2 rounded text-white w-full"
              placeholder="Project Title"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-zinc-400">Status</label>
                <select
                  value={editedProject?.status || ''}
                  onChange={(e) => setEditedProject({ ...editedProject, status: e.target.value })}
                  className="w-full bg-zinc-800/60 border border-white/10 p-2 rounded text-white"
                >
                  {STATUS_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-zinc-400">Phase</label>
                <input
                  type="text"
                  value={editedProject?.phase || ''}
                  onChange={(e) => setEditedProject({ ...editedProject, phase: e.target.value })}
                  className="w-full bg-zinc-800/60 border border-white/10 p-2 rounded text-white"
                  placeholder="Project Phase"
                />
              </div>
            </div>
          </div>
        );

      case 'budget':
        return project.budget ? (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4 text-zinc-300">Budget Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-zinc-400">Total Budget</label>
                <input
                  type="number"
                  value={editedProject?.budget?.totalBudget || ''}
                  onChange={(e) => setEditedProject(prev => ({
                    ...prev,
                    budget: { ...prev.budget, totalBudget: Number(e.target.value) }
                  }))}
                  className="w-full bg-zinc-800/60 border border-white/10 p-2 rounded text-white"
                  placeholder="Enter total budget"
                />
              </div>
              <div>
                <label className="text-zinc-400">Actual Cost</label>
                <input
                  type="number"
                  value={editedProject?.budget?.actualCost || ''}
                  onChange={(e) => setEditedProject(prev => ({
                    ...prev,
                    budget: { ...prev.budget, actualCost: Number(e.target.value) }
                  }))}
                  className="w-full bg-zinc-800/60 border border-white/10 p-2 rounded text-white"
                  placeholder="Enter actual cost"
                />
              </div>
              <div>
                <label className="text-zinc-400">Forecast Cost</label>
                <input
                  type="number"
                  value={editedProject?.budget?.forecastCost || ''}
                  onChange={(e) => setEditedProject(prev => ({
                    ...prev,
                    budget: { ...prev.budget, forecastCost: Number(e.target.value) }
                  }))}
                  className="w-full bg-zinc-800/60 border border-white/10 p-2 rounded text-white"
                  placeholder="Enter forecast cost"
                />
              </div>
            </div>
          </div>
        ) : null;

      case 'team':
        return (
          <div className="space-y-4">
            {/* Add New Team Member Form */}
            <div className="mb-6 p-4 bg-zinc-800/60 border border-white/10 rounded-lg">
              <h3 className="text-md font-semibold mb-4 text-zinc-300">Add New Team Member</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={newTeamMember.firstName}
                  onChange={(e) => setNewTeamMember(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="First Name"
                  className="bg-zinc-800/60 border border-white/10 p-2 rounded text-white"
                />
                <input
                  type="text"
                  value={newTeamMember.lastName}
                  onChange={(e) => setNewTeamMember(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Last Name"
                  className="bg-zinc-800/60 border border-white/10 p-2 rounded text-white"
                />
                <input
                  type="email"
                  value={newTeamMember.email}
                  onChange={(e) => setNewTeamMember(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Email"
                  className="bg-zinc-800/60 border border-white/10 p-2 rounded text-white"
                />
                <input
                  type="text"
                  value={newTeamMember.role}
                  onChange={(e) => setNewTeamMember(prev => ({ ...prev, role: e.target.value }))}
                  placeholder="Role"
                  className="bg-zinc-800/60 border border-white/10 p-2 rounded text-white"
                />
              </div>
              <button
                onClick={handleAddTeamMember}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 border border-blue-500/30"
              >
                <FaUserPlus className="w-4 h-4" />
                Add Team Member
              </button>
            </div>

            {/* Team Members List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {editedProject?.team?.users?.map((user) => (
                <div
                  key={user.userID}
                  className="p-4 rounded-lg border bg-zinc-800/60 border-white/10"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-white">{user.firstName} {user.lastName}</h3>
                      <p className="text-zinc-400">{user.email}</p>
                      <p className="text-sm text-zinc-500">Role: {user.role}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveTeamMember(user.userID)}
                      className="p-2 text-red-400 hover:text-red-300"
                    >
                      <FaUserMinus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderTasksSection = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Tasks</h2>
        <button
          onClick={() => navigate(`/projects/${id}/tasks`)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 border border-blue-500/30"
        >
          <FaList className="w-4 h-4" />
          View Task List
        </button>
      </div>

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
          <div 
            key={task.taskID} 
            className="bg-zinc-800/60 backdrop-blur border border-white/10 p-4 rounded-lg shadow-subtle cursor-pointer hover:bg-zinc-800/80 transition-colors"
            onClick={() => navigate(`/projects/${id}/tasks/${task.taskID}`)}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-white">{task.title}</h3>
            </div>
            <p className="text-zinc-400 mb-2">{task.details}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-400">Status: {task.status}</span>
              <span className="text-sm text-zinc-400">{task.percentageComplete}% complete</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) return <div className="p-6 text-white">Loading...</div>;
  if (error) return <div className="p-6 text-white text-red-500">Error: {error}</div>;
  if (!project) return <div className="p-6 text-white">Project not found</div>;

  const completedTasks = project.tasks?.filter(t => t.status === 'COMPLETED').length || 0;
  const projectProgress = project.tasks?.length ? (completedTasks / project.tasks.length) * 100 : 0;

  return (
    <div className="p-6 space-y-10 text-white">
      <div>
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigate('/project-dashboard')}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg border border-white/10"
          >
            <FaArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <div className="flex gap-2">
            {!isEditing ? (
              <>
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setActiveSection('details');
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 border border-blue-500/30"
                >
                  <FaEdit className="w-4 h-4" />
                  Edit Project
                </button>
                {project.archived ? (
                  <button
                    onClick={handleUnarchiveProject}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 border border-green-500/30"
                  >
                    <FaUndo className="w-4 h-4" />
                    Unarchive Project
                  </button>
                ) : (
                  <button
                    onClick={handleArchiveProject}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 border border-yellow-500/30"
                  >
                    <FaArchive className="w-4 h-4" />
                    Archive Project
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={handleSaveProject}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 border border-green-500/30"
                >
                  <FaSave className="w-4 h-4" />
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedProject(project);
                    setActiveSection('details');
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-zinc-500/20 text-zinc-400 rounded-lg hover:bg-zinc-500/30 border border-zinc-500/30"
                >
                  <FaTimes className="w-4 h-4" />
                  Cancel
                </button>
              </>
            )}
            <button
              onClick={handleDeleteProject}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 border border-red-500/30"
            >
              <FaTrash className="w-4 h-4" />
              Delete Project
            </button>
          </div>
        </div>

        {renderEditTabs()}
        {renderEditContent()}

        {!isEditing && (
          <>
            <h1 className="text-3xl font-bold mb-6">{project.title}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-zinc-800/60 backdrop-blur border border-white/10 p-4 rounded-lg shadow-subtle">
                <h2 className="text-lg font-semibold mb-4 text-zinc-300">Project Details</h2>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium text-zinc-400">Status:</span>{' '}
                    <span className="text-white">{project.status}</span>
                  </p>
                  <p>
                    <span className="font-medium text-zinc-400">Phase:</span>{' '}
                    <span className="text-white">{project.phase}</span>
                  </p>
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

            {renderTasksSection()}

            {project.team?.users && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-white">Team Members</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {project.team.users.map((user) => (
                    <div key={user.userID} className="bg-zinc-800/60 backdrop-blur border border-white/10 p-4 rounded-lg shadow-subtle">
                      <h3 className="font-semibold mb-2 text-white">{user.firstName} {user.lastName}</h3>
                      <p className="text-zinc-400">{user.email}</p>
                      <p className="text-sm text-zinc-500">Role: {user.primaryRole}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;