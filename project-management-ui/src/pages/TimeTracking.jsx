// src/pages/TimeTracking.jsx

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const TimeTracking = () => {
    const [timeLogs, setTimeLogs] = useState([]);

    useEffect(() => {
        // Fetch time tracking data from the API
        // For now, we'll use mock data
        const mockData = [
            {
                resource: 'Alice',
                role: 'Developer',
                project: 'Project Apollo',
                monthlyHours: {
                    Jan: 120,
                    Feb: 110,
                    Mar: 130,
                    Apr: 125,
                    May: 140,
                    Jun: 135,
                    Jul: 150,
                    Aug: 145,
                    Sep: 160,
                    Oct: 155,
                    Nov: 170,
                    Dec: 165,
                },
            },
            // Add more entries as needed
        ];

        setTimeLogs(mockData);
    }, []);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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
                    {timeLogs.map((log, index) => (
                        <tr key={index} className="border-b border-white/5 hover:bg-zinc-700/30 transition">
                            <td className="px-4 py-2">{log.resource}</td>
                            <td className="px-4 py-2">{log.role}</td>
                            <td className="px-4 py-2">{log.project}</td>
                            {months.map((month) => (
                                <td key={month} className="px-4 py-2 text-center">
                                    {log.monthlyHours[month] || 0}
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