import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ServerError = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center bg-zinc-950 text-white px-4"
    >
      <div className="bg-zinc-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-10 text-center max-w-md shadow-subtle space-y-6">
        <motion.h1
          className="text-7xl font-extrabold text-red-500 tracking-tight drop-shadow"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          500
        </motion.h1>

        <p className="text-zinc-400 text-lg leading-relaxed">
          Something went wrong on our end. Please try again later.
        </p>

        <div className="flex justify-center gap-4 pt-2">
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 bg-zinc-800 hover:bg-zinc-700 border border-white/10 rounded-lg text-sm font-medium transition shadow-sm"
            aria-label="Reload the page"
          >
            🔄 Try Again
          </button>

          <Link
            to="/dashboard"
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/20 rounded-lg text-sm font-medium transition shadow-sm"
            aria-label="Go back to dashboard"
          >
            ⬅ Back to Dashboard
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ServerError;
