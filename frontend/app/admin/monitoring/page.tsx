'use client';

import { useState, useEffect } from 'react';
import StatCard from '@/components/StatCard';
import Link from 'next/link';

interface DashboardData {
    totalUsers: number;
    totalTeams: number;
    totalAssignments: number;
    totalCallLogs: number;
    statusBreakdown: { [key: string]: number };
    recentActivities: Array<{
        _id: string;
        action: string;
        performedBy: { name: string };
        details: string;
        createdAt: string;
    }>;
}

export default function MonitoringPage() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
        // Refresh every 30 seconds
        const interval = setInterval(fetchDashboardData, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/reports/dashboard-summary', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl">Loading dashboard...</div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="p-8">
                <div className="text-center text-red-600">Failed to load dashboard data</div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Monitoring Dashboard</h1>
                    <p className="text-gray-600 mt-2">Real-time system overview and activity monitoring</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Active Users"
                        value={data.totalUsers}
                        color="blue"
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        }
                    />
                    <StatCard
                        title="Active Teams"
                        value={data.totalTeams}
                        color="green"
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        }
                    />
                    <StatCard
                        title="Total Assignments"
                        value={data.totalAssignments}
                        color="purple"
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        }
                    />
                    <StatCard
                        title="Total Call Logs"
                        value={data.totalCallLogs}
                        color="yellow"
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        }
                    />
                </div>

                {/* Call Status Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Call Status Breakdown</h2>
                        <div className="space-y-3">
                            {Object.entries(data.statusBreakdown).map(([status, count]) => {
                                const total = Object.values(data.statusBreakdown).reduce((a, b) => a + b, 0);
                                const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0;

                                return (
                                    <div key={status} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="w-32 text-sm font-medium text-gray-700">{status}</div>
                                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full transition-all"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 ml-4">
                                            <span className="text-sm font-semibold text-gray-900">{count}</span>
                                            <span className="text-xs text-gray-500">({percentage}%)</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <Link
                                href="/admin/teams"
                                className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
                            >
                                <svg className="w-8 h-8 mx-auto mb-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <div className="font-medium text-gray-900">Manage Teams</div>
                            </Link>

                            <Link
                                href="/admin/agents"
                                className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-center"
                            >
                                <svg className="w-8 h-8 mx-auto mb-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <div className="font-medium text-gray-900">Manage Agents</div>
                            </Link>

                            <Link
                                href="/admin/projects"
                                className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-center"
                            >
                                <svg className="w-8 h-8 mx-auto mb-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                </svg>
                                <div className="font-medium text-gray-900">Manage Projects</div>
                            </Link>

                            <Link
                                href="/admin/reports/activity-logs"
                                className="p-4 border-2 border-gray-200 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-colors text-center"
                            >
                                <svg className="w-8 h-8 mx-auto mb-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <div className="font-medium text-gray-900">View Logs</div>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Recent Activities</h2>
                        <Link href="/admin/reports/activity-logs" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            View All →
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {data.recentActivities.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No recent activities</p>
                        ) : (
                            data.recentActivities.map((activity) => (
                                <div key={activity._id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                                        <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                            <span>By: {activity.performedBy.name}</span>
                                            <span>•</span>
                                            <span>{new Date(activity.createdAt).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
