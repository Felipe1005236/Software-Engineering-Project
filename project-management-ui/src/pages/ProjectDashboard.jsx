import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaClipboardList, FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { fetchWrapper } from '../utils/fetchWrapper';

const iconMap = {
  default: <FaClipboardList className="text-blue-400 text-2xl" />,
};

const API_BASE_URL = 'http://localhost:3000/api';

export default function ProjectDashboard() {
  const [search, setSearch] = useState('');
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [userAccessLevels, setUserAccessLevels] = useState({});
  const [newProject, setNewProject] = useState({
    title: '',
    manager: '',
    teamId: '',
    priority: 'Medium',
    status: 'PROPOSED',
    phase: 'INITIATING',
    startDate: '',
    targetDate: '',
    description: '',
  });
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteProjectId, setDeleteProjectId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await fetchWrapper('/projects');
        if (Array.isArray(data)) setProjects(data);
        else setProjects([]);
        
        // Get access levels for all projects
        for (const project of data) {
          checkProjectAccess(project.projectID);
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err.message);
      }
    };
    
    fetchProjects();
  }, []);
  
  // Function to check user's access level for a project
  const checkProjectAccess = async (projectId) => {
    try {
      // You can implement this on the backend or use an existing endpoint
      const accessInfo = await fetchWrapper(`/projects/${projectId}/access-level`).catch(() => ({
        hasReadWrite: false,
        hasFullAccess: false
      }));
      
      setUserAccessLevels(prev => ({
        ...prev,
        [projectId]: {
          canEdit: accessInfo.hasReadWrite || accessInfo.hasFullAccess,
          canDelete: accessInfo.hasFullAccess
        }
      }));
    } catch (error) {
      console.error(`Error checking access for project ${projectId}:`, error);
      // If we can't check access, assume the user doesn't have edit/delete permissions
      setUserAccessLevels(prev => ({
        ...prev,
        [projectId]: { canEdit: false, canDelete: false }
      }));
    }
  };

  useEffect(() => {
    // Fetch all users for manager dropdown
    fetchWrapper('/user-management')
      .then(setUsers)
      .catch(() => setUsers([]));

    // Fetch all teams for team dropdown
    fetchWrapper('/teams')
      .then(setTeams)
      .catch(() => setTeams([]));
  }, []);

  // Add new useEffect to fetch teams
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const data = await fetchWrapper('/teams');
        if (Array.isArray(data)) setTeams(data);
        else setTeams([]);
      } catch (err) {
        console.error('Error fetching teams:', err);
        setError(err.message);
      }
    };
    
    fetchTeams();
  }, []);

  const filteredProjects = projects.filter((p) =>
    p.title?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateProject = async (e) => {
    e.preventDefault();
    
    if (!newProject.title || !newProject.teamId) {
      setError('Title and team are required');
      return;
    }

    try {
      const payload = {
        title: newProject.title,
        status: newProject.status || 'PROPOSED',
        phase: newProject.phase || 'INITIATING',
        teamId: parseInt(newProject.teamId, 10),
        startDate: newProject.startDate || new Date().toISOString(),
        targetDate: newProject.targetDate
      };

      if (editingProject) {
        // Update existing project
        await fetchWrapper(`/projects/${editingProject}`, {
          method: 'PATCH',
          body: payload
        });
      } else {
        // Create new project
        await fetchWrapper('/projects', {
          method: 'POST',
          body: payload
        });
      }
      
      setShowForm(false);
      setEditingProject(null);
      setNewProject({
        title: '',
        teamId: '',
        status: 'PROPOSED',
        phase: 'INITIATING',
        startDate: '',
        targetDate: ''
      });
      
      // Refresh projects list
      const data = await fetchWrapper('/projects');
      if (Array.isArray(data)) setProjects(data);
    } catch (err) {
      console.error(`Error ${editingProject ? 'updating' : 'creating'} project:`, err);
      setError(err.message);
    }
  };
  
  const handleEditProject = (project, e) => {
    e.stopPropagation(); // Prevent navigation to project details
    
    setEditingProject(project.projectID);
    setNewProject({
      title: project.title,
      status: project.status,
      phase: project.phase,
      teamId: project.teamID?.toString() || '',
      startDate: project.dates?.startDate || '',
      targetDate: project.dates?.targetDate || '',
      description: '',
    });
    setShowForm(true);
  };
  
  const handleDeleteProject = async (projectId, e) => {
    e.stopPropagation(); // Prevent navigation to project details
    
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      setIsDeleting(true);
      setDeleteProjectId(projectId);
      
      try {
        await fetchWrapper(`/projects/${projectId}`, {
          method: 'DELETE',
        });
        
        // Update projects list after successful deletion
        setProjects(projects.filter(p => p.projectID !== projectId));
      } catch (err) {
        console.error('Error deleting project:', err);
        setError(`Failed to delete project: ${err.message}`);
      } finally {
        setIsDeleting(false);
        setDeleteProjectId(null);
      }
    }
  };

  return (
    <div className="p-6 text-white max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold">📁 Projects</h1>
        <button
          onClick={() => {
            setEditingProject(null);
            setNewProject({
              title: '', manager: '', teamId: '', priority: 'Medium',
              status: 'PROPOSED', phase: 'INITIATING',
              startDate: '', targetDate: '', description: '',
            });
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white text-sm font-medium shadow"
        >
          <FaPlus /> {showForm ? 'Close Form' : 'New Project'}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
          <p className="text-red-400 font-semibold">Error loading projects: {error}</p>
          <p className="text-sm text-red-300 mt-2">Please ensure the backend is running at {API_BASE_URL}</p>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleCreateProject} className="bg-zinc-900/80 p-6 rounded-xl border border-white/10 mb-12 space-y-5 shadow-subtle">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Project Title</label>
              <input
                type="text"
                required
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                className="w-full p-2 rounded bg-zinc-800 text-white border border-white/10"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Team</label>
              <select
                value={newProject.teamId || ''}
                onChange={(e) => setNewProject({ ...newProject, teamId: e.target.value })}
                className="w-full p-2 rounded bg-zinc-800 text-white border border-white/10"
                required
              >
                <option value="">Select Team</option>
                {teams.map(team => (
                  <option key={team.teamID} value={team.teamID}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Start Date</label>
              <input
                type="date"
                value={newProject.startDate}
                onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                className="w-full p-2 rounded bg-zinc-800 text-white border border-white/10"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Target Date</label>
              <input
                type="date"
                value={newProject.targetDate}
                onChange={(e) => setNewProject({ ...newProject, targetDate: e.target.value })}
                className="w-full p-2 rounded bg-zinc-800 text-white border border-white/10"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Status</label>
              <select
                value={newProject.status}
                onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                className="w-full p-2 rounded bg-zinc-800 text-white border border-white/10"
              >
                <option>PROPOSED</option>
                <option>IN_PROGRESS</option>
                <option>COMPLETED</option>
                <option>APPROVED</option>
                <option>CANCELED</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Phase</label>
              <select
                value={newProject.phase}
                onChange={(e) => setNewProject({ ...newProject, phase: e.target.value })}
                className="w-full p-2 rounded bg-zinc-800 text-white border border-white/10"
              >
                <option>INITIATING</option>
                <option>PLANNING</option>
                <option>EXECUTING</option>
                <option>MONITORING_CONTROLLING</option>
              </select>
            </div>
          </div>
          <div className="text-right">
            <button type="submit" className="bg-green-600 px-6 py-2 rounded text-white font-medium hover:bg-green-500">
              {editingProject ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      )}

      <input
        type="text"
        placeholder="Search projects..."
        className="w-full bg-zinc-900 border border-white/10 rounded-lg p-3 mb-8 placeholder-zinc-400"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.projectID}
            className="bg-zinc-800/70 p-6 rounded-xl shadow-subtle border border-white/10 hover:bg-zinc-700/60 cursor-pointer relative"
            onClick={() => navigate(`/projects/${project.projectID}`)}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">{project.title}</h3>
              {iconMap.default}
            </div>
            <p className="text-sm text-zinc-400">Status: {project.status}</p>
            <p className="text-sm text-zinc-400 mb-4">Phase: {project.phase}</p>
            
            {/* Action buttons */}
            <div className="flex gap-2 mt-4" onClick={e => e.stopPropagation()}>
              <button
                className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/projects/${project.projectID}`);
                }}
              >
                <FaEye size={12} /> View
              </button>
              
              {userAccessLevels[project.projectID]?.canEdit && (
                <button
                  className="flex items-center gap-1 px-3 py-1 bg-yellow-600 hover:bg-yellow-500 rounded text-xs"
                  onClick={(e) => handleEditProject(project, e)}
                >
                  <FaEdit size={12} /> Edit
                </button>
              )}
              
              {userAccessLevels[project.projectID]?.canDelete && (
                <button
                  className={`flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-xs ${
                    isDeleting && deleteProjectId === project.projectID ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={(e) => handleDeleteProject(project.projectID, e)}
                  disabled={isDeleting && deleteProjectId === project.projectID}
                >
                  <FaTrash size={12} />
                  {isDeleting && deleteProjectId === project.projectID ? 'Deleting...' : 'Delete'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}