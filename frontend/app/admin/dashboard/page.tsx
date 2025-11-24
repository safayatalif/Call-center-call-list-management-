'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface DashboardStats {
    totalUsers: number;
    totalTeams: number;
    totalAssignments: number;
    totalCallLogs: number;
    statusBreakdown: {
        [key: string]: number;
    };
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/reports/dashboard-summary', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setStats(data);
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
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

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-600 mt-2">Welcome to your call center management system</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Users */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Users</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {stats?.totalUsers || 0}
                                </p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Total Teams */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Teams</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {stats?.totalTeams || 0}
                                </p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-lg">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Total Assignments */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Assignments</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {stats?.totalAssignments || 0}
                                </p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-lg">
                                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Total Calls */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Calls</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {stats?.totalCallLogs || 0}
                                </p>
                            </div>
                            <div className="bg-orange-100 p-3 rounded-lg">
                                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Quick Links */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-2 gap-3">
                            <Link
                                href="/admin/teams"
                                className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <span className="font-medium text-gray-700">Manage Teams</span>
                            </Link>

                            <Link
                                href="/admin/agents"
                                className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                            >
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <span className="font-medium text-gray-700">Manage Agents</span>
                            </Link>

                            <Link
                                href="/admin/projects"
                                className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                            >
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                </svg>
                                <span className="font-medium text-gray-700">Manage Projects</span>
                            </Link>

                            <Link
                                href="/admin/assignments"
                                className="flex items-center gap-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                            >
                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <span className="font-medium text-gray-700">Assign Customers</span>
                            </Link>

                            <Link
                                href="/admin/projects"
                                className="flex items-center gap-3 p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors col-span-2"
                            >
                                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <span className="font-medium text-gray-700">Upload Call List (CSV)</span>
                            </Link>
                        </div>
                    </div>

                    {/* Call Status Overview */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Call Status Overview</h2>
                        {stats?.statusBreakdown && Object.keys(stats.statusBreakdown).length > 0 ? (
                            <div className="space-y-3">
                                {Object.entries(stats.statusBreakdown).slice(0, 5).map(([status, count]) => (
                                    <div key={status} className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">{status}</span>
                                        <div className="flex items-center gap-3">
                                            <div className="w-32 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full"
                                                    style={{
                                                        width: `${Math.min((count / stats.totalCallLogs) * 100, 100)}%`
                                                    }}
                                                />
                                            </div>
                                            <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                                                {count}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8">No call data available</p>
                        )}
                    </div>
                </div>

                {/* Additional Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link
                        href="/admin/monitoring"
                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold">Monitoring Dashboard</h3>
                                <p className="text-blue-100 text-sm mt-1">View real-time system metrics</p>
                            </div>
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                    </Link>

                    <Link
                        href="/admin/reports/activity-logs"
                        className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold">Activity Logs</h3>
                                <p className="text-purple-100 text-sm mt-1">View system activity history</p>
                            </div>
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
