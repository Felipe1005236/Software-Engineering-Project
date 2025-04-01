import { motion } from 'framer-motion';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const priorityColors = {
  High: 'bg-red-600',
  Medium: 'bg-yellow-500',
  Low: 'bg-green-600',
};

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const goToTasks = () => {
    const encodedName = encodeURIComponent(project.name);
    navigate(`/projects/${encodedName}/tasks`);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-zinc-800/60 backdrop-blur-lg p-5 rounded-2xl border border-white/10 shadow-subtle transition-all relative group cursor-pointer"
      onClick={goToTasks}
    >
      {/* Top section */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-semibold text-white group-hover:underline tracking-tight">
            {project.name}
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">Priority</p>
        </div>
        <span
          className={`text-xs px-2 py-1 rounded-full ${priorityColors[project.priority]} text-white`}
        >
          {project.priority}
        </span>
      </div>

      {/* Details */}
      <p className="text-zinc-400 text-sm mb-2">Status: {project.status}</p>
      <p className="text-zinc-400 text-sm mb-4 truncate">Team: {project.members.join(', ')}</p>

      {/* Edit/Delete Controls */}
      <div
        className="flex gap-3 absolute bottom-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => onEdit(project)}
          className="text-indigo-400 hover:text-indigo-300 text-sm"
        >
          <FaEdit />
        </button>
        <button
          onClick={() => onDelete(project)}
          className="text-red-500 hover:text-red-400 text-sm"
        >
          <FaTrash />
        </button>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
