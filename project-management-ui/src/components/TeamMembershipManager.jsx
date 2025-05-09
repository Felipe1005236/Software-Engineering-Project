import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUserPlus, FaEdit, FaUserTimes, FaCheck, FaTimes } from 'react-icons/fa';
import { fetchWrapper } from '../utils/fetchWrapper';

const TEAM_ROLES = [
  { value: 'TEAM_LEAD', label: 'Team Lead', color: 'bg-purple-600' },
  { value: 'TEAM_MEMBER', label: 'Team Member', color: 'bg-blue-600' },
  { value: 'CONTRIBUTOR', label: 'Contributor', color: 'bg-green-600' },
  { value: 'STAKEHOLDER', label: 'Stakeholder', color: 'bg-yellow-600' },
  { value: 'OBSERVER', label: 'Observer', color: 'bg-gray-600' }
];

const ACCESS_LEVELS = [
  { value: 'READ_ONLY', label: 'Read Only', description: 'Can view but not change anything' },
  { value: 'READ_WRITE', label: 'Read & Write', description: 'Can make changes but not delete' },
  { value: 'FULL_ACCESS', label: 'Full Access', description: 'Complete control including deletion' }
];

const TeamMembershipManager = ({ teamId, projectId }) => {
  const [memberships, setMemberships] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [formData, setFormData] = useState({
    userID: '',
    teamRole: 'TEAM_MEMBER',
    accessLevel: 'READ_ONLY'
  });

  useEffect(() => {
    fetchTeamMemberships();
  }, [teamId]);

  const fetchTeamMemberships = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch existing team memberships
      const memberships = await fetchWrapper(`/api/team-memberships/team/${teamId}`);
      setMemberships(memberships);

      // Fetch users not yet in the team (for add modal)
      const users = await fetchWrapper('/api/users');
      const teamUserIds = memberships.map(m => m.userID);
      setAvailableUsers(users.filter(user => !teamUserIds.includes(user.userID)));

    } catch (err) {
      setError(err.message || 'Failed to fetch team memberships');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      const newMembership = await fetchWrapper('/api/team-memberships', {
        method: 'POST',
        body: JSON.stringify({
          userID: parseInt(formData.userID),
          teamID: teamId,
          teamRole: formData.teamRole,
          accessLevel: formData.accessLevel
        })
      });

      setMemberships([...memberships, newMembership]);
      setShowAddModal(false);
      
      // Update available users
      setAvailableUsers(availableUsers.filter(user => user.userID !== parseInt(formData.userID)));
      
      // Reset form
      setFormData({
        userID: '',
        teamRole: 'TEAM_MEMBER',
        accessLevel: 'READ_ONLY'
      });
      
    } catch (err) {
      setError(err.message || 'Failed to add team member');
      console.error(err);
    }
  };

  const handleUpdateMember = async (e) => {
    e.preventDefault();
    try {
      const updatedMembership = await fetchWrapper(`/api/team-memberships/${selectedMembership.userID}/${teamId}`, {
        method: 'PUT',
        body: JSON.stringify({
          teamRole: formData.teamRole,
          accessLevel: formData.accessLevel
        })
      });

      setMemberships(memberships.map(m => 
        (m.userID === updatedMembership.userID && m.teamID === updatedMembership.teamID) 
          ? updatedMembership 
          : m
      ));
      
      setShowEditModal(false);
      
    } catch (err) {
      setError(err.message || 'Failed to update team member');
      console.error(err);
    }
  };

  const handleRemoveMember = async (membership) => {
    if (!confirm(`Are you sure you want to remove ${membership.user.firstName} ${membership.user.lastName} from the team?`)) {
      return;
    }

    try {
      await fetchWrapper(`/api/team-memberships/${membership.userID}/${teamId}`, {
        method: 'DELETE'
      });

      // Update memberships
      setMemberships(memberships.filter(m => !(m.userID === membership.userID && m.teamID === teamId)));
      
      // Add user back to available users
      setAvailableUsers([...availableUsers, membership.user]);
      
    } catch (err) {
      setError(err.message || 'Failed to remove team member');
      console.error(err);
    }
  };

  const openEditModal = (membership) => {
    setSelectedMembership(membership);
    setFormData({
      teamRole: membership.teamRole,
      accessLevel: membership.accessLevel
    });
    setShowEditModal(true);
  };

  const getTeamRoleColor = (role) => {
    return TEAM_ROLES.find(r => r.value === role)?.color || 'bg-gray-600';
  };

  const getAccessLevelIcon = (level) => {
    switch (level) {
      case 'READ_ONLY':
        return <span className="text-xs text-zinc-400">👁️</span>;
      case 'READ_WRITE':
        return <span className="text-xs text-zinc-400">✏️</span>;
      case 'FULL_ACCESS':
        return <span className="text-xs text-zinc-400">⚙️</span>;
      default:
        return null;
    }
  };

  if (loading) return <div className="p-4 text-zinc-400">Loading team members...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="bg-zinc-800/60 backdrop-blur border border-white/10 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Team Members</h3>
        <button
          onClick={() => setShowAddModal(true)}
          disabled={availableUsers.length === 0}
          className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm ${
            availableUsers.length === 0
              ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
              : 'bg-indigo-500 hover:bg-indigo-600 text-white'
          }`}
        >
          <FaUserPlus size={12} />
          Add Member
        </button>
      </div>

      {memberships.length === 0 ? (
        <p className="text-zinc-400 italic text-sm">No members in this team yet.</p>
      ) : (
        <ul className="space-y-2">
          {memberships.map((membership) => (
            <motion.li
              key={`${membership.userID}-${membership.teamID}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-between items-center p-3 bg-zinc-900/40 rounded border border-white/5 hover:border-white/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-sm font-medium">
                  {membership.user?.firstName?.[0]}{membership.user?.lastName?.[0]}
                </div>
                <div>
                  <div className="font-medium">
                    {membership.user?.firstName} {membership.user?.lastName}
                  </div>
                  <div className="text-xs text-zinc-400">{membership.user?.email}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 text-xs rounded-full ${getTeamRoleColor(membership.teamRole)}`}>
                  {membership.teamRole}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-zinc-700 flex items-center gap-1">
                  {getAccessLevelIcon(membership.accessLevel)}
                  {membership.accessLevel}
                </span>
                
                <div className="flex gap-1">
                  <button
                    onClick={() => openEditModal(membership)}
                    className="p-1.5 text-indigo-400 hover:text-indigo-300 bg-zinc-800 rounded"
                  >
                    <FaEdit size={14} />
                  </button>
                  <button
                    onClick={() => handleRemoveMember(membership)}
                    className="p-1.5 text-red-400 hover:text-red-300 bg-zinc-800 rounded"
                  >
                    <FaUserTimes size={14} />
                  </button>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      )}

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-white/10 rounded-xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-bold mb-4">Add Team Member</h3>
            {availableUsers.length === 0 ? (
              <p className="text-zinc-400">All users are already part of this team.</p>
            ) : (
              <form onSubmit={handleAddMember} className="space-y-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">User</label>
                  <select
                    value={formData.userID}
                    onChange={(e) => setFormData({...formData, userID: e.target.value})}
                    required
                    className="w-full p-2 rounded bg-zinc-800 text-white border border-white/10"
                  >
                    <option value="">Select User</option>
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
                    value={formData.teamRole}
                    onChange={(e) => setFormData({...formData, teamRole: e.target.value})}
                    className="w-full p-2 rounded bg-zinc-800 text-white border border-white/10"
                  >
                    {TEAM_ROLES.map(role => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Access Level</label>
                  <div className="space-y-2">
                    {ACCESS_LEVELS.map(level => (
                      <label key={level.value} className="flex items-start gap-2 p-2 rounded hover:bg-zinc-800 cursor-pointer">
                        <input
                          type="radio"
                          name="accessLevel"
                          value={level.value}
                          checked={formData.accessLevel === level.value}
                          onChange={(e) => setFormData({...formData, accessLevel: e.target.value})}
                          className="mt-1"
                        />
                        <div>
                          <div className="font-medium">{level.label}</div>
                          <div className="text-xs text-zinc-400">{level.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded flex items-center gap-2"
                  >
                    <FaTimes size={12} />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded flex items-center gap-2"
                  >
                    <FaCheck size={12} />
                    Add
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
      
      {/* Edit Member Modal */}
      {showEditModal && selectedMembership && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-white/10 rounded-xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-bold mb-4">Edit Team Member</h3>
            <div className="mb-4 flex items-center gap-3 p-3 bg-zinc-800/80 rounded">
              <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-sm font-medium">
                {selectedMembership.user?.firstName?.[0]}{selectedMembership.user?.lastName?.[0]}
              </div>
              <div>
                <div className="font-medium">
                  {selectedMembership.user?.firstName} {selectedMembership.user?.lastName}
                </div>
                <div className="text-xs text-zinc-400">{selectedMembership.user?.email}</div>
              </div>
            </div>
            
            <form onSubmit={handleUpdateMember} className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Team Role</label>
                <select
                  value={formData.teamRole}
                  onChange={(e) => setFormData({...formData, teamRole: e.target.value})}
                  className="w-full p-2 rounded bg-zinc-800 text-white border border-white/10"
                >
                  {TEAM_ROLES.map(role => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Access Level</label>
                <div className="space-y-2">
                  {ACCESS_LEVELS.map(level => (
                    <label key={level.value} className="flex items-start gap-2 p-2 rounded hover:bg-zinc-800 cursor-pointer">
                      <input
                        type="radio"
                        name="accessLevel"
                        value={level.value}
                        checked={formData.accessLevel === level.value}
                        onChange={(e) => setFormData({...formData, accessLevel: e.target.value})}
                        className="mt-1"
                      />
                      <div>
                        <div className="font-medium">{level.label}</div>
                        <div className="text-xs text-zinc-400">{level.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded flex items-center gap-2"
                >
                  <FaTimes size={12} />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded flex items-center gap-2"
                >
                  <FaCheck size={12} />
                  Update
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TeamMembershipManager; 