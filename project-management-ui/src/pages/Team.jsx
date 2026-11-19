import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchWrapper } from '../utils/fetchWrapper';
import { FaCircle, FaPlus, FaTimes, FaCheck, FaUserEdit, FaUserPlus, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useUser } from '../contexts/UserContext';


const Team = () => {
  const { user, loading: userLoading } = useUser();
  const [units, setUnits] = useState([]);
  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showAddUnitForm, setShowAddUnitForm] = useState(false);
  const [unitForm, setUnitForm] = useState({ 
    name: '', 
    description: '',
    newManager: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      primaryRole: 'ADMIN',
      phone: '',
      address: '',
      type: 'INTERNAL'
    }
  });
  const [unitStatus, setUnitStatus] = useState({ loading: false, message: '', error: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [teamForm, setTeamForm] = useState({ name: '' });
  const [teamStatus, setTeamStatus] = useState({ loading: false, message: '', error: '' });
  const [showAddMembersModal, setShowAddMembersModal] = useState(false);
  const [newlyCreatedTeam, setNewlyCreatedTeam] = useState(null);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState('TEAM_MEMBER');
  const [selectedAccessLevel, setSelectedAccessLevel] = useState('READ_ONLY');
  const [showUserForm, setShowUserForm] = useState(false);
  const [userForm, setUserForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    primaryRole: 'USER',
    type: 'INTERNAL',
    active: true
  });
  const [userStatus, setUserStatus] = useState({ loading: false, message: '', error: '' });

  useEffect(() => {
    console.log('userLoading:', userLoading);
    console.log('user:', user);
    console.log('user.unit:', user?.unit);
    console.log('user.unit.organizationID:', user?.unit?.organizationID);
    console.log('user.primaryRole:', user?.primaryRole);
    console.log('user.role:', user?.role);
    if (!userLoading && user && user.unit && user.unit.organizationID) {
      fetchUnits(user.unit.organizationID);
    } else if (!userLoading && (!user || !user.unit || !user.unit.organizationID)) {
      console.error('User data is incomplete:', { user, userLoading });
      setUnits([]);
      setTeams([]);
      setMembers([]);
    }
  }, [userLoading, user]);

  const fetchUnits = async (orgId) => {
    try {
      console.log('Fetching units for org:', orgId);
      const data = await fetchWrapper(`/units/organization/${orgId}`);
      console.log('Units data:', data);
      if (Array.isArray(data)) {
        setUnits(data);
      } else {
        console.error('Invalid units data received:', data);
        setUnits([]);
      }
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
    if (name.startsWith('newManager.')) {
      const field = name.split('.')[1];
      setUnitForm(prev => ({
        ...prev,
        newManager: {
          ...prev.newManager,
          [field]: value
        }
      }));
    } else {
      setUnitForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddUnit = async (e) => {
    e.preventDefault();
    if (!unitForm.name.trim()) {
      setUnitStatus({ loading: false, message: '', error: 'Unit name is required.' });
      return;
    }
    if (!user?.unit?.organizationID) {
      setUnitStatus({ loading: false, message: '', error: 'Organization ID not found.' });
      return;
    }

    setUnitStatus({ loading: true, message: '', error: '' });
    try {
      let managerID = user.userID;
      
      // If creating for a new manager, create the user first
      if (unitForm.newManager.firstName && unitForm.newManager.lastName && 
          unitForm.newManager.email && unitForm.newManager.password &&
          unitForm.newManager.phone && unitForm.newManager.address) {
        try {
          const newManager = await fetchWrapper('/user-management', {
            method: 'POST',
            body: JSON.stringify({
              firstName: unitForm.newManager.firstName,
              lastName: unitForm.newManager.lastName,
              email: unitForm.newManager.email,
              password: unitForm.newManager.password,
              phone: unitForm.newManager.phone,
              address: unitForm.newManager.address,
              primaryRole: 'ADMIN',
              type: unitForm.newManager.type,
              active: true
            }),
          });
          managerID = newManager.userID;
        } catch (err) {
          console.error('Error creating manager:', err);
          if (err.response?.message?.includes('email')) {
            setUnitStatus({ loading: false, message: '', error: 'A user with this email already exists. Please use a different email address.' });
          } else {
            setUnitStatus({ loading: false, message: '', error: 'Failed to create new manager. Please try again.' });
          }
          return;
        }
      }

      // Create the unit with the appropriate manager
      try {
        await fetchWrapper('/units', {
          method: 'POST',
          body: JSON.stringify({ 
            name: unitForm.name, 
            description: unitForm.description,
            organizationID: user.unit.organizationID,
            managerID: managerID
          }),
        });

        setUnitStatus({ loading: false, message: 'Unit created successfully!', error: '' });
        setUnitForm({ 
          name: '', 
          description: '',
          newManager: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            primaryRole: 'ADMIN',
            phone: '',
            address: '',
            type: 'INTERNAL'
          }
        });
        fetchUnits(user.unit.organizationID);
      } catch (err) {
        console.error('Error creating unit:', err);
        if (err.response?.message?.includes('already a manager')) {
          setUnitStatus({ loading: false, message: '', error: 'This user is already a manager of another unit. Please select a different manager or create a new one.' });
        } else {
          setUnitStatus({ loading: false, message: '', error: 'Failed to create unit. Please try again.' });
        }
      }
    } catch (err) {
      console.error('Failed to create unit:', err);
      setUnitStatus({ loading: false, message: '', error: 'An unexpected error occurred. Please try again.' });
    }
  };

  const filteredTeam = members.filter((member) =>
    `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.primaryRole.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTeam = async (e) => {
    e.preventDefault();
    if (!teamForm.name.trim()) {
      setTeamStatus({ loading: false, message: '', error: 'Team name is required.' });
      return;
    }
    setTeamStatus({ loading: true, message: '', error: '' });
    try {
      const team = await fetchWrapper('/teams', {
        method: 'POST',
        body: JSON.stringify({ name: teamForm.name, unitId: selectedUnit.unitID }),
      });
      setTeamStatus({ loading: false, message: 'Team created!', error: '' });
      setTeamForm({ name: '' });
      
      // Fetch available users for the unit
      const users = await fetchWrapper(`/user-management/unit/${selectedUnit.unitID}`);
      setAvailableUsers(users);
      setNewlyCreatedTeam(team);
      setShowAddMembersModal(true);
      
      // Refresh teams for this unit
      handleUnitClick(selectedUnit);
    } catch (err) {
      setTeamStatus({ loading: false, message: '', error: 'Failed to create team.' });
    }
  };

  const handleAddTeamMembers = async () => {
    try {
      // Convert selectedUsers to array if it's not already
      const userIds = Array.isArray(selectedUsers) ? selectedUsers : [selectedUsers];
      
      for (const userId of userIds) {
        await fetchWrapper('/team-memberships', {
          method: 'POST',
          body: JSON.stringify({
            userID: parseInt(userId),
            teamID: newlyCreatedTeam.teamID,
            teamRole: selectedRole,
            accessLevel: selectedAccessLevel
          })
        });
      }
      
      // Refresh the team members list
      if (selectedTeam) {
        handleTeamClick(selectedTeam);
      }
      
      setShowAddMembersModal(false);
      setSelectedUsers([]);
      setSelectedRole('TEAM_MEMBER');
      setSelectedAccessLevel('READ_ONLY');
      setNewlyCreatedTeam(null);
    } catch (err) {
      console.error('Failed to add team members:', err);
      setTeamStatus({ loading: false, message: '', error: 'Failed to add team members. Please try again.' });
    }
  };

  const handleUserFormChange = (e) => {
    const { name, value } = e.target;
    setUserForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!userForm.firstName || !userForm.lastName || !userForm.email || 
        !userForm.password || !userForm.phone || !userForm.address) {
      setUserStatus({ loading: false, message: '', error: 'All fields are required.' });
      return;
    }
    if (!user?.unit?.unitID) {
      setUserStatus({ loading: false, message: '', error: 'Unit ID not found.' });
      return;
    }

    setUserStatus({ loading: true, message: '', error: '' });
    try {
      const payload = {
        firstName: userForm.firstName,
        lastName: userForm.lastName,
        email: userForm.email,
        password: userForm.password,
        phone: userForm.phone,
        address: userForm.address,
        primaryRole: userForm.primaryRole,
        type: userForm.type,
        active: userForm.active,
        unitID: parseInt(user.unit.unitID, 10)
      };
      console.log('Creating user with payload:', payload);
      
      const response = await fetchWrapper('/user-management', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      console.log('User creation response:', response);
      
      setUserStatus({ loading: false, message: 'User created successfully!', error: '' });
      setUserForm({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        primaryRole: 'USER',
        type: 'INTERNAL',
        active: true
      });
      setShowUserForm(false);
    } catch (err) {
      console.error('Failed to create user:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response,
        status: err.status
      });
      setUserStatus({ 
        loading: false, 
        message: '', 
        error: err.response?.message || 'Failed to create user. Please try again.' 
      });
    }
  };

  return (
    <div className="p-6 space-y-10 text-white">
      <motion.div className="mb-10" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">🏢 Units</h1>
          <button
            onClick={() => setShowAddUnitForm(!showAddUnitForm)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-sm transition-colors"
          >
            {showAddUnitForm ? (
              <>
                <FaChevronUp size={14} />
                Hide Add Unit
              </>
            ) : (
              <>
                <FaPlus size={14} />
                Add Unit
              </>
            )}
          </button>
        </div>

        {showAddUnitForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-zinc-900/60 border border-white/10 backdrop-blur-md p-6 rounded-xl shadow-subtle mb-4"
          >
            <form onSubmit={handleAddUnit} className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-2">
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
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-zinc-800/50 rounded-lg">
                <input
                  type="text"
                  name="newManager.firstName"
                  placeholder="First Name"
                  value={unitForm.newManager.firstName}
                  onChange={handleUnitFormChange}
                  className="bg-zinc-800 border border-zinc-700 text-sm p-2 rounded"
                />
                <input
                  type="text"
                  name="newManager.lastName"
                  placeholder="Last Name"
                  value={unitForm.newManager.lastName}
                  onChange={handleUnitFormChange}
                  className="bg-zinc-800 border border-zinc-700 text-sm p-2 rounded"
                />
                <input
                  type="email"
                  name="newManager.email"
                  placeholder="Email"
                  value={unitForm.newManager.email}
                  onChange={handleUnitFormChange}
                  className="bg-zinc-800 border border-zinc-700 text-sm p-2 rounded"
                />
                <input
                  type="password"
                  name="newManager.password"
                  placeholder="Password"
                  value={unitForm.newManager.password}
                  onChange={handleUnitFormChange}
                  className="bg-zinc-800 border border-zinc-700 text-sm p-2 rounded"
                />
                <input
                  type="tel"
                  name="newManager.phone"
                  placeholder="Phone Number"
                  value={unitForm.newManager.phone}
                  onChange={handleUnitFormChange}
                  className="bg-zinc-800 border border-zinc-700 text-sm p-2 rounded"
                />
                <input
                  type="text"
                  name="newManager.address"
                  placeholder="Address"
                  value={unitForm.newManager.address}
                  onChange={handleUnitFormChange}
                  className="bg-zinc-800 border border-zinc-700 text-sm p-2 rounded"
                />
                <select
                  name="newManager.type"
                  value={unitForm.newManager.type}
                  onChange={handleUnitFormChange}
                  className="bg-zinc-800 border border-zinc-700 text-sm p-2 rounded"
                >
                  <option value="INTERNAL">Internal</option>
                  <option value="EXTERNAL">External</option>
                </select>
              </div>

              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-sm px-3 py-2 rounded text-white transition w-fit"
                disabled={unitStatus.loading}
              >
                {unitStatus.loading ? 'Adding...' : <><FaPlus className="inline" /> Add Unit</>}
              </button>
            </form>
            {unitStatus.message && <p className="text-green-400 text-sm mb-2">{unitStatus.message}</p>}
            {unitStatus.error && <p className="text-red-400 text-sm mb-2">{unitStatus.error}</p>}
          </motion.div>
        )}

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

      {selectedUnit && (
        <form
          onSubmit={handleAddTeam}
          className="flex flex-col sm:flex-row items-center gap-2 bg-zinc-900/60 border border-white/10 backdrop-blur-md p-3 rounded-xl shadow-subtle mb-4"
        >
          <input
            type="text"
            name="name"
            placeholder="Team name"
            value={teamForm.name}
            onChange={e => setTeamForm({ name: e.target.value })}
            className="bg-zinc-800 border border-zinc-700 text-sm p-2 rounded w-48"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-sm px-3 py-2 rounded text-white transition"
            disabled={teamStatus.loading}
          >
            {teamStatus.loading ? 'Adding...' : <><FaPlus className="inline" /> Add Team</>}
          </button>
          {teamStatus.message && <p className="text-green-400 text-sm mb-2">{teamStatus.message}</p>}
          {teamStatus.error && <p className="text-red-400 text-sm mb-2">{teamStatus.error}</p>}
        </form>
      )}

      {teams.length > 0 && (
        <>
          <h2 className="text-xl font-bold mt-6">👥 Teams in {selectedUnit?.name}</h2>
          <div className="flex gap-4 flex-wrap">
            {teams.map(team => (
              <div key={team.teamID} className="flex items-center gap-2">
                <button
                  onClick={() => handleTeamClick(team)}
                  className={`px-4 py-2 rounded ${selectedTeam?.teamID === team.teamID ? 'bg-indigo-400' : 'bg-zinc-700'}`}
                >
                  {team.name}
                </button>
                <button
                  onClick={async () => {
                    const users = await fetchWrapper(`/user-management/unit/${selectedUnit.unitID}`);
                    setAvailableUsers(users);
                    setNewlyCreatedTeam(team);
                    setShowAddMembersModal(true);
                  }}
                  className="p-2 bg-zinc-700 hover:bg-zinc-600 rounded-full transition-colors"
                  title="Manage team members"
                >
                  <FaUserEdit size={14} />
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      <motion.div className="flex justify-between items-center" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold">👥 Team Members</h1>
      </motion.div>

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
            <p className="text-zinc-400 text-sm">Unit: {member.unit?.name || 'No Unit'}</p>
            <p className="text-zinc-400 text-sm">Manager: {member.unit?.manager ? `${member.unit.manager.firstName} ${member.unit.manager.lastName}` : 'No Manager'}</p>
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

      {showAddMembersModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-white/10 rounded-xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-bold mb-4">Add Team Members</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Select Users</label>
                <select
                  value={selectedUsers}
                  onChange={(e) => setSelectedUsers(e.target.value)}
                  className="w-full p-2 rounded bg-zinc-800 text-white border border-white/10"
                >
                  <option value="">Select a user</option>
                  {availableUsers.map(user => (
                    <option key={user.userID} value={user.userID}>
                      {user.firstName} {user.lastName} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Team Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full p-2 rounded bg-zinc-800 text-white border border-white/10"
                >
                  <option value="TEAM_MEMBER">Team Member</option>
                  <option value="TEAM_LEAD">Team Lead</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Access Level</label>
                <select
                  value={selectedAccessLevel}
                  onChange={(e) => setSelectedAccessLevel(e.target.value)}
                  className="w-full p-2 rounded bg-zinc-800 text-white border border-white/10"
                >
                  <option value="READ_ONLY">Read Only</option>
                  <option value="READ_WRITE">Read & Write</option>
                  <option value="FULL_ACCESS">Full Access</option>
                </select>
              </div>
              
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddMembersModal(false);
                    setSelectedUsers([]);
                    setSelectedRole('TEAM_MEMBER');
                    setSelectedAccessLevel('READ_ONLY');
                    setNewlyCreatedTeam(null);
                  }}
                  className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded flex items-center gap-2"
                >
                  <FaTimes size={12} />
                  Skip
                </button>
                <button
                  type="button"
                  onClick={handleAddTeamMembers}
                  className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded flex items-center gap-2"
                >
                  <FaCheck size={12} />
                  Add Members
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* User Creation Section - Only visible to ADMIN users */}
      {user?.primaryRole === 'ADMIN' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">👤 User Management</h2>
            <button
              onClick={() => setShowUserForm(!showUserForm)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-sm transition-colors"
            >
              <FaUserPlus size={14} />
              {showUserForm ? 'Cancel' : 'Create New User'}
            </button>
          </div>

          {showUserForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-zinc-900/60 border border-white/10 backdrop-blur-md p-6 rounded-xl shadow-subtle"
            >
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={userForm.firstName}
                      onChange={handleUserFormChange}
                      className="w-full p-2 rounded bg-zinc-800 text-white border border-white/10"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={userForm.lastName}
                      onChange={handleUserFormChange}
                      className="w-full p-2 rounded bg-zinc-800 text-white border border-white/10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={userForm.email}
                    onChange={handleUserFormChange}
                    className="w-full p-2 rounded bg-zinc-800 text-white border border-white/10"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={userForm.password}
                    onChange={handleUserFormChange}
                    className="w-full p-2 rounded bg-zinc-800 text-white border border-white/10"
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={userForm.phone}
                    onChange={handleUserFormChange}
                    className="w-full p-2 rounded bg-zinc-800 text-white border border-white/10"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={userForm.address}
                    onChange={handleUserFormChange}
                    className="w-full p-2 rounded bg-zinc-800 text-white border border-white/10"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">Role</label>
                    <select
                      name="primaryRole"
                      value={userForm.primaryRole}
                      onChange={handleUserFormChange}
                      className="w-full p-2 rounded bg-zinc-800 text-white border border-white/10"
                    >
                      <option value="USER">User</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">Type</label>
                    <select
                      name="type"
                      value={userForm.type}
                      onChange={handleUserFormChange}
                      className="w-full p-2 rounded bg-zinc-800 text-white border border-white/10"
                    >
                      <option value="INTERNAL">Internal</option>
                      <option value="EXTERNAL">External</option>
                    </select>
                  </div>
                </div>

                {userStatus.message && (
                  <p className="text-green-400 text-sm">{userStatus.message}</p>
                )}
                {userStatus.error && (
                  <p className="text-red-400 text-sm">{userStatus.error}</p>
                )}

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowUserForm(false)}
                    className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded flex items-center gap-2"
                  >
                    <FaTimes size={12} />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded flex items-center gap-2"
                    disabled={userStatus.loading}
                  >
                    <FaCheck size={12} />
                    {userStatus.loading ? 'Creating...' : 'Create User'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Team;