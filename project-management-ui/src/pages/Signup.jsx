import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchWrapper } from '../utils/fetchWrapper';

const PersonalInfoForm = ({ formData, setFormData }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <input
        className="w-full p-3 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        type="text"
        placeholder="First Name"
        value={formData.firstName}
        onChange={e => setFormData({ ...formData, firstName: e.target.value })}
        required
      />
      <input
        className="w-full p-3 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        type="text"
        placeholder="Last Name"
        value={formData.lastName}
        onChange={e => setFormData({ ...formData, lastName: e.target.value })}
        required
      />
    </div>
    <input
      className="w-full p-3 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      type="email"
      placeholder="Email"
      value={formData.email}
      onChange={e => setFormData({ ...formData, email: e.target.value })}
      required
    />
    <input
      className="w-full p-3 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      type="password"
      placeholder="Password"
      value={formData.password}
      onChange={e => setFormData({ ...formData, password: e.target.value })}
      required
    />
    <input
      className="w-full p-3 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      type="text"
      placeholder="Address"
      value={formData.address}
      onChange={e => setFormData({ ...formData, address: e.target.value })}
    />
    <input
      className="w-full p-3 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      type="tel"
      placeholder="Phone"
      value={formData.phone}
      onChange={e => setFormData({ ...formData, phone: e.target.value })}
    />
  </div>
);

const JoinOrgForm = ({ formData, setFormData, organizations, units, loading }) => {
  console.log('JoinOrgForm props:', { organizations, units, formData });
  
  // Get units for the selected organization
  const organizationUnits = units.filter(unit => 
    unit.organizationID === (formData.organizationID ? parseInt(formData.organizationID) : null)
  );
  
  console.log('Filtered units for organization:', organizationUnits);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-zinc-400 mb-1">Organization</label>
        <select
          className="w-full p-3 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={formData.organizationID}
          onChange={e => setFormData({ ...formData, organizationID: e.target.value, unitID: '' })}
          required
          disabled={loading}
        >
          <option value="">Select Organization</option>
          {organizations.map(org => (
            <option key={org.organizationID} value={org.organizationID.toString()}>
              {org.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm text-zinc-400 mb-1">Unit</label>
        <select
          className="w-full p-3 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={formData.unitID}
          onChange={e => setFormData({ ...formData, unitID: e.target.value })}
          required
          disabled={loading || !formData.organizationID}
        >
          <option value="">Select Unit</option>
          {organizationUnits.map(unit => (
            <option key={unit.unitID} value={unit.unitID.toString()}>
              {unit.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default function Signup() {
  const [step, setStep] = useState('select'); // 'select', 'join', 'create'
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    address: '',
    phone: '',
    organizationID: '',
    unitID: ''
  });
  const [status, setStatus] = useState({ loading: false, message: '', error: false });
  const [organizations, setOrganizations] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (step === 'join') {
      fetchOrganizations();
    }
  }, [step]);

  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      console.log('Fetching organizations...');
      // Fetch all organizations
      const response = await fetchWrapper('/organizations');
      console.log('Raw API response:', response);
      
      // Check if response is an error object
      if (response.error) {
        console.error('API returned error:', response.error);
        throw new Error(response.error);
      }

      // Ensure we have valid data
      if (!response || !Array.isArray(response)) {
        console.error('Invalid response format:', response);
        throw new Error('Invalid response format from organizations endpoint');
      }

      // Transform the organizations data to include nested units
      const transformedOrgs = response.map(org => ({
        organizationID: org.organizationID,
        name: org.name,
        description: org.description,
        units: org.units || []
      }));
      
      console.log('Transformed organizations:', transformedOrgs);
      setOrganizations(transformedOrgs);
      
      // Extract all units from organizations
      const allUnits = transformedOrgs.reduce((acc, org) => {
        const orgUnits = (org.units || []).map(unit => ({
          unitID: unit.unitID,
          name: unit.name,
          description: unit.description,
          organizationID: org.organizationID
        }));
        return [...acc, ...orgUnits];
      }, []);
      
      console.log('Extracted units:', allUnits);
      setUnits(allUnits);
    } catch (err) {
      console.error('Error fetching organizations:', err);
      // Log the full error object for debugging
      console.error('Full error details:', {
        message: err.message,
        stack: err.stack,
        response: err.response
      });
      
      setStatus({ 
        loading: false, 
        message: err.message || 'Failed to load organizations. Please try again later.', 
        error: true 
      });
      
      // Set fallback data for development
      setOrganizations([
        { 
          organizationID: 1, 
          name: 'Constructor University',
          description: 'Institute of Education found in Bremen, Germany',
          units: [
            { unitID: 1, name: 'Software Development Wing', organizationID: 1 }
          ]
        }
      ]);
      setUnits([
        { unitID: 1, organizationID: 1, name: 'Software Development Wing' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: '', error: false });

    try {
      if (step === 'join') {
        // Create join request
        const { organizationID, unitID, ...rest } = formData;
        const response = await fetchWrapper('/auth/request', {
          method: 'POST',
          body: JSON.stringify({
            ...rest,
            organizationID: parseInt(organizationID),
            unitID: parseInt(unitID),
            role: 'USER'
          })
        });

        if (response.error) {
          throw new Error(response.error);
        }

        setStatus({ 
          loading: false, 
          message: 'Join request submitted successfully! Please wait for approval.', 
          error: false 
        });
        
        // Redirect to login after 2 seconds
        setTimeout(() => navigate('/login'), 2000);
      } else {
        // Store user data for organization creation
        localStorage.setItem('signupData', JSON.stringify(formData));
        // Handle create organization flow
        navigate('/create-org');
      }
    } catch (err) {
      setStatus({ 
        loading: false, 
        message: err.message || 'Failed to submit request', 
        error: true 
      });
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'select':
        return (
          <div className="space-y-4 w-full">
            <h2 className="text-2xl font-bold text-indigo-400 mb-2">Choose Your Path</h2>
            <button
              onClick={() => setStep('join')}
              className="w-full p-4 rounded font-bold text-lg bg-indigo-500 hover:bg-indigo-600 transition"
            >
              Join an Existing Organization
            </button>
            <button
              onClick={() => setStep('create')}
              className="w-full p-4 rounded font-bold text-lg bg-zinc-700 hover:bg-zinc-600 transition"
            >
              Create a New Organization
            </button>
          </div>
        );
      case 'join':
      case 'create':
        return (
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <h2 className="text-2xl font-bold text-indigo-400 mb-2">
              {step === 'join' ? 'Join Organization' : 'Create Organization'}
            </h2>
            <PersonalInfoForm formData={formData} setFormData={setFormData} />
            {step === 'join' && (
              <JoinOrgForm 
                formData={formData} 
                setFormData={setFormData} 
                organizations={organizations}
                units={units}
                loading={loading}
              />
            )}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep('select')}
                className="flex-1 p-3 rounded font-medium bg-zinc-700 hover:bg-zinc-600 transition"
              >
                Back
              </button>
              <button
                type="submit"
                className={`flex-1 p-3 rounded font-medium transition ${status.loading ? 'bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'}`}
                disabled={status.loading}
              >
                {status.loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-subtle space-y-8 flex flex-col items-center"
      >
        {renderStep()}
        {status.message && (
          <div className={`text-sm ${status.error ? 'text-red-400' : 'text-green-400'}`}>{status.message}</div>
        )}
        <div className="text-center text-sm text-zinc-400 mt-4">
          Already have an account? <Link to="/login" className="text-indigo-400 hover:text-indigo-300">Login here</Link>
        </div>
      </motion.div>
    </div>
  );
}
