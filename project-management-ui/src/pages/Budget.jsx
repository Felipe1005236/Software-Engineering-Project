import { useEffect, useState } from 'react';

export default function Budget() {
  const [formOpen, setFormOpen] = useState(false);
  const [budgetItems, setBudgetItems] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Labor',
    estimatedCost: '',
    actualCost: '',
    dueDate: '',
    assignedProject: '',
  });

  useEffect(() => {
    // Load budget items from localStorage on page load
    const storedItems = JSON.parse(localStorage.getItem('budgetItems')) || [];
    setBudgetItems(storedItems);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = { ...formData, id: Date.now() }; // Add a unique ID

    const updatedItems = [...budgetItems, newItem];
    setBudgetItems(updatedItems);
    localStorage.setItem('budgetItems', JSON.stringify(updatedItems)); // Save to localStorage

    // Reset form
    setFormData({
      name: '',
      type: 'Labor',
      estimatedCost: '',
      actualCost: '',
      dueDate: '',
      assignedProject: '',
    });
    setFormOpen(false);
  };

  return (
    <div className="bg-black text-white min-h-screen px-6 py-16 font-sans">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold">Budget Management</h1>
          <p className="text-gray-400 text-md mt-4">
            Track project costs easily and stay on top of your finances.
          </p>
        </div>

        {/* Add Budget Button */}
        <div className="flex justify-center mb-10">
          <button
            onClick={() => setFormOpen(!formOpen)}
            className="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-200 transition"
          >
            {formOpen ? 'Close Form' : 'Add Budget Item'}
          </button>
        </div>

        {/* Form */}
        {formOpen && (
          <form
            onSubmit={handleSubmit}
            className="bg-[#1e1e1e] rounded-2xl p-8 shadow-xl space-y-6 mb-12"
          >
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-black border border-gray-600 rounded-lg p-3 text-white"
              />
            </div>

            {/* Type Dropdown */}
            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full bg-black border border-gray-600 rounded-lg p-3 text-white"
              >
                <option>Labor</option>
                <option>Software</option>
                <option>Hardware</option>
                <option>Misc</option>
              </select>
            </div>

            {/* Estimated Cost */}
            <div>
              <label className="block text-sm font-medium mb-2">Estimated Cost ($)</label>
              <input
                type="number"
                name="estimatedCost"
                value={formData.estimatedCost}
                onChange={handleChange}
                required
                className="w-full bg-black border border-gray-600 rounded-lg p-3 text-white"
              />
            </div>

            {/* Actual Cost */}
            <div>
              <label className="block text-sm font-medium mb-2">Actual Cost ($)</label>
              <input
                type="number"
                name="actualCost"
                value={formData.actualCost}
                onChange={handleChange}
                className="w-full bg-black border border-gray-600 rounded-lg p-3 text-white"
              />
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium mb-2">Due Date (Optional)</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full bg-black border border-gray-600 rounded-lg p-3 text-white"
              />
            </div>

            {/* Assigned Project */}
            <div>
              <label className="block text-sm font-medium mb-2">Assigned Project (Optional)</label>
              <input
                type="text"
                name="assignedProject"
                value={formData.assignedProject}
                onChange={handleChange}
                className="w-full bg-black border border-gray-600 rounded-lg p-3 text-white"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-200 transition"
              >
                Save Budget Item
              </button>
            </div>
          </form>
        )}

        {/* Budget Items List */}
        <div className="space-y-6">
          {budgetItems.map(item => (
            <div
              key={item.id}
              className="bg-zinc-800/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-subtle"
            >
              <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
              <p className="text-gray-400 text-sm">Type: {item.type}</p>
              <p className="text-gray-400 text-sm">Estimated Cost: ${item.estimatedCost}</p>
              <p className="text-gray-400 text-sm">Actual Cost: ${item.actualCost || 'Not yet entered'}</p>
              {item.dueDate && (
                <p className="text-gray-400 text-sm">Due Date: {item.dueDate}</p>
              )}
              {item.assignedProject && (
                <p className="text-gray-400 text-sm">Assigned Project: {item.assignedProject}</p>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}