import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBuilding, FaUsers, FaSitemap, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { fetchWrapper } from '../utils/fetchWrapper';

const OrganizationManagement = () => {
  const [activeTab, setActiveTab] = useState('details');
  const [organization, setOrganization] = useState(null);
  const [units, setUnits] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal state
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  
  useEffect(() => {
    fetchOrganizationData();
  }, []);
  
  const fetchOrganizationData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would get the current user's organization
      // For now, we'll assume the user is part of organization with ID 1
      const orgData = await fetchWrapper('/api/organizations/1');
      setOrganization(orgData);
      
      // Fetch units for this organization
      const unitsData = await fetchWrapper(`/api/units/organization/${orgData.organizationID}`);
      setUnits(unitsData);
      
      // Fetch users for this organization
      const usersData = await fetchWrapper(`/api/users/organization/${orgData.organizationID}`);
      setUsers(usersData);
      
    } catch (err) {
      setError(err.message || 'Failed to fetch organization data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleEditOrganization = async (updatedData) => {
    try {
      const response = await fetchWrapper(`/api/organizations/${organization.organizationID}`, {
        method: 'PUT',
        body: JSON.stringify(updatedData)
      });
      
      setOrganization(response);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };
  
  const handleCreateUnit = async (unitData) => {
    try {
      const newUnit = await fetchWrapper('/api/units', {
        method: 'POST',
        body: JSON.stringify({
          ...unitData,
          organizationID: organization.organizationID
        })
      });
      
      setUnits([...units, newUnit]);
      setShowUnitModal(false);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };
  
  const handleEditUnit = async (unitData) => {
    try {
      const updatedUnit = await fetchWrapper(`/api/units/${unitData.unitID}`, {
        method: 'PUT',
        body: JSON.stringify(unitData)
      });
      
      setUnits(units.map(unit => 
        unit.unitID === updatedUnit.unitID ? updatedUnit : unit
      ));
      setShowUnitModal(false);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };
  
  const handleDeleteUnit = async (unitID) => {
    if (!confirm('Are you sure you want to delete this unit?')) return;
    
    try {
      await fetchWrapper(`/api/units/${unitID}`, {
        method: 'DELETE'
      });
      
      setUnits(units.filter(unit => unit.unitID !== unitID));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };
  
  const openCreateUnitModal = () => {
    setModalData({
      name: '',
      description: '',
      manager: ''
    });
    setModalMode('create');
    setShowUnitModal(true);
  };
  
  const openEditUnitModal = (unit) => {
    setModalData({...unit});
    setModalMode('edit');
    setShowUnitModal(true);
  };
  
  if (loading) return <div className="p-6 text-white">Loading organization data...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;
  if (!organization) return <div className="p-6 text-white">No organization found</div>;
  
  return (
    <div className="p-6 text-white">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <FaBuilding className="text-indigo-400" />
          {organization.name}
        </h1>
        <p className="text-zinc-400">{organization.description || 'No description'}</p>
      </motion.div>
      
      {/* Tabs */}
      <div className="flex border-b border-zinc-800 mb-6">
        <button
          className={`py-2 px-4 font-medium flex items-center gap-2 ${
            activeTab === 'details' 
              ? 'text-indigo-400 border-b-2 border-indigo-400' 
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
          onClick={() => setActiveTab('details')}
        >
          <FaBuilding />
          Details
        </button>
        <button
          className={`py-2 px-4 font-medium flex items-center gap-2 ${
            activeTab === 'units' 
              ? 'text-indigo-400 border-b-2 border-indigo-400' 
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
          onClick={() => setActiveTab('units')}
        >
          <FaSitemap />
          Units
        </button>
        <button
          className={`py-2 px-4 font-medium flex items-center gap-2 ${
            activeTab === 'people' 
              ? 'text-indigo-400 border-b-2 border-indigo-400' 
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
          onClick={() => setActiveTab('people')}
        >
          <FaUsers />
          People
        </button>
      </div>
      
      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'details' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-zinc-800/60 backdrop-blur border border-white/10 p-6 rounded-xl shadow-subtle"
          >
            <form className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Organization Name</label>
                <input
                  type="text"
                  value={organization.name}
                  onChange={(e) => setOrganization({...organization, name: e.target.value})}
                  className="w-full p-2 rounded bg-zinc-700 text-white border border-white/10"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Description</label>
                <textarea
                  value={organization.description || ''}
                  onChange={(e) => setOrganization({...organization, description: e.target.value})}
                  className="w-full p-2 rounded bg-zinc-700 text-white border border-white/10"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Created At</label>
                <input
                  type="text"
                  value={new Date(organization.createdAt).toLocaleDateString()}
                  readOnly
                  className="w-full p-2 rounded bg-zinc-700 text-white border border-white/10"
                />
              </div>
              <button
                type="button"
                onClick={() => handleEditOrganization(organization)}
                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded text-white"
              >
                Save Changes
              </button>
            </form>
          </motion.div>
        )}
        
        {activeTab === 'units' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Units</h2>
              <button
                onClick={openCreateUnitModal}
                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 rounded text-sm"
              >
                <FaPlus size={12} />
                Add Unit
              </button>
            </div>
            
            {units.length === 0 ? (
              <p className="text-zinc-400 italic">No units found. Create your first unit!</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {units.map(unit => (
                  <div
                    key={unit.unitID}
                    className="bg-zinc-800/80 backdrop-blur p-4 rounded-lg border border-white/10 relative group"
                  >
                    <h3 className="font-bold text-lg">{unit.name}</h3>
                    <p className="text-zinc-400 text-sm mb-2">{unit.description || 'No description'}</p>
                    <p className="text-zinc-300 text-sm"><span className="text-zinc-500">Manager:</span> {unit.manager}</p>
                    
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditUnitModal(unit)}
                        className="p-1.5 text-indigo-400 hover:text-indigo-300 bg-zinc-900/80 rounded"
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteUnit(unit.unitID)}
                        className="p-1.5 text-red-400 hover:text-red-300 bg-zinc-900/80 rounded"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Unit Modal */}
            {showUnitModal && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                <div className="bg-zinc-900 border border-white/10 rounded-xl p-6 w-full max-w-md">
                  <h3 className="text-xl font-bold mb-4">
                    {modalMode === 'create' ? 'Create New Unit' : 'Edit Unit'}
                  </h3>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (modalMode === 'create') {
                      handleCreateUnit(modalData);
                    } else {
                      handleEditUnit(modalData);
                    }
                  }} className="space-y-4">
                    <div>
                      <label className="block text-sm text-zinc-400 mb-1">Unit Name</label>
                      <input
                        type="text"
                        value={modalData.name || ''}
                        onChange={(e) => setModalData({...modalData, name: e.target.value})}
                        required
                        className="w-full p-2 rounded bg-zinc-800 text-white border border-white/10"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-zinc-400 mb-1">Description</label>
                      <textarea
                        value={modalData.description || ''}
                        onChange={(e) => setModalData({...modalData, description: e.target.value})}
                        className="w-full p-2 rounded bg-zinc-800 text-white border border-white/10"
                        rows="2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-zinc-400 mb-1">Manager</label>
                      <input
                        type="text"
                        value={modalData.manager || ''}
                        onChange={(e) => setModalData({...modalData, manager: e.target.value})}
                        required
                        className="w-full p-2 rounded bg-zinc-800 text-white border border-white/10"
                      />
                    </div>
                    <div className="flex gap-3 justify-end">
                      <button
                        type="button"
                        onClick={() => setShowUnitModal(false)}
                        className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded"
                      >
                        {modalMode === 'create' ? 'Create' : 'Save'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </motion.div>
        )}
        
        {activeTab === 'people' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">People</h2>
              <button
                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 rounded text-sm"
                onClick={() => setShowUserModal(true)}
              >
                <FaPlus size={12} />
                Invite User
              </button>
            </div>
            
            {users.length === 0 ? (
              <p className="text-zinc-400 italic">No users found in this organization.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full bg-zinc-800/60 backdrop-blur border border-white/10 rounded-lg">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="p-3 text-left text-zinc-400 font-medium">Name</th>
                      <th className="p-3 text-left text-zinc-400 font-medium">Email</th>
                      <th className="p-3 text-left text-zinc-400 font-medium">Unit</th>
                      <th className="p-3 text-left text-zinc-400 font-medium">Role</th>
                      <th className="p-3 text-left text-zinc-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.userID} className="border-b border-white/5 hover:bg-white/5">
                        <td className="p-3">{user.firstName} {user.lastName}</td>
                        <td className="p-3 text-zinc-300">{user.email}</td>
                        <td className="p-3 text-zinc-300">
                          {units.find(u => u.unitID === user.unitID)?.name || 'N/A'}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.primaryRole === 'ADMIN' ? 'bg-purple-600' :
                            user.primaryRole === 'MANAGER' ? 'bg-blue-600' :
                            'bg-green-600'
                          }`}>
                            {user.primaryRole}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <button className="p-1.5 text-indigo-400 hover:text-indigo-300 bg-zinc-900/80 rounded">
                              <FaEdit size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* User Invite Modal (simplified) */}
            {showUserModal && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                <div className="bg-zinc-900 border border-white/10 rounded-xl p-6 w-full max-w-md">
                  <h3 className="text-xl font-bold mb-4">Invite User</h3>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm text-zinc-400 mb-1">Email</label>
                      <input
                        type="email"
                        className="w-full p-2 rounded bg-zinc-800 text-white border border-white/10"
                        placeholder="user@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-zinc-400 mb-1">Unit</label>
                      <select className="w-full p-2 rounded bg-zinc-800 text-white border border-white/10">
                        <option value="">Select Unit</option>
                        {units.map(unit => (
                          <option key={unit.unitID} value={unit.unitID}>
                            {unit.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-zinc-400 mb-1">Role</label>
                      <select className="w-full p-2 rounded bg-zinc-800 text-white border border-white/10">
                        <option value="USER">User</option>
                        <option value="MANAGER">Manager</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </div>
                    <div className="flex gap-3 justify-end">
                      <button
                        type="button"
                        onClick={() => setShowUserModal(false)}
                        className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowUserModal(false)}
                        className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded"
                      >
                        Send Invite
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OrganizationManagement; 