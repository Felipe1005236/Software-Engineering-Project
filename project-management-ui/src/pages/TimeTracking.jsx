// src/pages/TimeTracking.jsx

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const TimeTracking = () => {
  const [timeLogs, setTimeLogs] = useState([]);

  useEffect(() => {
    // Fetch time tracking data from the backend matching Prisma schema
    // Fields: user.name, role, project.name, hoursSpent, dateWorked
    // Replace with actual fetch call:
    // fetch('/api/time-tracking').then(res => res.json()).then(setTimeLogs);

    const placeholderData = [
      {
        user: { name: 'Alice' },
        role: 'Developer',
        project: { name: 'Project Apollo' },
        dateWorked: new Date('2025-01-15'),
        hoursSpent: 8,
      },
      {
        user: { name: 'Alice' },
        role: 'Developer',
        project: { name: 'Project Apollo' },
        dateWorked: new Date('2025-02-05'),
        hoursSpent: 7.5,
      },
      // Add more entries if needed
    ];

    setTimeLogs(placeholderData);
  }, []);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const groupedLogs = {};

  timeLogs.forEach(log => {
    const key = `${log.user.name}_${log.project.name}_${log.role}`;
    const month = new Date(log.dateWorked).getMonth();
    if (!groupedLogs[key]) {
      groupedLogs[key] = {
        resource: log.user.name,
        project: log.project.name,
        role: log.role,
        monthlyHours: Array(12).fill(0),
      };
    }
    groupedLogs[key].monthlyHours[month] += log.hoursSpent;
  });

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
                    {hours}
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