import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchWrapper } from '../utils/fetchWrapper';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetchWrapper('/auth/requests');
      setRequests(response);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (requestId, action) => {
    try {
      await fetchWrapper(`/auth/requests/${requestId}/${action}`, {
        method: 'POST'
      });
      // Refresh the requests list
      fetchRequests();
    } catch (err) {
      setError(err.message || `Failed to ${action} request`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-600';
      case 'APPROVED':
        return 'bg-green-600';
      case 'REJECTED':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  const filteredRequests = requests.filter(request => {
    if (activeTab === 'pending') {
      return request.status === 'PENDING';
    }
    return request.status !== 'PENDING';
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white">Loading requests...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <h1 className="text-3xl font-bold">Join Requests</h1>
      </motion.div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-white/10">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'pending'
              ? 'text-white border-b-2 border-indigo-500'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Pending Requests
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'history'
              ? 'text-white border-b-2 border-indigo-500'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Request History
        </button>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="text-center text-zinc-400 py-8">
          {activeTab === 'pending' ? 'No pending requests' : 'No request history'}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredRequests.map((request) => (
            <motion.div
              key={request.requestID}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-800/60 backdrop-blur border border-white/10 rounded-lg p-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold">
                      {request.firstName} {request.lastName}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </div>
                  <p className="text-zinc-400">{request.email}</p>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-zinc-300">
                      <span className="text-zinc-400">Organization:</span> {request.organization?.name}
                    </p>
                    <p className="text-sm text-zinc-300">
                      <span className="text-zinc-400">Unit:</span> {request.unit?.name}
                    </p>
                    <p className="text-sm text-zinc-300">
                      <span className="text-zinc-400">Role:</span> {request.role}
                    </p>
                    <p className="text-sm text-zinc-300">
                      <span className="text-zinc-400">Submitted:</span>{' '}
                      {new Date(request.createdAt).toLocaleDateString()} at{' '}
                      {new Date(request.createdAt).toLocaleTimeString()}
                    </p>
                    {request.status !== 'PENDING' && (
                      <p className="text-sm text-zinc-300">
                        <span className="text-zinc-400">Updated:</span>{' '}
                        {new Date(request.updatedAt).toLocaleDateString()} at{' '}
                        {new Date(request.updatedAt).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </div>
                {request.status === 'PENDING' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRequest(request.requestID, 'approve')}
                      className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleRequest(request.requestID, 'reject')}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Requests; 