import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaClipboardList, FaPlus } from 'react-icons/fa';
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

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await fetchWrapper('/projects');
        if (Array.isArray(data)) setProjects(data);
        else setProjects([]);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err.message);
      }
    };
    
    fetchProjects();
  }, []);

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

  const filteredProjects = projects.filter((p) =>
    p.title?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEntry = {
      ...newProject,
      projectID: Date.now(),
    };
    localStorage.setItem(`project-${newEntry.projectID}`, JSON.stringify(newEntry));
    setProjects(prev => [...prev, newEntry]);
    setShowForm(false);
    setNewProject({
      title: '', manager: '', teamId: '', priority: 'Medium',
      status: 'PROPOSED', phase: 'INITIATING',
      startDate: '', targetDate: '', description: '',
    });
    navigate(`/projects/${newEntry.projectID}`);
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await fetchWrapper('/projects', {
        method: 'POST',
        body: JSON.stringify({
          title: newProject.title,
          status: newProject.status,
          phase: newProject.phase,
          teamId: parseInt(newProject.teamId, 10),
          startDate: newProject.startDate,
          targetDate: newProject.targetDate,
        }),
      });
      setShowForm(false);
      setNewProject({
        title: '', manager: '', teamId: '', priority: 'Medium',
        status: 'PROPOSED', phase: 'INITIATING',
        startDate: '', targetDate: '', description: '',
      });
      // Refresh projects list
      const data = await fetchWrapper('/projects');
      if (Array.isArray(data)) setProjects(data);
    } catch (err) {
      console.error('Error creating project:', err);
      setError(err.message);
    }
  };

  return (
    <div className="p-6 text-white max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold">📁 Projects</h1>
        <button
          onClick={() => setShowForm(!showForm)}
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
              Create Project
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
        {filteredProjects.map(({ projectID, title, status, phase }) => (
          <div
            key={projectID}
            className="bg-zinc-800/70 p-6 rounded-xl shadow-subtle border border-white/10 hover:bg-zinc-700/60 cursor-pointer flex items-center justify-between"
            onClick={() => navigate(`/projects/${projectID}`)}
          >
            <div>
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <p className="text-sm text-zinc-400">Status: {status}</p>
              <p className="text-sm text-zinc-400">Phase: {phase}</p>
            </div>
            {iconMap.default}
          </div>
        ))}
      </div>
    </div>
  );
}