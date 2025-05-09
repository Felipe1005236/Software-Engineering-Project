import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaClipboardList, FaPlus } from 'react-icons/fa';

const iconMap = {
  default: <FaClipboardList className="text-blue-400 text-2xl" />,
};

// Use the Docker container name for the backend
const API_BASE_URL = 'http://localhost:3000/api';

export default function ProjectDashboard() {
  const [search, setSearch] = useState('');
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    manager: '',
    category: '',
    priority: 'Medium',
    status: 'PROPOSED',
    phase: 'INITIATING',
    startDate: '',
    targetDate: '',
    description: '',
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/projects`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setProjects(data);
        } else {
          console.error('API response is not an array:', data);
          setProjects([]);
        }
      })
      .catch(err => {
        console.error('Error fetching projects:', err);
        setError(err.message);
        setProjects([]);
      });
  }, []);

  const filteredProjects = projects.filter((p) =>
    p.title?.toLowerCase().includes(search.toLowerCase())
  );

  const activeProjects = filteredProjects.filter(p => !p.archived);
  const archivedProjects = filteredProjects.filter(p => p.archived);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // You may want to POST to your backend here instead
    const newEntry = {
      ...newProject,
      projectID: Date.now(),
      archived: false,
    };
    setProjects(prev => [...prev, newEntry]);
    setShowForm(false);
    setNewProject({
      title: '', manager: '', category: '', priority: 'Medium',
      status: 'PROPOSED', phase: 'INITIATING',
      startDate: '', targetDate: '', description: '',
    });
    navigate(`/projects/${newEntry.projectID}`);
  };

  const handleUnarchive = (projectID) => {
    setProjects(prev => prev.map(p =>
      p.projectID === projectID ? { ...p, status: 'PROPOSED' } : p
    ));
  };

  if (error) {
    return (
      <div className="p-6 text-white">
        <h1 className="text-3xl font-bold mb-6">Projects</h1>
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-400">Error loading projects: {error}</p>
          <p className="text-sm text-red-400 mt-2">Please ensure the backend container is running and accessible at {API_BASE_URL}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 text-white">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Project Dashboard</h1>
        <button
          onClick={() => setShowForm(f => !f)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg"
        >
          <FaPlus className="w-4 h-4" />
          {showForm ? 'Close Form' : 'New Project'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-zinc-900/80 p-6 rounded-xl border border-white/10 mb-12 space-y-5 shadow-subtle">
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
              <label className="block text-sm text-zinc-400 mb-1">Manager</label>
              <input
                type="text"
                value={newProject.manager}
                onChange={(e) => setNewProject({ ...newProject, manager: e.target.value })}
                className="w-full p-2 rounded bg-zinc-800 text-white border border-white/10"
              />
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
              <label className="block text-sm text-zinc-400 mb-1">Category</label>
              <input
                type="text"
                value={newProject.category}
                onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                className="w-full p-2 rounded bg-zinc-800 text-white border border-white/10"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Priority</label>
              <select
                value={newProject.priority}
                onChange={(e) => setNewProject({ ...newProject, priority: e.target.value })}
                className="w-full p-2 rounded bg-zinc-800 text-white border border-white/10"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
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
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Description</label>
            <textarea
              rows={3}
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              className="w-full p-2 rounded bg-zinc-800 text-white border border-white/10"
            />
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
        {activeProjects.map(({ projectID, title, status, phase }) => (
          <div
            key={projectID}
            className="bg-zinc-800/70 p-6 rounded-xl shadow-subtle border border-white/10 hover:bg-zinc-700/60 cursor-pointer flex items-center justify-between"
            onClick={() => navigate(`/projects/${projectID}`)}
          >
            <div className="flex flex-col">
              <span className="text-lg font-medium text-white">{title}</span>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-zinc-400">Status: {status}</span>
                <span className="text-sm text-zinc-400">Phase: {phase}</span>
              </div>
            </div>
            {iconMap.default}
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4 text-zinc-300">📦 Archived Projects</h2>
        {archivedProjects.length === 0 ? (
          <div className="text-zinc-500 italic">No archived projects.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {archivedProjects.map(({ projectID, title, status, phase }) => (
              <div
                key={projectID}
                className="bg-zinc-700/70 p-6 rounded-xl shadow-subtle border border-white/10 hover:bg-zinc-600/60 cursor-pointer flex flex-col justify-between"
              >
                <div onClick={() => navigate(`/projects/${projectID}`)} className="flex-1 cursor-pointer">
                  <h3 className="text-lg font-semibold text-white">{title}</h3>
                  <p className="text-sm text-zinc-400">Status: {status}</p>
                  <p className="text-sm text-zinc-400">Phase: {phase}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnarchive(projectID);
                  }}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
                >
                  Unarchive
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}