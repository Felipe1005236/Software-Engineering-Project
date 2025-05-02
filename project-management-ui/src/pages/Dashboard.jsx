import { useEffect, useState } from 'react';
import { FaTasks, FaCheckCircle, FaSpinner, FaFire, FaPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';
import StatCard from '../components/StatCard';
import { fetchWrapper } from '../utils/fetchWrapper';
import { Link } from 'react-router-dom';
const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [teamStatus, setTeamStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  const icons = {
    tasks: <FaTasks />, completed: <FaCheckCircle />, progress: <FaSpinner />, priority: <FaFire />,
  };

  useEffect(() => {
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
          <FaPlus /> Refresh
        </button>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {stats.map((stat, i) => (
          <StatCard
            key={i}
            title={stat.title}
            value={stat.value}
            icon={icons[stat.icon] || <FaTasks />}
          />
        ))}
      </motion.div>

      <motion.div
        className="space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold">Recent Activity</h2>
        <ul className="space-y-2 text-sm text-zinc-300 bg-zinc-800/60 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-subtle">
          {recentActivity.map((item, i) => (
            <li key={i} className="flex justify-between border-b border-white/5 pb-1 last:border-none">
              <span>{item.emoji} {item.text}</span>
              <span className="text-xs text-zinc-500">{item.time}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-xl font-semibold">Team Status</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamStatus.map((member, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className="bg-zinc-800/60 backdrop-blur p-4 rounded-xl border border-white/10 flex justify-between items-center shadow-subtle transition"
            >
              <div>
                <h3 className="font-semibold text-white">{member.name}</h3>
                <p className="text-zinc-400 text-sm">Tasks: {member.tasks}</p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium text-white ${
                  member.status === 'Online'
                    ? 'bg-green-600'
                    : member.status === 'Idle'
                    ? 'bg-yellow-500'
                    : 'bg-zinc-600'
                }`}
              >
                {member.status}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
