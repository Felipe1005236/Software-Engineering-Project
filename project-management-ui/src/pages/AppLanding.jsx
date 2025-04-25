import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const sentence = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.5,
      staggerChildren: 0.1,
    },
  },
};

const word = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white font-sans relative">

    {/* App name in top-left */}
<div className="absolute top-6 left-6 text-2xl font-bold tracking-tight">
  ⚡ PLUMP
</div>

{/* Login button in top-right */}
<div className="absolute top-6 right-6">
  <Link to="/login">
    <button className="border border-white px-4 py-2 rounded-full text-sm font-medium hover:bg-white hover:text-black transition">
      Log In
    </button>
  </Link>
</div>

      {/* Hero Content */}
      <div className="flex items-center justify-center min-h-screen px-6">
        <div className="max-w-2xl text-center">
          {/* Animated Headline */}
          <motion.h1
            className="text-5xl md:text-6xl font-bold leading-tight mb-6"
            variants={sentence}
            initial="hidden"
            animate="visible"
          >
            {"Organize your time and workflow".split(" ").map((wordText, i) => (
              <motion.span key={i} variants={word} className="inline-block mr-2">
                {wordText}
              </motion.span>
            ))}
          </motion.h1>

          {/* Subtext */}
          <p className="text-gray-400 text-lg mb-10">
            Build focus, manage your team, and track progress in one clean interface.
          </p>

          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {/* Link to Pricing Page */}
            <Link to="/pricing">
              <button className="bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition">
                Get Started
              </button>
            </Link>

            {/* Link to Learn More Page */}
            <Link to="/learn">
              <button className="border border-white px-6 py-3 rounded-full font-medium hover:bg-white hover:text-black transition">
                Learn More
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}