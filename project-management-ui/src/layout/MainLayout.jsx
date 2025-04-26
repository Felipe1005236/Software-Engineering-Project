import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const MainLayout = () => {
  return (
    <div className="flex h-screen text-white font-sans bg-gradient-to-br from-zinc-900 via-black to-zinc-950">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6 backdrop-blur-xl bg-zinc-900/40 border-l border-white/5 shadow-inner rounded-tl-2xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
