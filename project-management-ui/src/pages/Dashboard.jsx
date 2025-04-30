import { useEffect, useState } from 'react';
import { FaTasks, FaCheckCircle, FaSpinner, FaFire, FaPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';
import StatCard from '../components/StatCard';
import { fetchWrapper } from '../utils/fetchWrapper';

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [teamStatus, setTeamStatus] = useState([]);
  const [loading, setLoading] = useState(true);

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
      console.warn('Backend not available, using fallback data.');
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

  return (
    <div className="p-6 space-y-10 text-white">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-3">
            <span className="text-lg font-medium">Hello, User</span>
            <input
              type="text"
              placeholder="Search..."
              className="w-48 px-3 py-1 rounded-md text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
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