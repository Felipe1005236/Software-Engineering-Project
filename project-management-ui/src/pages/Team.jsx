import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchWrapper } from '../utils/fetchWrapper';
import { FaCircle, FaPlus } from 'react-icons/fa';
import { useUser } from '../contexts/UserContext';


const Team = () => {
  const { user, loading: userLoading } = useUser();
  const [units, setUnits] = useState([]);
  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [unitForm, setUnitForm] = useState({ name: '', description: '' });
  const [unitStatus, setUnitStatus] = useState({ loading: false, message: '', error: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [newRole, setNewRole] = useState('');
  const [status, setStatus] = useState({ loading: false, message: '', error: '' });

  useEffect(() => {
    if (!userLoading && user && user.unit && user.unit.organizationID) {
      console.log('Token:', localStorage.getItem('token'));
      console.log('User:', user);
      fetchUnits(user.unit.organizationID);
    }
  }, [userLoading, user]);

  const fetchUnits = async (orgId) => {
    try {
      console.log('Fetching units for org:', orgId);
      const data = await fetchWrapper(`/units/organization/${orgId}`);
      console.log('Units data:', data);
      setUnits(data);
      setTeams([]);
      setMembers([]);
      setSelectedUnit(null);
      setSelectedTeam(null);
    } catch (err) {
      console.error('Error fetching units:', err);
      setUnits([]);
    }
  };

  const handleUnitClick = async (unit) => {
    setSelectedUnit(unit);
    setSelectedTeam(null);
    setMembers([]);
    try {
      const data = await fetchWrapper(`/units/${unit.unitID}/teams`);
      setTeams(data);
    } catch (err) {
      setTeams([]);
    }
  };

  const handleTeamClick = async (team) => {
    setSelectedTeam(team);
    try {
      const data = await fetchWrapper(`/team-memberships/team/${team.teamID}`);
      setMembers(data.map(m => m.user));
    } catch (err) {
      setMembers([]);
    }
  };

  const handleUnitFormChange = (e) => {
    const { name, value } = e.target;
    setUnitForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUnit = async (e) => {
    e.preventDefault();
    if (!unitForm.name.trim()) {
      setUnitStatus({ loading: false, message: '', error: 'Unit name is required.' });
      return;
    }
    setUnitStatus({ loading: true, message: '', error: '' });
    try {
      await fetchWrapper('/units', {
        method: 'POST',
        body: JSON.stringify({ name: unitForm.name, description: unitForm.description }),
      });
      setUnitStatus({ loading: false, message: 'Unit created!', error: '' });
      setUnitForm({ name: '', description: '' });
      fetchUnits(user.unit.organizationID);
    } catch (err) {
      setUnitStatus({ loading: false, message: '', error: 'Failed to create unit.' });
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
    setMembers((prev) => [...prev, newMember]);
    setInviteEmail('');
    setNewRole('');

    try {
      await fetchWrapper('/team/invite', {
        method: 'POST',
        body: JSON.stringify({ email: inviteEmail, role: newRole }),
      });
      setStatus({ loading: false, message: 'Invite sent!', error: '' });
    } catch (err) {
      console.error('Invite failed:', err);
      setStatus({ loading: false, message: '', error: 'Failed to send invite.' });
    }
  };

  const filteredTeam = members.filter((member) =>
    `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.primaryRole.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-10 text-white">
      <motion.div className="mb-10" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-4">🏢 Units</h1>
        <form onSubmit={handleAddUnit} className="flex flex-col sm:flex-row items-center gap-2 bg-zinc-900/60 border border-white/10 backdrop-blur-md p-3 rounded-xl shadow-subtle mb-4">
          <input
            type="text"
            name="name"
            placeholder="Unit name"
            value={unitForm.name}
            onChange={handleUnitFormChange}
            className="bg-zinc-800 border border-zinc-700 text-sm p-2 rounded w-48"
          />
          <input
            type="text"
            name="description"
            placeholder="Description (optional)"
            value={unitForm.description}
            onChange={handleUnitFormChange}
            className="bg-zinc-800 border border-zinc-700 text-sm p-2 rounded w-64"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-sm px-3 py-2 rounded text-white transition"
            disabled={unitStatus.loading}
          >
            {unitStatus.loading ? 'Adding...' : <><FaPlus className="inline" /> Add Unit</>}
          </button>
        </form>
        {unitStatus.message && <p className="text-green-400 text-sm mb-2">{unitStatus.message}</p>}
        {unitStatus.error && <p className="text-red-400 text-sm mb-2">{unitStatus.error}</p>}
        <div className="flex gap-4 flex-wrap">
          {units.map(unit => (
            <button
              key={unit.unitID}
              onClick={() => handleUnitClick(unit)}
              className={`px-4 py-2 rounded ${selectedUnit?.unitID === unit.unitID ? 'bg-indigo-600' : 'bg-zinc-800'}`}
            >
              {unit.name}
            </button>
          ))}
        </div>
      </motion.div>

      {teams.length > 0 && (
        <>
          <h2 className="text-xl font-bold mt-6">👥 Teams in {selectedUnit?.name}</h2>
          <div className="flex gap-4 flex-wrap">
            {teams.map(team => (
              <button
                key={team.teamID}
                onClick={() => handleTeamClick(team)}
                className={`px-4 py-2 rounded ${selectedTeam?.teamID === team.teamID ? 'bg-indigo-400' : 'bg-zinc-700'}`}
              >
                {team.name}
              </button>
            ))}
          </div>
        </>
      )}

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