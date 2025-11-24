"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

export default function AgentDashboard() {
    const [stats, setStats] = useState({
        assigned: 0,
        completed: 0,
        pending: 0
    });
    const { token } = useAuth();

    useEffect(() => {
        // Fetch stats or calculate from my-calls
        fetchStats();
    }, [token]);

    const fetchStats = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/agent/my-calls', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const calls = res.data;
            const completed = calls.filter((c: any) => c.callStatus?.status === 'completed').length;
            const pending = calls.filter((c: any) => c.callStatus?.status === 'pending' || !c.callStatus).length;

            setStats({
                assigned: calls.length,
                completed,
                pending
            });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Agent Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-xl font-semibold mb-2">Assigned Calls</h2>
                    <p className="text-3xl font-bold">{stats.assigned}</p>
                </div>
                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-xl font-semibold mb-2">Completed</h2>
                    <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
                </div>
                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-xl font-semibold mb-2">Pending</h2>
                    <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
            </div>
        </div>
    );
}
