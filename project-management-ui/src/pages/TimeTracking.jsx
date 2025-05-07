// src/pages/TimeTracking.jsx

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const API_BASE_URL = 'http://localhost:3000/api';
const fetchOptions = {
  method: 'GET',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

const TimeTracking = () => {
  const [timeLogs, setTimeLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTimeLogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_BASE_URL}/time-tracking`, fetchOptions);
        if (!response.ok) throw new Error('Failed to fetch time logs');
        const data = await response.json();
        setTimeLogs(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching time logs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeLogs();
  }, []);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const groupedLogs = {};

  timeLogs.forEach(log => {
    const key = `${log.user.firstName} ${log.user.lastName}_${log.project.title}_${log.role}`;
    const month = new Date(log.dateWorked).getMonth();
    if (!groupedLogs[key]) {
      groupedLogs[key] = {
        resource: `${log.user.firstName} ${log.user.lastName}`,
        project: log.project.title,
        role: log.role,
        monthlyHours: Array(12).fill(0),
      };
    }
    groupedLogs[key].monthlyHours[month] += log.hoursSpent;
  });

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

      <motion.div
        className="overflow-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <table className="min-w-full text-sm text-left text-zinc-300">
          <thead className="bg-zinc-800/60 backdrop-blur border-b border-white/10">
            <tr>
              <th className="px-4 py-2">Resource</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Project</th>
              {months.map((month) => (
                <th key={month} className="px-4 py-2 text-center">
                  {month}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.values(groupedLogs).map((log, index) => (
              <tr key={index} className="border-b border-white/5 hover:bg-zinc-700/30 transition">
                <td className="px-4 py-2">{log.resource}</td>
                <td className="px-4 py-2">{log.role}</td>
                <td className="px-4 py-2">{log.project}</td>
                {log.monthlyHours.map((hours, idx) => (
                  <td key={idx} className="px-4 py-2 text-center">
                    {hours.toFixed(1)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};

export default TimeTracking;