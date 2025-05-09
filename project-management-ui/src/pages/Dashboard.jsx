import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaClipboardList, FaUsers, FaChartLine, FaCalendarAlt } from 'react-icons/fa';

const API_BASE_URL = 'http://localhost:3000/api';
const fetchOptions = {
  method: 'GET',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

const PHASE_GROUPS = {
  PLANNED: ['INITIATING', 'PLANNING'],
  ACTIVE: ['EXECUTING'],
  COMPLETED: ['MONITORING_CONTROLLING'],
  ALL: []
};

const Dashboard = () => {
  const [allProjects, setAllProjects] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('ALL');
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    plannedProjects: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_BASE_URL}/projects`, fetchOptions);
        if (!response.ok) throw new Error('Failed to fetch projects');
        const projects = await response.json();
        setAllProjects(projects);
        setStats({
          totalProjects: projects.length,
          plannedProjects: projects.filter(p => PHASE_GROUPS.PLANNED.includes(p.phase)).length,
          activeProjects: projects.filter(p => PHASE_GROUPS.ACTIVE.includes(p.phase)).length,
          completedProjects: projects.filter(p => PHASE_GROUPS.COMPLETED.includes(p.phase)).length
        });
      } catch (err) {
        setError(err.message);
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const filteredProjects = selectedGroup === 'ALL'
    ? allProjects
    : allProjects.filter(p => PHASE_GROUPS[selectedGroup].includes(p.phase));

  if (loading) return <div className="p-6 text-white">Loading...</div>;
  if (error) return <div className="p-6 text-white text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 space-y-10 text-white">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className={`cursor-pointer bg-zinc-800/60 backdrop-blur border border-white/10 p-4 rounded-lg shadow-subtle ${selectedGroup === 'ALL' ? 'ring-2 ring-blue-400' : ''}`}
          onClick={() => setSelectedGroup('ALL')}
        >
          <div className="flex items-center">
            <FaClipboardList className="text-blue-400 text-2xl mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-zinc-300">Total Projects</h3>
              <p className="text-2xl font-bold text-white">{stats.totalProjects}</p>
            </div>
          </div>
        </div>
        <div
          className={`cursor-pointer bg-zinc-800/60 backdrop-blur border border-white/10 p-4 rounded-lg shadow-subtle ${selectedGroup === 'ACTIVE' ? 'ring-2 ring-green-400' : ''}`}
          onClick={() => setSelectedGroup('ACTIVE')}
        >
          <div className="flex items-center">
            <FaChartLine className="text-green-400 text-2xl mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-zinc-300">Active Projects</h3>
              <p className="text-2xl font-bold text-white">{stats.activeProjects}</p>
            </div>
          </div>
        </div>
        <div
          className={`cursor-pointer bg-zinc-800/60 backdrop-blur border border-white/10 p-4 rounded-lg shadow-subtle ${selectedGroup === 'PLANNED' ? 'ring-2 ring-purple-400' : ''}`}
          onClick={() => setSelectedGroup('PLANNED')}
        >
          <div className="flex items-center">
            <FaCalendarAlt className="text-purple-400 text-2xl mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-zinc-300">Planned Projects</h3>
              <p className="text-2xl font-bold text-white">{stats.plannedProjects}</p>
            </div>
          </div>
        </div>
        <div
          className={`cursor-pointer bg-zinc-800/60 backdrop-blur border border-white/10 p-4 rounded-lg shadow-subtle ${selectedGroup === 'COMPLETED' ? 'ring-2 ring-orange-400' : ''}`}
          onClick={() => setSelectedGroup('COMPLETED')}
        >
          <div className="flex items-center">
            <FaUsers className="text-orange-400 text-2xl mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-zinc-300">Completed Projects</h3>
              <p className="text-2xl font-bold text-white">{stats.completedProjects}</p>
            </div>
          </div>
        </div>
      </div>
      {/* Filtered Projects Table */}
      <div className="bg-zinc-800/60 backdrop-blur border border-white/10 rounded-lg shadow-subtle p-4">
        <h2 className="text-xl font-bold mb-4 text-white">{selectedGroup === 'ALL' ? 'Recent Projects' : 'Filtered Projects'}</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Phase</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Team</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredProjects.map((project) => (
                <tr key={project.projectID} className="hover:bg-zinc-700/60 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={`/projects/${project.projectID}`} className="text-blue-400 hover:text-blue-300">
                      {project.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">
                    {project.phase || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">
                    {project.dates?.startDate ? new Date(project.dates.startDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">
                    {project.team?.name || 'Not assigned'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;