import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchWrapper } from '../utils/fetchWrapper';
import { motion } from 'framer-motion';

const Signup = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    password: '',
    phone: '',
    address: '',
    organizationOption: 'join', // 'create' or 'join'
    organizationID: '',
    organizationName: '',
    organizationDescription: '',
    unitID: ''
  });
  const [status, setStatus] = useState({ loading: false, message: '', error: false });
  const [organizations, setOrganizations] = useState([]);
  const [units, setUnits] = useState([]);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // When organization option changes, reset related fields
    if (name === 'organizationOption') {
      setFormData(prev => ({
        ...prev,
        organizationID: '',
        organizationName: '',
        organizationDescription: '',
        unitID: ''
      }));
    }
    
    // When organization is selected, fetch its units
    if (name === 'organizationID' && value) {
      fetchUnits(value);
    }
  };

  const fetchOrganizations = async () => {
    try {
      const data = await fetchWrapper('/api/organizations', { method: 'GET' });
      setOrganizations(data);
    } catch (err) {
      setStatus({ loading: false, message: "Could not load organizations", error: true });
    }
  };

  const fetchUnits = async (organizationId) => {
    try {
      const data = await fetchWrapper(`/api/units/organization/${organizationId}`, { method: 'GET' });
      setUnits(data);
    } catch (err) {
      setStatus({ loading: false, message: "Could not load units", error: true });
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      // Validate personal info
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
        setStatus({ loading: false, message: "Please fill all required fields", error: true });
        return;
      }
      
      // Fetch organizations for step 2
      fetchOrganizations();
      setStatus({ loading: false, message: '', error: false });
      setStep(2);
    }
  };

  const handlePrevStep = () => {
    setStep(1);
    setStatus({ loading: false, message: '', error: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: '', error: false });

    try {
      // Format the data based on creating or joining an organization
      const dataToSend = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || '',
        address: formData.address || '',
        organizationOption: formData.organizationOption
      };
      
      if (formData.organizationOption === 'create') {
        dataToSend.organizationName = formData.organizationName;
        dataToSend.organizationDescription = formData.organizationDescription;
      } else {
        dataToSend.organizationID = formData.organizationID;
        dataToSend.unitID = formData.unitID;
      }

      const data = await fetchWrapper('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(dataToSend),
      });

      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setStatus({ loading: false, message: err.message, error: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-subtle space-y-5"
      >
        {step === 1 ? (
          <>
            <h2 className="text-2xl font-bold text-indigo-400">📝 Create Your Account</h2>
            <p className="text-sm text-zinc-400">Step 1: Personal Information</p>
            
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  className="w-full p-3 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <input
                  className="w-full p-3 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <input
                className="w-full p-3 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                className="w-full p-3 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <input
                className="w-full p-3 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="tel"
                name="phone"
                placeholder="Phone (optional)"
                value={formData.phone}
                onChange={handleChange}
              />
              <input
                className="w-full p-3 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="text"
                name="address"
                placeholder="Address (optional)"
                value={formData.address}
                onChange={handleChange}
              />

              <button
                type="button"
                onClick={handleNextStep}
                className="w-full p-3 rounded font-medium transition bg-indigo-500 hover:bg-indigo-600"
              >
                Next Step
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-indigo-400">🏢 Organization Setup</h2>
            <p className="text-sm text-zinc-400">Step 2: Join or Create an Organization</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex space-x-4 mb-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="organizationOption"
                    value="join"
                    checked={formData.organizationOption === 'join'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>Join Existing</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="organizationOption"
                    value="create"
                    checked={formData.organizationOption === 'create'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>Create New</span>
                </label>
              </div>

              {formData.organizationOption === 'join' ? (
                <>
                  <select
                    name="organizationID"
                    value={formData.organizationID}
                    onChange={handleChange}
                    className="w-full p-3 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select an Organization</option>
                    {organizations.map(org => (
                      <option key={org.organizationID} value={org.organizationID}>
                        {org.name}
                      </option>
                    ))}
                  </select>

                  {formData.organizationID && (
                    <select
                      name="unitID"
                      value={formData.unitID}
                      onChange={handleChange}
                      className="w-full p-3 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      <option value="">Select a Unit</option>
                      {units.map(unit => (
                        <option key={unit.unitID} value={unit.unitID}>
                          {unit.name}
                        </option>
                      ))}
                    </select>
                  )}
                </>
              ) : (
                <>
                  <input
                    className="w-full p-3 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    type="text"
                    name="organizationName"
                    placeholder="Organization Name"
                    value={formData.organizationName}
                    onChange={handleChange}
                    required
                  />
                  <textarea
                    className="w-full p-3 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    name="organizationDescription"
                    placeholder="Organization Description (optional)"
                    value={formData.organizationDescription}
                    onChange={handleChange}
                    rows="3"
                  />
                </>
              )}

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="w-1/2 p-3 rounded font-medium transition bg-zinc-700 hover:bg-zinc-600"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className={`w-1/2 p-3 rounded font-medium transition ${
                    status.loading
                      ? 'bg-indigo-700'
                      : 'bg-indigo-500 hover:bg-indigo-600'
                  }`}
                  disabled={status.loading}
                >
                  {status.loading ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </>
        )}

        {status.message && (
          <div className={`text-sm ${status.error ? 'text-red-400' : 'text-green-400'}`}>
            {status.message}
          </div>
        )}
        
        <div className="text-center text-sm text-zinc-400">
          Already have an account? <Link to="/login" className="text-indigo-400 hover:text-indigo-300">Login here</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
