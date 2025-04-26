import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaHome,
  FaProjectDiagram,
  FaCalendarAlt,
  FaUsers,
  FaCogs,
  FaUserTie,
  FaBars,
  FaTimes,
} from 'react-icons/fa';
import { useState } from 'react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: <FaHome /> },
  { name: 'Projects', path: '/projects', icon: <FaProjectDiagram /> },
  { name: 'Calendar', path: '/calendar', icon: <FaCalendarAlt /> },
  { name: 'Team', path: '/team', icon: <FaUsers /> },
  { name: 'Settings', path: '/settings', icon: <FaCogs /> },
  { name: 'Stakeholders', path: '/stakeholders', icon: <FaUserTie /> },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      initial={{ width: collapsed ? 64 : 260 }}
      animate={{ width: collapsed ? 64 : 260 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className="h-full bg-zinc-900/70 backdrop-blur-md border-r border-white/10 p-4 flex flex-col relative shadow-subtle"
    >
      {/* Toggle button */}
      <button
        onClick={() => setCollapsed((prev) => !prev)}
        className="absolute top-4 right-4 text-zinc-400 hover:text-white text-sm"
        aria-label="Toggle sidebar"
      >
        {collapsed ? <FaBars /> : <FaTimes />}
      </button>

      {/* Title */}
      {!collapsed && (
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-extrabold mb-10 tracking-wide text-white"
        >
          ⚡ PLUMP
        </motion.h1>
      )}

      {/* Navigation */}
      <nav className="space-y-2 mt-12 flex-1">
        {navItems.map(({ name, path, icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                isActive
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-zinc-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <span className="text-lg">{icon}</span>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.05 }}
                className="truncate"
              >
                {name}
              </motion.span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-zinc-500 mt-auto pt-6 pl-1"
        >
          v1.0.0
        </motion.p>
      )}
    </motion.aside>
  );
};

export default Sidebar;
