import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="bg-zinc-800/60 backdrop-blur-lg border border-white/10 rounded-2xl p-5 shadow-subtle hover:shadow-lg transition-all duration-300 group"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-zinc-400 group-hover:text-white transition-colors">{title}</span>
        <div className="text-indigo-400 text-lg">{icon}</div>
      </div>
      <div className="text-3xl font-bold tracking-tight text-white group-hover:text-indigo-400 transition-colors">
        {value}
      </div>
    </motion.div>
  );
};

export default StatCard;
