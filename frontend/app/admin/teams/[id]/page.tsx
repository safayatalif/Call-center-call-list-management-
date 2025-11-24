'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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

interface TeamMember {
    _id: string;
    userId: {
        _id: string;
        name: string;
        email: string;
        role: string;
        capacity: number;
    };
    assignedDate: string;
    status: string;
}

export default function TeamDetailPage() {
    const params = useParams();
    const router = useRouter();
    const teamId = params.id as string;

    const [team, setTeam] = useState<Team | null>(null);
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        teamName: '',
        description: '',
        status: ''
    });

    useEffect(() => {
        if (teamId) {
            fetchTeamDetails();
        }
    }, [teamId]);

    const fetchTeamDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/teams/${teamId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setTeam(data.team);
            setMembers(data.members);
            setEditData({
                teamName: data.team.teamName,
                description: data.team.description || '',
                status: data.team.status
            });
        } catch (error) {
            console.error('Error fetching team details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/teams/${teamId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(editData)
            });

            if (response.ok) {
                alert('Team updated successfully!');
                setIsEditing(false);
                fetchTeamDetails();
            } else {
                alert('Failed to update team');
            }
        } catch (error) {
            console.error('Error updating team:', error);
            alert('Error updating team');
        }
    };

    const handleRemoveMember = async (memberId: string, memberName: string) => {
        if (!confirm(`Remove ${memberName} from this team?`)) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `http://localhost:5000/api/teams/${teamId}/members/${memberId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.ok) {
                alert('Member removed successfully');
                fetchTeamDetails();
            } else {
                alert('Failed to remove member');
            }
        } catch (error) {
            console.error('Error removing member:', error);
            alert('Error removing member');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl">Loading team details...</div>
            </div>
        );
    }

    if (!team) {
        return (
            <div className="p-8">
                <div className="text-center">
                    <p className="text-xl text-gray-600">Team not found</p>
                    <Link href="/admin/teams" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
                        Back to Teams
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/admin/teams"
                        className="text-blue-600 hover:text-blue-700 mb-4 inline-flex items-center"
                    >
                        ← Back to Teams
                    </Link>
                    <div className="flex justify-between items-start mt-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{team.teamName}</h1>
                            <p className="text-gray-600 mt-2">Team Details and Members</p>
                        </div>
                        <div className="flex gap-3">
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                                >
                                    Edit Team
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={handleUpdate}
                                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setEditData({
                                                teamName: team.teamName,
                                                description: team.description || '',
                                                status: team.status
                                            });
                                        }}
                                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </>
                            )}
                            <Link
                                href={`/admin/teams/${teamId}/members`}
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                            >
                                Manage Members
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Team Information */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Team Information</h2>

                    {isEditing ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Team Name
                                </label>
                                <input
                                    type="text"
                                    value={editData.teamName}
                                    onChange={(e) => setEditData({ ...editData, teamName: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={editData.description}
                                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <select
                                    value={editData.status}
                                    onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-gray-500">Description</p>
                                <p className="text-gray-900 mt-1">{team.description || 'No description'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Team Type</p>
                                <p className="text-gray-900 mt-1">{team.teamFor}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Team Lead</p>
                                <p className="text-gray-900 mt-1">
                                    {team.teamLead ? `${team.teamLead.name} (${team.teamLead.email})` : 'Not assigned'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Status</p>
                                <span
                                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${team.status === 'active'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                        }`}
                                >
                                    {team.status}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Created By</p>
                                <p className="text-gray-900 mt-1">{team.createdBy.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Created At</p>
                                <p className="text-gray-900 mt-1">
                                    {new Date(team.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Team Members */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Team Members ({members.length})
                        </h2>
                    </div>

                    {members.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No members assigned to this team</p>
                            <Link
                                href={`/admin/teams/${teamId}/members`}
                                className="text-blue-600 hover:text-blue-700 mt-2 inline-block"
                            >
                                Add members
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Role
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Capacity
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Assigned Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {members.map((member) => (
                                        <tr key={member._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-gray-900">{member.userId.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                                {member.userId.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                    {member.userId.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                                {member.userId.capacity}/5
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                                {new Date(member.assignedDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleRemoveMember(member.userId._id, member.userId.name)}
                                                    className="text-red-600 hover:text-red-800 font-medium"
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
