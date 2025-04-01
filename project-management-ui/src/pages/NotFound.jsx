import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center bg-zinc-950 text-white px-4"
    >
      <div className="bg-zinc-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-10 text-center max-w-md shadow-subtle space-y-6">
        <motion.h1
          className="text-7xl font-extrabold text-indigo-500 tracking-tight"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          404
        </motion.h1>

        <p className="text-zinc-400 text-lg">
          Oops! The page you're looking for doesn't exist.
        </p>

        <Link
          to="/dashboard"
          className="inline-block px-5 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition text-sm font-medium shadow-md"
        >
          ← Go back to Dashboard
        </Link>
      </div>
    </motion.div>
  );
};

export default NotFound;
