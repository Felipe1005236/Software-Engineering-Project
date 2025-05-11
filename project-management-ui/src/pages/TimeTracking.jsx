// src/pages/TimeTracking.jsx

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaChevronUp, FaPlus } from 'react-icons/fa';

const API_BASE_URL = 'http://localhost:3000/api';
const fetchOptions = {
  method: 'GET',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const getYearsFromLogs = (logs) => {
  const years = new Set();
  logs.forEach(log => {
    const year = new Date(log.dateWorked).getFullYear();
    years.add(year);
  });
  const currentYear = new Date().getFullYear();
  years.add(currentYear);
  return Array.from(years).sort((a, b) => b - a);
};

const TimeTracking = () => {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [timeLogs, setTimeLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedUser, setExpandedUser] = useState(null);
  const [showTimeEntryForm, setShowTimeEntryForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newTimeEntry, setNewTimeEntry] = useState({
    hours: '',
    date: new Date().toISOString().split('T')[0],
    projectID: '',
  });
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [addMode, setAddMode] = useState('overwrite'); // 'overwrite' or 'accumulate'

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersResponse, timeLogsResponse, projectsResponse] = await Promise.all([
          fetch('http://localhost:3000/api/user-management'),
          fetch('http://localhost:3000/api/time-tracking'),
          fetch('http://localhost:3000/api/projects')
        ]);
        
        if (!usersResponse.ok || !timeLogsResponse.ok || !projectsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const [usersData, timeLogsData, projectsData] = await Promise.all([
          usersResponse.json(),
          timeLogsResponse.json(),
          projectsResponse.json()
        ]);

        setUsers(usersData);
        setTimeLogs(timeLogsData);
        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddTimeEntry = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/time-tracking`, {
        ...fetchOptions,
        method: 'POST',
        body: JSON.stringify({
          userID: selectedUser.userID,
          projectID: parseInt(newTimeEntry.projectID),
          hoursSpent: parseFloat(newTimeEntry.hours),
          dateWorked: newTimeEntry.date,
          mode: addMode,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add time entry');
      }
      
      // Refresh time logs
      const updatedLogsResponse = await fetch(`${API_BASE_URL}/time-tracking`, fetchOptions);
      const updatedLogs = await updatedLogsResponse.json();
      setTimeLogs(updatedLogs);
      
      // Reset form
      setNewTimeEntry({
        hours: '',
        date: new Date().toISOString().split('T')[0],
        projectID: '',
      });
      setShowTimeEntryForm(false);
    } catch (err) {
      setError(err.message);
      console.error('Error adding time entry:', err);
    }
  };

  const getUserTimeLogs = (userId) => {
    return timeLogs.filter(log => log.userID === userId);
  };

  // Returns { [projectID]: { project, role, [monthIdx]: hours } }
  const getProjectMonthMatrix = (userId, year) => {
    const logs = getUserTimeLogs(userId).filter(log => new Date(log.dateWorked).getFullYear() === year);
    const matrix = {};
    logs.forEach(log => {
      if (!matrix[log.projectID]) {
        matrix[log.projectID] = {
          project: log.project?.title || '-',
          role: log.role || '-',
          months: Array(12).fill(0)
        };
      }
      const monthIdx = new Date(log.dateWorked).getMonth();
      matrix[log.projectID].months[monthIdx] = log.hoursSpent;
    });
    return matrix;
  };

  // For collapsed view: returns [hours, ...] for each month
  const getMonthlyTotalsForYear = (userId, year) => {
    const matrix = getProjectMonthMatrix(userId, year);
    const monthlyTotals = Array(12).fill(0);
    Object.values(matrix).forEach(proj => {
      proj.months.forEach((h, idx) => { monthlyTotals[idx] += h; });
    });
    return monthlyTotals;
  };

  const years = getYearsFromLogs(timeLogs);

  if (loading) return <div className="p-6 text-white">Loading...</div>;
  if (error) return <div className="p-6 text-white text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 space-y-6 text-white">
      <motion.h1
        className="text-3xl font-bold"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Time Tracking
      </motion.h1>

      {/* Year Dropdown */}
      <div className="mb-4">
        <label className="mr-2 text-zinc-300 font-medium">Year:</label>
        <select
          value={selectedYear}
          onChange={e => setSelectedYear(Number(e.target.value))}
          className="bg-zinc-700 border border-zinc-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {/* Table header for months */}
        <div className="grid grid-cols-[160px_56px_repeat(12,48px)_auto] gap-0.5 px-2 py-1 text-zinc-400 font-semibold bg-zinc-900/60 rounded-t-lg text-xs">
          <span className="truncate">User</span>
          <span className="truncate">Total</span>
          {months.map(month => (
            <span key={month} className="text-center truncate">{month}</span>
          ))}
          <span></span>
        </div>
        {users.map((user) => {
          const monthlyTotals = getMonthlyTotalsForYear(user.userID, selectedYear);
          return (
            <div key={user.userID} className="bg-zinc-800/60 backdrop-blur border border-white/10 rounded-b-lg overflow-hidden">
              <div 
                className="grid grid-cols-[160px_56px_repeat(12,48px)_auto] gap-0.5 items-center px-2 py-1 cursor-pointer hover:bg-zinc-700/30 transition text-xs"
                onClick={() => setExpandedUser(expandedUser === user.userID ? null : user.userID)}
              >
                <span className="font-medium truncate">{user.firstName} {user.lastName}</span>
                <span className="text-zinc-400 font-semibold">{monthlyTotals.reduce((a, b) => a + b, 0).toFixed(1)}h</span>
                {monthlyTotals.map((hours, idx) => (
                  <span key={idx} className="text-center text-zinc-200">{hours.toFixed(1)}h</span>
                ))}
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setSelectedUser(user);
                    setShowTimeEntryForm(true);
                  }}
                  className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded hover:bg-blue-500/30 border border-blue-500/30 transition flex items-center space-x-2 text-xs"
                >
                  <FaPlus size={10} />
                  <span>Add</span>
                </button>
                <span className="justify-self-end">{expandedUser === user.userID ? <FaChevronUp /> : <FaChevronDown />}</span>
              </div>

              <AnimatePresence>
                {expandedUser === user.userID && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    {/* Expanded: Table layout, projects as rows, months as columns */}
                    <div className="px-2 py-1 border-t border-white/10">
                      <table className="min-w-full text-xs table-fixed">
                        <colgroup>
                          <col style={{ width: '160px' }} />
                          {months.map((_, idx) => (
                            <col key={idx} style={{ width: '48px' }} />
                          ))}
                          <col style={{ width: '1px' }} />
                        </colgroup>
                        <thead>
                          <tr>
                            <th className="bg-zinc-900/60 p-1 text-zinc-400 font-semibold text-left w-[160px]">Project</th>
                            {months.map((month, idx) => (
                              <th key={month} className="bg-zinc-900/60 p-1 text-zinc-400 font-semibold text-center w-[48px]">{month}</th>
                            ))}
                            <th className="w-[1px]"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.values(getProjectMonthMatrix(user.userID, selectedYear)).map((proj, i) => (
                            <tr key={i}>
                              <td className="bg-zinc-900/60 p-1 text-zinc-200 font-medium truncate w-[160px]">{proj.project}</td>
                              {proj.months.map((hours, idx) => (
                                <td
                                  key={idx}
                                  className="bg-zinc-900/40 p-1 min-h-[32px] text-blue-400 text-center relative group cursor-pointer w-[48px]"
                                >
                                  {hours > 0 ? (
                                    <>
                                      {hours.toFixed(1)}h
                                      <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 hidden group-hover:block bg-zinc-900 text-xs text-white px-2 py-1 rounded shadow-lg z-10 whitespace-nowrap">
                                        Role: {proj.role}
                                      </span>
                                    </>
                                  ) : '0.0h'}
                                </td>
                              ))}
                              <td className="w-[1px]"></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </motion.div>

      {/* Add Hours Modal */}
      {showTimeEntryForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <div className="bg-zinc-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Time Entry</h2>
            <form onSubmit={e => handleAddTimeEntry(e)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Project</label>
                <select
                  value={newTimeEntry.projectID}
                  onChange={e => setNewTimeEntry({ ...newTimeEntry, projectID: e.target.value })}
                  className="w-full bg-zinc-700 border border-zinc-600 rounded px-3 py-2"
                  required
                >
                  <option value="">Select a project</option>
                  {projects.map((project) => (
                    <option key={project.projectID} value={project.projectID}>
                      {project.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Hours</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={newTimeEntry.hours}
                  onChange={e => setNewTimeEntry({ ...newTimeEntry, hours: e.target.value })}
                  className="w-full bg-zinc-700 border border-zinc-600 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Month</label>
                <input
                  type="month"
                  value={newTimeEntry.date.substring(0, 7)}
                  onChange={e => setNewTimeEntry({ ...newTimeEntry, date: e.target.value + '-01' })}
                  className="w-full bg-zinc-700 border border-zinc-600 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mode</label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="addMode"
                      value="overwrite"
                      checked={addMode === 'overwrite'}
                      onChange={() => setAddMode('overwrite')}
                      className="form-radio text-blue-500"
                    />
                    <span>Overwrite</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="addMode"
                      value="accumulate"
                      checked={addMode === 'accumulate'}
                      onChange={() => setAddMode('accumulate')}
                      className="form-radio text-blue-500"
                    />
                    <span>Accumulate</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowTimeEntryForm(false)}
                  className="px-4 py-2 text-zinc-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Add Entry
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TimeTracking;