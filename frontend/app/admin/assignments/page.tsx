'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Project {
    _id: string;
    projectName: string;
}

interface Customer {
    _id: string;
    name?: string;
    phone?: string;
    email?: string;
}

interface Agent {
    _id: string;
    name: string;
    email: string;
    capacity: number;
    role: string;
}

interface CapacityInfo {
    currentAssignments: number;
    capacity: number;
    available: boolean;
    remaining: number;
}

export default function AssignmentsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState('');
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
    const [selectedAgent, setSelectedAgent] = useState('');
    const [capacityInfo, setCapacityInfo] = useState<CapacityInfo | null>(null);
    const [loading, setLoading] = useState(false);
    const [overrideCapacity, setOverrideCapacity] = useState(false);

    useEffect(() => {
        fetchProjects();
        fetchAgents();
    }, []);

    useEffect(() => {
        if (selectedProject) {
            fetchCustomers(selectedProject);
        }
    }, [selectedProject]);

    useEffect(() => {
        if (selectedAgent) {
            checkAgentCapacity(selectedAgent);
        }
    }, [selectedAgent]);

    const fetchProjects = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/admin/projects', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setProjects(data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const fetchCustomers = async (projectId: string) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/admin/projects/${projectId}/customers`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setCustomers(data);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    const fetchAgents = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/admin/agents', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setAgents(data);
        } catch (error) {
            console.error('Error fetching agents:', error);
        }
    };

    const checkAgentCapacity = async (agentId: string) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/admin/agents/${agentId}/capacity`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setCapacityInfo(data);
        } catch (error) {
            console.error('Error checking capacity:', error);
        }
    };

    const handleAssign = async () => {
        if (selectedCustomers.length === 0) {
            alert('Please select at least one customer');
            return;
        }

        if (!selectedAgent) {
            alert('Please select an agent');
            return;
        }

        if (capacityInfo && !capacityInfo.available && !overrideCapacity) {
            const confirm = window.confirm(
                `This agent has ${capacityInfo.currentAssignments} assignments (capacity: ${capacityInfo.capacity}). ` +
                `Assigning ${selectedCustomers.length} more will exceed capacity. Do you want to override?`
            );
            if (!confirm) return;
            setOverrideCapacity(true);
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/admin/assign', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    customerIds: selectedCustomers,
                    agentId: selectedAgent,
                    overrideCapacity
                })
            });

            if (response.ok) {
                const result = await response.json();
                alert(`Successfully assigned ${result.count} customers!`);
                setSelectedCustomers([]);
                setOverrideCapacity(false);
                checkAgentCapacity(selectedAgent);
            } else {
                const error = await response.json();
                alert(`Failed to assign: ${error.message}`);
            }
        } catch (error) {
            console.error('Error assigning customers:', error);
            alert('Error assigning customers');
        } finally {
            setLoading(false);
        }
    };

    const toggleCustomerSelection = (customerId: string) => {
        setSelectedCustomers(prev =>
            prev.includes(customerId)
                ? prev.filter(id => id !== customerId)
                : [...prev, customerId]
        );
    };

    const selectAll = () => {
        setSelectedCustomers(customers.map(c => c._id));
    };

    const deselectAll = () => {
        setSelectedCustomers([]);
    };

    const selectedAgentData = agents.find(a => a._id === selectedAgent);
    const willExceedCapacity = capacityInfo &&
        (capacityInfo.currentAssignments + selectedCustomers.length > capacityInfo.capacity);

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Assign Customers to Agents</h1>
                    <p className="text-gray-600 mt-2">Select customers and assign them to available agents</p>
                </div>

                {/* Selection Panel */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Project Selection */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">1. Select Project</h3>
                        <select
                            value={selectedProject}
                            onChange={(e) => {
                                setSelectedProject(e.target.value);
                                setSelectedCustomers([]);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                        >
                            <option value="" className="text-gray-900">Choose a project...</option>
                            {projects.map(project => (
                                <option key={project._id} value={project._id} className="text-gray-900">
                                    {project.projectName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Agent Selection */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">2. Select Agent</h3>
                        <select
                            value={selectedAgent}
                            onChange={(e) => setSelectedAgent(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                        >
                            <option value="" className="text-gray-900">Choose an agent...</option>
                            {agents.map(agent => (
                                <option key={agent._id} value={agent._id} className="text-gray-900">
                                    {agent.name} ({agent.role})
                                </option>
                            ))}
                        </select>

                        {/* Capacity Info */}
                        {capacityInfo && selectedAgentData && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                <div className="text-sm font-medium text-gray-700 mb-2">Capacity Status</div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Current:</span>
                                        <span className="font-medium">{capacityInfo.currentAssignments}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Capacity:</span>
                                        <span className="font-medium">{capacityInfo.capacity}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Available:</span>
                                        <span className={`font-medium ${capacityInfo.available ? 'text-green-600' : 'text-red-600'}`}>
                                            {capacityInfo.remaining} slots
                                        </span>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mt-3">
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all ${capacityInfo.currentAssignments >= capacityInfo.capacity
                                                ? 'bg-red-600'
                                                : 'bg-blue-600'
                                                }`}
                                            style={{
                                                width: `${Math.min((capacityInfo.currentAssignments / capacityInfo.capacity) * 100, 100)}%`
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Assignment Summary */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">3. Assignment Summary</h3>
                        <div className="space-y-3">
                            <div>
                                <div className="text-sm text-gray-600">Selected Customers</div>
                                <div className="text-2xl font-bold text-gray-900">{selectedCustomers.length}</div>
                            </div>

                            {willExceedCapacity && (
                                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <div className="flex items-start gap-2">
                                        <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        <div className="text-sm text-yellow-800">
                                            <div className="font-medium">Capacity Warning</div>
                                            <div>This assignment will exceed agent capacity</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={handleAssign}
                                disabled={loading || selectedCustomers.length === 0 || !selectedAgent}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                                {loading ? 'Assigning...' : 'Assign Customers'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Customers List */}
                {selectedProject && (
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Available Customers ({customers.length})
                            </h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={selectAll}
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Select All
                                </button>
                                <span className="text-gray-300">|</span>
                                <button
                                    onClick={deselectAll}
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Deselect All
                                </button>
                            </div>
                        </div>

                        {customers.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No customers available for this project</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {customers.map(customer => (
                                    <div
                                        key={customer._id}
                                        onClick={() => toggleCustomerSelection(customer._id)}
                                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedCustomers.includes(customer._id)
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900">{customer.name || 'Unnamed'}</div>
                                                <div className="text-sm text-gray-600 mt-1">{customer.phone || 'No phone'}</div>
                                                {customer.email && customer.email !== '***RESTRICTED***' && (
                                                    <div className="text-sm text-gray-600">{customer.email}</div>
                                                )}
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={selectedCustomers.includes(customer._id)}
                                                onChange={() => { }}
                                                className="w-5 h-5 text-blue-600"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
