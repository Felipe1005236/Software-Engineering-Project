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
        {
          firstName: 'Saim',
          lastName: 'Malik',
          email: 'saim@example.com',
          primaryRole: 'USER',
          type: 'INTERNAL',
          unit: 'Frontend',
          unitManager: 'Nora',
          status: 'Online',
        },
        {
          firstName: 'Stefan',
          lastName: 'Mojseov',
          email: 'stefan@example.com',
          primaryRole: 'ADMIN',
          type: 'INTERNAL',
          unit: 'Backend',
          unitManager: 'Mark',
          status: 'Idle',
        },
        {
          firstName: 'Milicia',
          lastName: 'Tadic',
          email: 'milicia@example.com',
          primaryRole: 'MANAGER',
          type: 'EXTERNAL',
          unit: 'UX',
          unitManager: 'Tina',
          status: 'Offline',
        },
      ]);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail || !newRole) return;
    setStatus({ loading: true, message: '', error: '' });

    const newMember = {
      firstName: inviteEmail.split('@')[0],
      lastName: '',
      email: inviteEmail,
      primaryRole: newRole,
      type: 'INTERNAL',
      unit: '',
      unitManager: '',
      status: 'Pending',
    };
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
    `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.primaryRole.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-10 text-white">
      <motion.div className="flex justify-between items-center" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
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

      <input
        type="text"
        placeholder="Search team..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full bg-zinc-900/60 backdrop-blur-md border border-white/10 text-sm p-2 rounded-xl shadow-subtle"
      />

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
            className="bg-zinc-900/60 backdrop-blur-md p-5 rounded-xl border border-white/10 shadow-subtle transition"
          >
            <h2 className="text-lg font-semibold">{member.firstName} {member.lastName}</h2>
            <p className="text-zinc-400 text-sm">{member.email}</p>
            <p className="text-zinc-400 text-sm">Role: {member.primaryRole}</p>
            <p className="text-zinc-400 text-sm">Type: {member.type}</p>
            <p className="text-zinc-400 text-sm">Unit: {member.unit}</p>
            <p className="text-zinc-400 text-sm">Manager: {member.unitManager}</p>
            <span className={`inline-block mt-2 px-2 py-0.5 text-xs rounded-full text-white ${
              member.status === 'Online' ? 'bg-green-600'
              : member.status === 'Idle' ? 'bg-yellow-500'
              : member.status === 'Pending' ? 'bg-blue-600'
              : 'bg-zinc-700'
            }`}>
              {member.status}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Team;