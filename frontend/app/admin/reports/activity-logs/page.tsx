'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ActivityLog {
    _id: string;
    action: string;
    performedBy: {
        _id: string;
        name: string;
        email: string;
        role: string;
    };
    targetType: string;
    details: string;
    createdAt: string;
}

interface Pagination {
    currentPage: number;
    totalPages: number;
    totalLogs: number;
    limit: number;
}

export default function ActivityLogsPage() {
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        action: '',
        targetType: '',
        startDate: '',
        endDate: '',
        page: 1
    });

    useEffect(() => {
        fetchLogs();
    }, [filters.page]);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const params = new URLSearchParams();

            if (filters.action) params.append('action', filters.action);
            if (filters.targetType) params.append('targetType', filters.targetType);
            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate);
            params.append('page', filters.page.toString());
            params.append('limit', '20');

            const response = await fetch(`http://localhost:5000/api/reports/activity-logs?${params}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setLogs(data.logs);
            setPagination(data.pagination);
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFilters({ ...filters, page: 1 });
        fetchLogs();
    };

    const handlePageChange = (newPage: number) => {
        setFilters({ ...filters, page: newPage });
    };

    const getActionColor = (action: string) => {
        if (action.includes('Created')) return 'bg-green-100 text-green-800';
        if (action.includes('Updated')) return 'bg-blue-100 text-blue-800';
        if (action.includes('Deleted')) return 'bg-red-100 text-red-800';
        if (action.includes('Assigned')) return 'bg-purple-100 text-purple-800';
        return 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/admin/monitoring"
                        className="text-blue-600 hover:text-blue-700 mb-4 inline-flex items-center"
                    >
                        ← Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 mt-4">Activity Logs</h1>
                    <p className="text-gray-600 mt-2">View and filter system activity logs</p>
                </div>

                {/* Filters */}
                <form onSubmit={handleFilterSubmit} className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Action
                            </label>
                            <input
                                type="text"
                                placeholder="Search action..."
                                value={filters.action}
                                onChange={(e) => setFilters({ ...filters, action: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Target Type
                            </label>
                            <select
                                value={filters.targetType}
                                onChange={(e) => setFilters({ ...filters, targetType: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Types</option>
                                <option value="Assignment">Assignment</option>
                                <option value="Customer">Customer</option>
                                <option value="Project">Project</option>
                                <option value="Team">Team</option>
                                <option value="User">User</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={filters.startDate}
                                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                End Date
                            </label>
                            <input
                                type="date"
                                value={filters.endDate}
                                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                            Apply Filters
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setFilters({ action: '', targetType: '', startDate: '', endDate: '', page: 1 });
                                setTimeout(fetchLogs, 100);
                            }}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                </form>

                {/* Logs List */}
                {loading ? (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <div className="text-xl text-gray-600">Loading logs...</div>
                    </div>
                ) : logs.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <p className="text-gray-500 text-lg">No activity logs found</p>
                    </div>
                ) : (
                    <>
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Action
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Details
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Performed By
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Target Type
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date & Time
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {logs.map((log) => (
                                            <tr key={log._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                                                        {log.action}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900 max-w-md truncate">
                                                        {log.details}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{log.performedBy.name}</div>
                                                    <div className="text-xs text-gray-500">{log.performedBy.role}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm text-gray-600">{log.targetType}</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {new Date(log.createdAt).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Pagination */}
                        {pagination && pagination.totalPages > 1 && (
                            <div className="bg-white rounded-lg shadow-sm p-4 mt-6">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-600">
                                        Showing page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalLogs} total logs)
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                                            disabled={pagination.currentPage === 1}
                                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                                            disabled={pagination.currentPage === pagination.totalPages}
                                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
