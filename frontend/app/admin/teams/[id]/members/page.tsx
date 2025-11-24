'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    capacity: number;
    status: string;
}

interface TeamMember {
    _id: string;
    userId: {
        _id: string;
        name: string;
        email: string;
        role: string;
        capacity: number;
    };
}

export default function TeamMembersPage() {
    const params = useParams();
    const teamId = params.id as string;

    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [currentMembers, setCurrentMembers] = useState<TeamMember[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [teamName, setTeamName] = useState('');

    useEffect(() => {
        if (teamId) {
            fetchData();
        }
    }, [teamId]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');

            // Fetch team details and current members
            const teamResponse = await fetch(`http://localhost:5000/api/teams/${teamId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const teamData = await teamResponse.json();
            setTeamName(teamData.team.teamName);
            setCurrentMembers(teamData.members);

            // Fetch all users
            const usersResponse = await fetch('http://localhost:5000/api/admin/agents', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const usersData = await usersResponse.json();
            setAllUsers(usersData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddMembers = async () => {
        if (selectedUsers.length === 0) {
            alert('Please select at least one user to add');
            return;
        }

        try {
            const token = localStorage.getItem('token');

            // Add each selected user
            const promises = selectedUsers.map(userId =>
                fetch(`http://localhost:5000/api/teams/${teamId}/members`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ userId })
                })
            );

            const results = await Promise.all(promises);
            const successCount = results.filter(r => r.ok).length;

            if (successCount > 0) {
                alert(`Successfully added ${successCount} member(s)`);
                setSelectedUsers([]);
                fetchData();
            } else {
                alert('Failed to add members. They may already be in the team.');
            }
        } catch (error) {
            console.error('Error adding members:', error);
            alert('Error adding members');
        }
    };

    const handleRemoveMember = async (userId: string, userName: string) => {
        if (!confirm(`Remove ${userName} from this team?`)) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `http://localhost:5000/api/teams/${teamId}/members/${userId}`,
                {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            if (response.ok) {
                alert('Member removed successfully');
                fetchData();
            } else {
                alert('Failed to remove member');
            }
        } catch (error) {
            console.error('Error removing member:', error);
            alert('Error removing member');
        }
    };

    const toggleUserSelection = (userId: string) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    // Filter available users (not already in team)
    const currentMemberIds = currentMembers.map(m => m.userId._id);
    const availableUsers = allUsers.filter(user =>
        !currentMemberIds.includes(user._id) &&
        user.status === 'Active' &&
        (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href={`/admin/teams/${teamId}`}
                        className="text-blue-600 hover:text-blue-700 mb-4 inline-flex items-center"
                    >
                        ← Back to Team Details
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 mt-4">
                        Manage Members - {teamName}
                    </h1>
                    <p className="text-gray-600 mt-2">Add or remove team members</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Available Users */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Available Users ({availableUsers.length})
                        </h2>

                        {/* Search */}
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* User List */}
                        <div className="space-y-2 max-h-96 overflow-y-auto mb-4">
                            {availableUsers.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">No available users</p>
                            ) : (
                                availableUsers.map(user => (
                                    <div
                                        key={user._id}
                                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedUsers.includes(user._id)
                                                ? 'bg-blue-50 border-blue-500'
                                                : 'bg-white border-gray-200 hover:bg-gray-50'
                                            }`}
                                        onClick={() => toggleUserSelection(user._id)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900">{user.name}</div>
                                                <div className="text-sm text-gray-600">{user.email}</div>
                                                <div className="flex gap-2 mt-1">
                                                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                                                        {user.role}
                                                    </span>
                                                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded">
                                                        Capacity: {user.capacity}/5
                                                    </span>
                                                </div>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={selectedUsers.includes(user._id)}
                                                onChange={() => { }}
                                                className="w-5 h-5 text-blue-600"
                                            />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Add Button */}
                        <button
                            onClick={handleAddMembers}
                            disabled={selectedUsers.length === 0}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                            Add Selected Members ({selectedUsers.length})
                        </button>
                    </div>

                    {/* Current Members */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Current Members ({currentMembers.length})
                        </h2>

                        <div className="space-y-2 max-h-[500px] overflow-y-auto">
                            {currentMembers.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">No members in this team</p>
                            ) : (
                                currentMembers.map(member => (
                                    <div
                                        key={member._id}
                                        className="p-4 border border-gray-200 rounded-lg bg-white"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900">{member.userId.name}</div>
                                                <div className="text-sm text-gray-600">{member.userId.email}</div>
                                                <div className="flex gap-2 mt-1">
                                                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                                                        {member.userId.role}
                                                    </span>
                                                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded">
                                                        Capacity: {member.userId.capacity}/5
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveMember(member.userId._id, member.userId.name)}
                                                className="ml-4 text-red-600 hover:text-red-800 font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-blue-800">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">
                            Team Capacity: {currentMembers.reduce((sum, m) => sum + m.userId.capacity, 0)} total capacity units
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
