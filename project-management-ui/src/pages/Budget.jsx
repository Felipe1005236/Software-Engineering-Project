import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Legend, CartesianGrid, PieChart, Pie, Cell
} from 'recharts';
import { fetchWrapper } from '../utils/fetchWrapper';

const Budget = () => {
  const [projects, setProjects] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [selectedChartsProjectID, setSelectedChartsProjectID] = useState(null);
  const [formData, setFormData] = useState({
    projectID: '',
    totalBudget: '',
    actualCost: '',
    forecastCost: '',
  });
  const [formOpen, setFormOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects();
    fetchBudgets();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await fetchWrapper('/projects');
      setProjects(data);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      setError('Failed to load projects');
    }
  };

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const data = await fetchWrapper('/budget');
      setBudgets(data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch budgets:', err);
      setError('Failed to load budgets');
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSelect = (e) => {
    const id = parseInt(e.target.value);
    const existingBudget = budgets.find(b => b.projectID === id);

    if (existingBudget) {
      setFormData({
        ...existingBudget,
      });
      setEditIndex(budgets.findIndex(b => b.projectID === id));
    } else {
      setFormData({
        projectID: id,
        totalBudget: '',
        actualCost: '',
        forecastCost: '',
      });
      setEditIndex(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      projectID: parseInt(formData.projectID),
      totalBudget: parseFloat(formData.totalBudget),
      actualCost: parseFloat(formData.actualCost),
      forecastCost: parseFloat(formData.forecastCost),
    };

    try {
      if (editIndex !== null) {
        const budgetToUpdate = budgets[editIndex];
        await fetchWrapper(`/budget/${budgetToUpdate.budgetID}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
      } else {
        await fetchWrapper('/budget', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      
      await fetchBudgets();
      setFormData({ projectID: '', totalBudget: '', actualCost: '', forecastCost: '' });
      setFormOpen(false);
      setEditIndex(null);
    } catch (err) {
      console.error('Failed to save budget:', err);
      setError('Failed to save budget');
    } finally {
      setLoading(false);
    }
  };

  const getProjectName = (id) => {
    const project = projects.find(p => p.projectID === id);
    return project ? project.title : `Project ${id}`;
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];
  const selectedBudget = budgets.find(b => b.projectID === selectedChartsProjectID);

  if (loading && budgets.length === 0) {
    return (
      <div className="bg-black text-white min-h-screen px-6 py-16 font-sans flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen px-6 py-16 font-sans">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10">Budget Overview</h1>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Add Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setFormOpen(!formOpen)}
            className="bg-white text-black px-6 py-3 rounded-full hover:bg-gray-200 transition"
            disabled={loading}
          >
            {formOpen ? 'Cancel' : 'Add Budget Entry'}
          </button>
        </div>

        {/* Form */}
        {formOpen && (
          <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900/60 p-6 rounded-xl border border-white/10 shadow-subtle mb-12">
            <div>
              <label className="block mb-1">Project</label>
              <select
                name="projectID"
                value={formData.projectID}
                onChange={handleProjectSelect}
                required
                className="w-full bg-black border border-gray-600 p-3 rounded text-white"
                disabled={loading}
              >
                <option value="">Choose a project</option>
                {projects.map((p) => (
                  <option key={p.projectID} value={p.projectID}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1">Total Budget ($)</label>
              <input
                type="number"
                name="totalBudget"
                value={formData.totalBudget}
                onChange={handleChange}
                required
                className="w-full bg-black border border-gray-600 p-3 rounded text-white"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block mb-1">Actual Cost ($)</label>
              <input
                type="number"
                name="actualCost"
                value={formData.actualCost}
                onChange={handleChange}
                required
                className="w-full bg-black border border-gray-600 p-3 rounded text-white"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block mb-1">Forecast Cost ($)</label>
              <input
                type="number"
                name="forecastCost"
                value={formData.forecastCost}
                onChange={handleChange}
                required
                className="w-full bg-black border border-gray-600 p-3 rounded text-white"
                disabled={loading}
              />
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-200 transition"
                disabled={loading}
              >
                {loading ? 'Saving...' : editIndex !== null ? 'Update Budget' : 'Save Budget'}
              </button>
            </div>
          </form>
        )}

        {/* Budget Cards */}
        <div className="space-y-6">
          {budgets.map((b) => (
            <div key={b.budgetID} className="bg-zinc-800/60 p-6 rounded-xl border border-white/10 shadow-subtle">
              <h2 className="text-2xl font-semibold mb-2">{getProjectName(b.projectID)}</h2>
              <p><strong>Total Budget:</strong> ${b.totalBudget.toFixed(2)}</p>
              <p><strong>Actual Cost:</strong> ${b.actualCost.toFixed(2)}</p>
              <p><strong>Forecast Cost:</strong> ${b.forecastCost.toFixed(2)}</p>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => {
                    setFormData(b);
                    setFormOpen(true);
                    setEditIndex(budgets.findIndex(budget => budget.budgetID === b.budgetID));
                  }}
                  className="text-sm px-4 py-2 bg-yellow-500 text-black rounded"
                  disabled={loading}
                >
                  Edit
                </button>
                <button
                  onClick={() => setSelectedChartsProjectID(b.projectID)}
                  className="text-sm px-4 py-2 bg-indigo-600 text-white rounded"
                  disabled={loading}
                >
                  View Charts
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        {selectedBudget && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-6">
              {getProjectName(selectedBudget.projectID)} - Budget Charts
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-center">Bar Chart</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[selectedBudget]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="projectID" stroke="#ccc" />
                    <YAxis stroke="#ccc" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalBudget" fill="#8884d8" name="Total Budget" />
                    <Bar dataKey="actualCost" fill="#82ca9d" name="Actual Cost" />
                    <Bar dataKey="forecastCost" fill="#ffc658" name="Forecast Cost" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-center">Pie Chart</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Total Budget", value: selectedBudget.totalBudget },
                        { name: "Actual Cost", value: selectedBudget.actualCost },
                        { name: "Forecast Cost", value: selectedBudget.forecastCost },
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                      dataKey="value"
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={index} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Summary for selected project */}
            <div className="bg-zinc-800/60 p-6 mt-12 rounded-xl border border-white/10 text-sm text-gray-300 shadow-subtle text-center">
              <h3 className="text-lg font-semibold text-white mb-2">Summary</h3>
              <p>Total Budget: ${selectedBudget.totalBudget.toFixed(2)}</p>
              <p>Actual Cost: ${selectedBudget.actualCost.toFixed(2)}</p>
              <p>Forecast Cost: ${selectedBudget.forecastCost.toFixed(2)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Budget;