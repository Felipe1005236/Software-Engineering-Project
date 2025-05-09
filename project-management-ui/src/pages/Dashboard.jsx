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

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const data = await fetchWrapper('/api/dashboard');
      setStats(data.stats || []);
      setRecentActivity(data.activity || []);
      setTeamStatus(data.team || []);
    } catch (err) {
      const fallbackData = {
        stats: [
          { title: 'Total Tasks', value: 128, icon: 'tasks' },
          { title: 'Completed', value: 96, icon: 'completed' },
          { title: 'In Progress', value: 24, icon: 'progress' },
          { title: 'High Priority', value: 8, icon: 'priority' },
        ],
        activity: [
          { emoji: '✅', text: 'Milicia completed "Set up backend auth"', time: '2h ago' },
          { emoji: '⚠️', text: 'Stefan updated priority for "Apollo"', time: '4h ago' },
          { emoji: '🗓️', text: 'Bisera created "Client feedback review"', time: 'Yesterday' },
          { emoji: '💬', text: 'Saim commented on "Task view redesign"', time: '2 days ago' },
        ],
        team: [
          { name: 'Alice', status: 'Online', tasks: 5 },
          { name: 'Javier', status: 'Idle', tasks: 2 },
          { name: 'Kavya', status: 'Offline', tasks: 7 },
        ],
      };
      setStats(fallbackData.stats);
      setRecentActivity(fallbackData.activity);
      setTeamStatus(fallbackData.team);
    }
    setLoading(false);
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();

    if (!searchQuery.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/search?searchTerm=${encodeURIComponent(searchQuery)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setSearchResults(data);
      console.log('Search results:', data);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  return (
    <div className="p-6 space-y-10 text-white">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch(e);
            }}
            className="w-full max-w-md px-4 py-2 bg-zinc-800 text-white border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-zinc-400"
          />
          {/* ✅ Search results appear here */}
          {searchResults && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-zinc-800 border border-white/10 rounded-xl p-4 mt-2 w-full max-w-2xl space-y-4 text-sm"
            >
              <h2 className="text-lg font-semibold text-white">🔍 Search Results</h2>

              {searchResults.projects?.length > 0 && (
                <div>
                  <h3 className="font-medium text-indigo-400">Projects</h3>
                  <ul className="list-disc list-inside text-zinc-300">
                  {searchResults.projects.map((project, i) => (
                   <li key={`proj-${i}`}>
                     <Link to="/projects" className="text-indigo-400 hover:underline">
                        {project.title}
                    </Link>
                   </li>
                  ))}
                  </ul>
                </div>
              )}

              {searchResults.tasks?.length > 0 && (
                <div>
                  <h3 className="font-medium text-indigo-400">Tasks</h3>
                  <ul className="list-disc list-inside text-zinc-300">
                  {searchResults.tasks.map((task, i) => (
                    <li key={`task-${i}`}>
                      <Link
                        to={`/projects/${task.project?.title || 'unknown'}/tasks/${task.taskID}`}
                        className="text-indigo-400 hover:underline"
                      >
                      {task.title}
                      </Link>
                     </li>
                  ))}
                  </ul>
                </div>
              )}

              {searchResults.users?.length > 0 && (
                <div>
                  <h3 className="font-medium text-indigo-400">Users</h3>
                  <ul className="list-disc list-inside text-zinc-300">
                  {searchResults.users.map((user, i) => (
                     <li key={`user-${i}`}>
                      <Link to="/team" className="text-indigo-400 hover:underline">
                         {user.firstName} {user.lastName} ({user.email})
                      </Link>
                    </li>
                  ))}
                  </ul>
                </div>
              )}

              {searchResults.projects?.length === 0 &&
                searchResults.tasks?.length === 0 &&
                searchResults.users?.length === 0 && (
                  <p className="text-zinc-400">No results found.</p>
              )}
            </motion.div>
          )}
        </div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={fetchDashboardData}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-800/60 backdrop-blur border border-white/10 rounded-lg hover:bg-zinc-700/60 transition shadow-soft"

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
