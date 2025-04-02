import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchWrapper } from '../utils/fetchWrapper';
import { FaCircle, FaPlus } from 'react-icons/fa';

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [newRole, setNewRole] = useState('');
  const [status, setStatus] = useState({ loading: false, message: '', error: '' });

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const data = await fetchWrapper('/api/team');
      setTeamMembers(data);
    } catch (err) {
      console.warn('Using fallback team. Backend offline.');
      setTeamMembers([
        { name: 'Saim Malik', role: 'Frontend Developer', status: 'Online' },
        { name: 'Stefan', role: 'Backend Lead', status: 'Idle' },
        { name: 'Milicia', role: 'UX Designer', status: 'Offline' },
        { name: 'Bisera', role: 'DevOps Engineer', status: 'Online' },
      ]);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail || !newRole) return;
    setStatus({ loading: true, message: '', error: '' });

    const newMember = { name: inviteEmail.split('@')[0], role: newRole, status: 'Pending' };
    setTeamMembers((prev) => [...prev, newMember]);
    setInviteEmail('');
    setNewRole('');

    try {
      await fetchWrapper('/api/team/invite', 'POST', { email: inviteEmail, role: newRole });
      setStatus({ loading: false, message: 'Invite sent!', error: '' });
    } catch (err) {
      console.error('Invite failed:', err);
      setStatus({ loading: false, message: '', error: 'Failed to send invite.' });
    }
  };

  const filteredTeam = teamMembers.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-10 text-white">
      {/* Header */}
      <motion.div
        className="flex justify-between items-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold">👥 Team Members</h1>

        <form
          onSubmit={handleInvite}
          className="flex flex-col sm:flex-row items-center gap-2 bg-zinc-900/60 border border-white/10 backdrop-blur-md p-3 rounded-xl shadow-subtle"
        >
          <input
            type="email"
            placeholder="Invite by email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 text-sm p-2 rounded w-48"
          />
          <input
            type="text"
            placeholder="Assign Role"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 text-sm p-2 rounded w-36"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-sm px-3 py-2 rounded text-white transition"
            disabled={status.loading}
          >
            {status.loading ? 'Inviting...' : <><FaPlus className="inline" /> Invite</>}
          </button>
        </form>
      </motion.div>

      {status.message && <p className="text-green-400 text-sm">{status.message}</p>}
      {status.error && <p className="text-red-400 text-sm">{status.error}</p>}

      {/* Search */}
      <input
        type="text"
        placeholder="Search team..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full bg-zinc-900/60 backdrop-blur-md border border-white/10 text-sm p-2 rounded-xl shadow-subtle"
      />

      {/* Team Cards */}
      <motion.div
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        initial="hidden"
        animate="visible"
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } }}
      >
        {filteredTeam.map((member, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.02 }}
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            className="bg-zinc-900/60 backdrop-blur-md p-5 rounded-xl border border-white/10 shadow-subtle flex justify-between items-start transition"
          >
            <div>
              <h2 className="text-lg font-semibold text-white">{member.name}</h2>
              <p className="text-zinc-400 text-sm">{member.role}</p>
            </div>
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium text-white ${
                member.status === 'Online'
                  ? 'bg-green-600'
                  : member.status === 'Idle'
                  ? 'bg-yellow-500'
                  : member.status === 'Pending'
                  ? 'bg-blue-600'
                  : 'bg-zinc-700'
              }`}
            >
              {member.status}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Team;
