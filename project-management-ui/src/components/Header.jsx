import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 px-6 flex items-center justify-between border-b border-white/10 bg-zinc-900/60 backdrop-blur-md shadow-md z-50">
      <h2 className="text-sm sm:text-base font-medium tracking-wide text-zinc-200 hover:text-white transition">
        Welcome, {user?.firstName || 'User'} 👋
      </h2>
      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-500 text-white text-sm font-medium px-4 py-1.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;
