"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

interface Agent {
    _id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    capacity: number;
    personalMobile?: string;
    officialMobile?: string;
}

export default function AgentsPage() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'AGENT',
        capacity: 3,
        personalMobile: '',
        alternateMobile: '',
        officialMobile: '',
        facebookId: '',
        linkedinId: '',
        whatsappId: '',
        address: '',
        remarks: '',
        status: 'Active',
        restrictedDataPrivilege: false
    });

    const { token } = useAuth();

    useEffect(() => {
        fetchAgents();
    }, [token]);

    const fetchAgents = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/agents', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAgents(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const socialMediaIds = {
                facebook: formData.facebookId,
                linkedin: formData.linkedinId,
                whatsapp: formData.whatsappId
            };

            await axios.post('http://localhost:5000/api/admin/agents',
                { ...formData, socialMediaIds },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Reset form
            setFormData({
                name: '',
                email: '',
                password: '',
                role: 'AGENT',
                capacity: 3,
                personalMobile: '',
                alternateMobile: '',
                officialMobile: '',
                facebookId: '',
                linkedinId: '',
                whatsappId: '',
                address: '',
                remarks: '',
                status: 'Active',
                restrictedDataPrivilege: false
            });

            fetchAgents();
            alert('User created successfully!');
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || 'Error creating user');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-gray-900">User Management</h1>

                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 mb-8">
                    <h2 className="text-xl font-semibold mb-6 text-gray-800">Create New User</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Role & Status */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="AGENT">Agent</option>
                                    <option value="MANAGER">Manager</option>
                                    <option value="ADMIN">Admin</option>
                                    <option value="TRAINEE">Trainee</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Closed">Closed</option>
                                    <option value="Undefined">Undefined</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity (Tasks)</label>
                                <input
                                    type="number"
                                    name="capacity"
                                    min="0"
                                    max="5"
                                    value={formData.capacity}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Personal Mobile</label>
                                <input
                                    type="text"
                                    name="personalMobile"
                                    value={formData.personalMobile}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Mobile</label>
                                <input
                                    type="text"
                                    name="alternateMobile"
                                    value={formData.alternateMobile}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Official Mobile</label>
                                <input
                                    type="text"
                                    name="officialMobile"
                                    value={formData.officialMobile}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Social Media */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Facebook ID</label>
                                <input
                                    type="text"
                                    name="facebookId"
                                    value={formData.facebookId}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn ID</label>
                                <input
                                    type="text"
                                    name="linkedinId"
                                    value={formData.linkedinId}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp ID</label>
                                <input
                                    type="text"
                                    name="whatsappId"
                                    value={formData.whatsappId}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    rows={2}
                                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                                <textarea
                                    name="remarks"
                                    value={formData.remarks}
                                    onChange={handleChange}
                                    rows={2}
                                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Privileges */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="restrictedDataPrivilege"
                                name="restrictedDataPrivilege"
                                checked={formData.restrictedDataPrivilege}
                                onChange={handleChange}
                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="restrictedDataPrivilege" className="text-sm font-medium text-gray-700">
                                Restricted Data Privilege (Can view masked data)
                            </label>
                        </div>

                        <div className="flex justify-end">
                            <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors shadow-md">
                                Create User
                            </button>
                        </div>
                    </form>
                </div>

                {/* Users List */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">Existing Users</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {agents.map((agent) => (
                                    <tr key={agent._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-gray-900">{agent.name}</div>
                                            <div className="text-sm text-gray-500">{agent.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {agent.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div>{agent.personalMobile || '-'}</div>
                                            <div className="text-xs text-gray-400">{agent.officialMobile ? `Official: ${agent.officialMobile}` : ''}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {agent.capacity}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${agent.status === 'Active' ? 'bg-green-100 text-green-800' :
                                                    agent.status === 'Closed' ? 'bg-red-100 text-red-800' :
                                                        'bg-gray-100 text-gray-800'
                                                }`}>
                                                {agent.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
