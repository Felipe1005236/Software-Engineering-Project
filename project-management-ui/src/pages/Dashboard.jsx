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

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    plannedProjects: 0
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all projects
        const response = await fetch(`${API_BASE_URL}/projects`, fetchOptions);
        if (!response.ok) throw new Error('Failed to fetch projects');
        const projects = await response.json();

        // Calculate statistics
        const stats = {
          totalProjects: projects.length,
          activeProjects: projects.filter(p => p.status === 'ACTIVE').length,
          completedProjects: projects.filter(p => p.status === 'COMPLETED').length,
          plannedProjects: projects.filter(p => p.status === 'PLANNED').length
        };

        // Sort projects by date (most recent first) and take the first 5
        const recent = [...projects]
          .sort((a, b) => new Date(b.dates?.startDate || 0) - new Date(a.dates?.startDate || 0))
          .slice(0, 5);

        setStats(stats);
        setRecentProjects(recent);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="p-6 text-white">Loading...</div>;
  if (error) return <div className="p-6 text-white text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 space-y-10 text-white">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-800/60 backdrop-blur border border-white/10 p-4 rounded-lg shadow-subtle">
          <div className="flex items-center">
            <FaClipboardList className="text-blue-400 text-2xl mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-zinc-300">Total Projects</h3>
              <p className="text-2xl font-bold text-white">{stats.totalProjects}</p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-800/60 backdrop-blur border border-white/10 p-4 rounded-lg shadow-subtle">
          <div className="flex items-center">
            <FaChartLine className="text-green-400 text-2xl mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-zinc-300">Active Projects</h3>
              <p className="text-2xl font-bold text-white">{stats.activeProjects}</p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-800/60 backdrop-blur border border-white/10 p-4 rounded-lg shadow-subtle">
          <div className="flex items-center">
            <FaCalendarAlt className="text-purple-400 text-2xl mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-zinc-300">Planned Projects</h3>
              <p className="text-2xl font-bold text-white">{stats.plannedProjects}</p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-800/60 backdrop-blur border border-white/10 p-4 rounded-lg shadow-subtle">
          <div className="flex items-center">
            <FaUsers className="text-orange-400 text-2xl mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-zinc-300">Completed Projects</h3>
              <p className="text-2xl font-bold text-white">{stats.completedProjects}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="bg-zinc-800/60 backdrop-blur border border-white/10 rounded-lg shadow-subtle p-4">
        <h2 className="text-xl font-bold mb-4 text-white">Recent Projects</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Phase</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Team</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {recentProjects.map((project) => (
                <tr key={project.projectID} className="hover:bg-zinc-700/60 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={`/projects/${project.projectID}`} className="text-blue-400 hover:text-blue-300">
                      {project.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${project.status === 'ACTIVE' ? 'bg-green-900/50 text-green-400' : 
                        project.status === 'COMPLETED' ? 'bg-blue-900/50 text-blue-400' : 
                        'bg-yellow-900/50 text-yellow-400'}`}>
                      {project.status}
                    </span>
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