'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Team {
    _id: string;
    teamName: string;
    description: string;
    teamFor: string;
    status: string;
    teamLead?: {
        _id: string;
        name: string;
        email: string;
    };
    createdBy: {
        name: string;
    };
    createdAt: string;
}

export default function TeamsPage() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const router = useRouter();

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/teams', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setTeams(data);
        } catch (error) {
            console.error('Error fetching teams:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (teamId: string, teamName: string) => {
        if (!confirm(`Are you sure you want to delete team "${teamName}"?`)) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/teams/${teamId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                alert('Team deleted successfully');
                fetchTeams();
            } else {
                alert('Failed to delete team');
            }
        } catch (error) {
            console.error('Error deleting team:', error);
            alert('Error deleting team');
        }
    };

    const filteredTeams = teams.filter(team => {
        const matchesSearch = team.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            team.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || team.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl">Loading teams...</div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
                        <p className="text-gray-600 mt-2">Manage teams and their members</p>
                    </div>
                    <Link
                        href="/admin/teams/create"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        + Create Team
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Search Teams
                            </label>
                            <input
                                type="text"
                                placeholder="Search by name or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Filter by Status
                            </label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Teams List */}
                {filteredTeams.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <p className="text-gray-500 text-lg">No teams found</p>
                        <Link
                            href="/admin/teams/create"
                            className="text-blue-600 hover:text-blue-700 mt-2 inline-block"
                        >
                            Create your first team
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredTeams.map((team) => (
                            <div
                                key={team._id}
                                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-semibold text-gray-900">
                                                {team.teamName}
                                            </h3>
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${team.status === 'active'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                    }`}
                                            >
                                                {team.status}
                                            </span>
                                        </div>

                                        {team.description && (
                                            <p className="text-gray-600 mb-3">{team.description}</p>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-500">Team For:</span>
                                                <span className="ml-2 font-medium text-gray-900">
                                                    {team.teamFor}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Team Lead:</span>
                                                <span className="ml-2 font-medium text-gray-900">
                                                    {team.teamLead?.name || 'Not assigned'}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Created By:</span>
                                                <span className="ml-2 font-medium text-gray-900">
                                                    {team.createdBy.name}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 ml-4">
                                        <Link
                                            href={`/admin/teams/${team._id}`}
                                            className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-medium transition-colors"
                                        >
                                            View Details
                                        </Link>
                                        <Link
                                            href={`/admin/teams/${team._id}/members`}
                                            className="bg-green-50 hover:bg-green-100 text-green-600 px-4 py-2 rounded-lg font-medium transition-colors"
                                        >
                                            Manage Members
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(team._id, team.teamName)}
                                            className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg font-medium transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
