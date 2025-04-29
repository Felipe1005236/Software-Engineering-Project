import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'http://localhost:3000/api';

const Risks = () => {
  const [risks, setRisks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editRisk, setEditRisk] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRisks();
  }, []);

  const fetchRisks = async () => {
    try {
      const response = await fetch(`${BASE_URL}/risks`);
      if (!response.ok) throw new Error('Failed to fetch risks');
      const data = await response.json();
  
      const sanitized = data.map((r) => ({
        id: r.riskID,
        title: r.title,
        description: r.description,
        probability: r.probability || 'Medium',
        impact: r.impact || 'Medium',
        responsePlan: r.responsePlan || '',
        owner: r.owner || 'Unassigned',
        status: r.status || 'Open',
      }));
  
      setRisks(sanitized);
    } catch (err) {
      console.error('Failed to fetch risks. Using fallback data.');
      setRisks([
        {
          id: '1',
          title: 'Backend Server Crash',
          description: 'Server hardware failure could cause extended downtime',
          probability: 'Medium',
          impact: 'High',
          responsePlan: 'Daily backups + Server monitoring',
          owner: 'DevOps Team',
          status: 'Open',
        },
        {
          id: '2',
          title: 'Key Employee Departure',
          description: 'Losing senior developers could delay project',
          probability: 'Low',
          impact: 'High',
          responsePlan: 'Cross-training and documentation',
          owner: 'HR Manager',
          status: 'Open',
        },
        {
          id: '3',
          title: 'Third-party API Changes',
          description: 'Vendor API changes might break integrations',
          probability: 'High',
          impact: 'Medium',
          responsePlan: 'Maintain API wrapper abstraction layer',
          owner: 'Integration Team',
          status: 'Open',
        },
      ]);
    }
  };

  const handleAdd = () => {
    setEditRisk(null);
    setIsModalOpen(true);
  };

//   const handleSave = async (newRisk) => {
//     try {
//       const url = editRisk
//         ? `${BASE_URL}/risks/${editRisk.id}`
//         : `${BASE_URL}/risks`;
  
//       const method = editRisk ? 'PUT' : 'POST';
  
//       const payload = {
//         title: newRisk.title,
//         description: newRisk.description,
//         probability: newRisk.probability,
//         impact: newRisk.impact,
//         responsePlan: newRisk.responsePlan,
//         owner: newRisk.owner,
//         status: newRisk.status || 'Open',
//       };
  
//       const response = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });
  
//       if (!response.ok) throw new Error('Failed to save risk');
  
//       const saved = await response.json();
  
//       setRisks((prev) =>
//         editRisk
//           ? prev.map((r) => (r.id === editRisk.id ? { ...saved } : r))
//           : [...prev, saved]
//       );
//     } catch (err) {
//       console.error('Save failed:', err);
//     }
//     setIsModalOpen(false);
//   };

  const handleSave = (newRisk) => {
    setEditRisk(null);
    if(newRisk.id) {
        setRisks(prevRisks =>
            prevRisks.map(risk =>
                risk.id === newRisk.id ? newRisk : risk
            )
        );
    }

    else {
        setRisks(prevRisks => [
            ...prevRisks,
            {
                ...newRisk,
                id: Date.now().toString()
            }
        ]);
    }
    setIsModalOpen(false);
  };

//   const handleDelete = async (target) => {
//     try {
//       const response = await fetch(`${BASE_URL}/risks/${target.id}`, {
//         method: 'DELETE',
//       });

//       if (!response.ok) throw new Error('Delete failed');

//       setRisks((prev) => prev.filter((r) => r.id !== target.id));
//     } catch (err) {
//       console.error('Delete failed:', err);
//     }
//   };

const handleDelete = (riskToDelete) => {
    setRisks(prevRisks =>
        prevRisks.filter(risk => risk.id !== riskToDelete.id)
    );
};

  const handleEdit = (risk) => {
    setEditRisk(risk);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 space-y-8 text-white">
      <motion.div
        className="flex justify-between items-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold">⚠️ Risks</h1>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-sm rounded shadow-md"
        >
          + Add Risk
        </button>
      </motion.div>

      {risks.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-zinc-400 italic"
        >
          No risks identified yet. Add your first risk! 🛡️
        </motion.p>
      ) : (
        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {risks.map((risk, i) => (
            <RiskCard
              key={risk.id || i}
              risk={risk}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </motion.div>
      )}

      <RiskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editRisk}
      />
    </div>
  );
};

const RiskCard = ({ risk, onEdit, onDelete }) => {
  const getPriorityColor = () => {
    if (risk.probability === 'High' && risk.impact === 'High') return 'bg-red-500/20';
    if (risk.probability === 'High' || risk.impact === 'High') return 'bg-orange-500/20';
    return 'bg-blue-500/20';
  };

  return (
    <motion.div 
      className={`p-4 rounded-lg border border-zinc-700 ${getPriorityColor()}`}
      whileHover={{ y: -2 }}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-lg mb-1">{risk.title}</h3>
        <span className={`text-xs px-2 py-1 rounded ${
                risk.status === 'Open' ? 'bg-red-500/50' : 
                risk.status === 'Occurring' ? 'bg-yellow-500/50' : 
                risk.status === 'Resolved' ? 'bg-green-500/50' :
                'bg-gray-500/50'
            }` }>
            {risk.status}
        </span>
      </div>
      
      <p className="text-sm text-zinc-300 mb-3 line-clamp-2">{risk.description}</p>
      
      <div className="flex justify-between text-xs mb-3">
        <span>Probability: <span className="font-medium">{risk.probability}</span></span>
        <span>Impact: <span className="font-medium">{risk.impact}</span></span>
      </div>
      
      {risk.responsePlan && (
        <div className="text-xs mb-3">
          <p className="text-zinc-400">Response:</p>
          <p className="text-zinc-300 line-clamp-2">{risk.responsePlan}</p>
        </div>
      )}
      
      <div className="flex justify-between items-center text-xs">
        <span>Owner: <span className="font-medium">{risk.owner}</span></span>
        <div className="space-x-2">
          <button 
            onClick={() => onEdit(risk)}
            className="text-indigo-400 hover:text-indigo-300"
          >
            Edit
          </button>
          <button 
            onClick={() => onDelete(risk)}
            className="text-red-400 hover:text-red-300"
          >
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const RiskModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    probability: 'Medium',
    impact: 'Medium',
    responsePlan: '',
    owner: '',
    status: 'Open',
  });

  useEffect(() => {
    if(isOpen) {
        setFormData(initialData || {
            title: '',
            description: '',
            probability: 'Medium',
            impact: 'Medium',
            responsePlan: '',
            status: 'Open'
        });
    }
  }, [isOpen, initialData]);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        title: '',
        description: '',
        probability: 'Medium',
        impact: 'Medium',
        responsePlan: '',
        owner: '',
        status: 'Open',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <motion.div 
      className={`fixed inset-0 bg-black/50 z-50 flex items-center justify-center ${isOpen ? 'block' : 'hidden'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 1 : 0 }}
    >
      <motion.div 
        className="bg-zinc-800 rounded-lg p-6 w-full max-w-md"
        initial={{ scale: 0.9 }}
        animate={{ scale: isOpen ? 1 : 0.9 }}
      >
        <h2 className="text-xl font-bold mb-4">
          {initialData ? 'Edit Risk' : 'Add New Risk'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Risk Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full bg-zinc-700 rounded px-3 py-2 text-sm"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-zinc-700 rounded px-3 py-2 text-sm"
              rows="3"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Probability</label>
              <select
                name="probability"
                value={formData.probability}
                onChange={handleChange}
                className="w-full bg-zinc-700 rounded px-3 py-2 text-sm"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Impact</label>
              <select
                name="impact"
                value={formData.impact}
                onChange={handleChange}
                className="w-full bg-zinc-700 rounded px-3 py-2 text-sm"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Response Plan (Optional)</label>
            <textarea
              name="responsePlan"
              value={formData.responsePlan}
              onChange={handleChange}
              className="w-full bg-zinc-700 rounded px-3 py-2 text-sm"
              rows="2"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Owner</label>
              <input
                type="text"
                name="owner"
                value={formData.owner}
                onChange={handleChange}
                className="w-full bg-zinc-700 rounded px-3 py-2 text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-zinc-700 rounded px-3 py-2 text-sm"
              >
                <option value="Open">Open</option>
                <option value="Occurring">Occurring</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded bg-zinc-700 hover:bg-zinc-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm rounded bg-indigo-500 hover:bg-indigo-600"
            >
              Save Risk
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Risks;