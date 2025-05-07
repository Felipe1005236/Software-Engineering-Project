import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaClipboardList } from 'react-icons/fa';

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
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Projects</h1>

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
    </div>
  );
}