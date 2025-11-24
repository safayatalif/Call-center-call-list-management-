'use client';

import { useState, useEffect } from 'react';

interface Assignment {
    _id: string;
    customerId: {
        _id: string;
        name?: string;
        phone?: string;
    };
    agentId: {
        _id: string;
        name: string;
        email: string;
    };
}

interface Agent {
    _id: string;
    name: string;
    email: string;
    capacity: number;
}

interface HistoryRecord {
    _id: string;
    previousAgent?: {
        name: string;
    };
    newAgent: {
        name: string;
    };
    reassignedBy: {
        name: string;
    };
    reassignDate: string;
    reason?: string;
}

export default function ReassignPage() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [selectedSourceAgent, setSelectedSourceAgent] = useState('');
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [selectedAssignments, setSelectedAssignments] = useState<string[]>([]);
    const [selectedTargetAgent, setSelectedTargetAgent] = useState('');
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedAssignmentForHistory, setSelectedAssignmentForHistory] = useState<string | null>(null);
    const [history, setHistory] = useState<HistoryRecord[]>([]);

    useEffect(() => {
        fetchAgents();
    }, []);

    useEffect(() => {
        if (selectedSourceAgent) {
            fetchAssignments(selectedSourceAgent);
        }
    }, [selectedSourceAgent]);

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

    const fetchAssignments = async (agentId: string) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/admin/agent/${agentId}/customers`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setAssignments(data);
        } catch (error) {
            console.error('Error fetching assignments:', error);
        }
    };

    const fetchHistory = async (assignmentId: string) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/admin/assignments/${assignmentId}/history`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setHistory(data);
        } catch (error) {
            console.error('Error fetching history:', error);
        }
    };

    const handleReassign = async () => {
        if (selectedAssignments.length === 0) {
            alert('Please select at least one assignment');
            return;
        }

        if (!selectedTargetAgent) {
            alert('Please select a target agent');
            return;
        }

        if (selectedSourceAgent === selectedTargetAgent) {
            alert('Source and target agents cannot be the same');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/admin/reassign', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    assignmentIds: selectedAssignments,
                    newAgentId: selectedTargetAgent,
                    reason
                })
            });

            if (response.ok) {
                const result = await response.json();
                alert(`Successfully reassigned ${result.count} assignments!`);
                setSelectedAssignments([]);
                setReason('');
                fetchAssignments(selectedSourceAgent);
            } else {
                const error = await response.json();
                alert(`Failed to reassign: ${error.message}`);
            }
        } catch (error) {
            console.error('Error reassigning:', error);
            alert('Error reassigning customers');
        } finally {
            setLoading(false);
        }
    };

    const toggleAssignmentSelection = (assignmentId: string) => {
        setSelectedAssignments(prev =>
            prev.includes(assignmentId)
                ? prev.filter(id => id !== assignmentId)
                : [...prev, assignmentId]
        );
    };

    const viewHistory = (assignmentId: string) => {
        setSelectedAssignmentForHistory(assignmentId);
        fetchHistory(assignmentId);
    };

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Reassign Customers</h1>
                    <p className="text-gray-600 mt-2">Move customer assignments between agents with history tracking</p>
                </div>

                {/* Selection Panel */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Source Agent */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">1. From Agent</h3>
                        <select
                            value={selectedSourceAgent}
                            onChange={(e) => {
                                setSelectedSourceAgent(e.target.value);
                                setSelectedAssignments([]);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Select source agent...</option>
                            {agents.map(agent => (
                                <option key={agent._id} value={agent._id}>
                                    {agent.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Target Agent */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">2. To Agent</h3>
                        <select
                            value={selectedTargetAgent}
                            onChange={(e) => setSelectedTargetAgent(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Select target agent...</option>
                            {agents.filter(a => a._id !== selectedSourceAgent).map(agent => (
                                <option key={agent._id} value={agent._id}>
                                    {agent.name} (Capacity: {agent.capacity})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Summary */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">3. Summary</h3>
                        <div className="space-y-3">
                            <div>
                                <div className="text-sm text-gray-600">Selected Assignments</div>
                                <div className="text-2xl font-bold text-gray-900">{selectedAssignments.length}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reason */}
                {selectedAssignments.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Reason for Reassignment
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={3}
                            placeholder="Enter the reason for reassignment..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                            onClick={handleReassign}
                            disabled={loading || !selectedTargetAgent}
                            className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                            {loading ? 'Reassigning...' : `Reassign ${selectedAssignments.length} Assignment(s)`}
                        </button>
                    </div>
                )}

                {/* Assignments List */}
                {selectedSourceAgent && (
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Current Assignments ({assignments.length})
                        </h3>

                        {assignments.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No assignments for this agent</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedAssignments.length === assignments.length}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedAssignments(assignments.map(a => a._id));
                                                        } else {
                                                            setSelectedAssignments([]);
                                                        }
                                                    }}
                                                    className="w-4 h-4"
                                                />
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Customer
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Phone
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {assignments.map(assignment => (
                                            <tr key={assignment._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedAssignments.includes(assignment._id)}
                                                        onChange={() => toggleAssignmentSelection(assignment._id)}
                                                        className="w-4 h-4"
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-gray-900">
                                                        {assignment.customerId.name || 'Unnamed'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {assignment.customerId.phone || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => viewHistory(assignment._id)}
                                                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                                                    >
                                                        View History
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* History Modal */}
                {selectedAssignmentForHistory && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                            <div className="flex items-center justify-between p-6 border-b">
                                <h2 className="text-xl font-semibold text-gray-900">Assignment History</h2>
                                <button
                                    onClick={() => setSelectedAssignmentForHistory(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="p-6">
                                {history.length === 0 ? (
                                    <p className="text-gray-500 text-center py-8">No reassignment history</p>
                                ) : (
                                    <div className="space-y-4">
                                        {history.map((record) => (
                                            <div key={record._id} className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex-1">
                                                        <div className="font-medium text-gray-900">
                                                            {record.previousAgent?.name || 'Initial Assignment'} → {record.newAgent.name}
                                                        </div>
                                                        <div className="text-sm text-gray-600 mt-1">
                                                            By: {record.reassignedBy.name}
                                                        </div>
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {new Date(record.reassignDate).toLocaleString()}
                                                    </div>
                                                </div>
                                                {record.reason && (
                                                    <div className="mt-2 p-3 bg-gray-50 rounded text-sm text-gray-700">
                                                        <span className="font-medium">Reason:</span> {record.reason}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
