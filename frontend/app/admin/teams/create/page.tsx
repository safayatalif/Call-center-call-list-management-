'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
}

export default function CreateTeamPage() {
    const [formData, setFormData] = useState({
        teamName: '',
        description: '',
        teamFor: 'Any',
        teamLead: '',
        status: 'active'
    });
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const router = useRouter();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/admin/agents', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.teamName.trim()) {
            newErrors.teamName = 'Team name is required';
        }

        if (!formData.teamFor) {
            newErrors.teamFor = 'Team type is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/teams', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    teamLead: formData.teamLead || undefined
                })
            });

            if (response.ok) {
                alert('Team created successfully!');
                router.push('/admin/teams');
            } else {
                const error = await response.json();
                alert(`Failed to create team: ${error.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error creating team:', error);
            alert('Error creating team');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <div className="p-8">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/admin/teams"
                        className="text-blue-600 hover:text-blue-700 mb-4 inline-flex items-center"
                    >
                        ← Back to Teams
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 mt-4">Create New Team</h1>
                    <p className="text-gray-600 mt-2">Set up a new team for your call center</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8">
                    <div className="space-y-6">
                        {/* Team Name */}
                        <div>
                            <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-2">
                                Team Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="teamName"
                                name="teamName"
                                value={formData.teamName}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.teamName ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Enter team name"
                            />
                            {errors.teamName && (
                                <p className="text-red-500 text-sm mt-1">{errors.teamName}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter team description"
                            />
                        </div>

                        {/* Team For */}
                        <div>
                            <label htmlFor="teamFor" className="block text-sm font-medium text-gray-700 mb-2">
                                Team Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="teamFor"
                                name="teamFor"
                                value={formData.teamFor}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.teamFor ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            >
                                <option value="Any">Any</option>
                                <option value="Page Moderator">Page Moderator</option>
                                <option value="Re-Order">Re-Order</option>
                                <option value="Corporate">Corporate</option>
                                <option value="Company Wise">Company Wise</option>
                            </select>
                            {errors.teamFor && (
                                <p className="text-red-500 text-sm mt-1">{errors.teamFor}</p>
                            )}
                        </div>

                        {/* Team Lead */}
                        <div>
                            <label htmlFor="teamLead" className="block text-sm font-medium text-gray-700 mb-2">
                                Team Lead (Optional)
                            </label>
                            <select
                                id="teamLead"
                                name="teamLead"
                                value={formData.teamLead}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Select a team lead</option>
                                {users.map(user => (
                                    <option key={user._id} value={user._id}>
                                        {user.name} ({user.email}) - {user.role}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Status */}
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 mt-8">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                            {loading ? 'Creating...' : 'Create Team'}
                        </button>
                        <Link
                            href="/admin/teams"
                            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors text-center"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
