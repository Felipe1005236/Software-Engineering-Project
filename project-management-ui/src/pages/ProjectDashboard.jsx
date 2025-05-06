import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaClipboardList } from 'react-icons/fa';

const iconMap = {
  default: <FaClipboardList className="text-blue-400 text-2xl" />,
};

export default function ProjectDashboard() {
  const [search, setSearch] = useState('');
  const [projects, setProjects] = useState([]); // <-- Will hold project list from API
  const navigate = useNavigate();

  // TODO: Replace this mock fetch with actual API call to GET /api/projects
  useEffect(() => {
    // Example/mock data
    const mockProjects = [
      { id: 1, name: 'Website Redesign', count: 5 },
      { id: 2, name: 'Mobile App Launch', count: 8 },
      { id: 3, name: 'Marketing Campaign', count: 3 },
    ];
    setProjects(mockProjects);

    // Example for future:
    // fetch('/api/projects')
    //   .then(res => res.json())
    //   .then(data => setProjects(data));
  }, []);

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Projects</h1>

      <input
        type="text"
        placeholder="Search"
        className="w-full bg-zinc-900 border border-white/10 rounded-lg p-3 mb-8 placeholder-zinc-400"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredProjects.map(({ id, name, count }) => (
          <div
            key={id}
            className="bg-zinc-800/70 p-6 rounded-xl shadow-subtle border border-white/10 hover:bg-zinc-700/60 cursor-pointer flex items-center justify-between"
            onClick={() => navigate(`/projects/${id}`)}
          >
            <div className="flex flex-col">
              <span className="text-lg font-medium text-white">{name}</span>
              <span className="text-sm text-zinc-400">{count} tasks</span>
            </div>
            {iconMap.default}
          </div>
        ))}
      </div>
    </div>
  );
}