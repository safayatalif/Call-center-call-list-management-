'use client';

import { useState, useEffect } from 'react';
import CallActionButtons from '@/components/CallActionButtons';
import ScheduleContactModal from '@/components/ScheduleContactModal';
import CallResultForm from '@/components/CallResultForm';
import AdvancedFilterPanel from '@/components/AdvancedFilterPanel';

interface Customer {
    _id: string;
    name?: string;
    phone?: string;
    email?: string;
    countryCode?: string;
    facebookLink?: string;
    linkedinLink?: string;
    area?: string;
    customerType?: string;
}

interface CallStatus {
    _id: string;
    status: string;
    notes?: string;
    priority?: string;
    targetDateTime?: string;
    communicationMethod?: string;
    createdAt: string;
}

interface Call {
    _id: string;
    customerId: Customer;
    assignedBy: { name: string };
    createdAt: string;
    callStatus?: CallStatus;
}

export default function MyCallsPage() {
    const [calls, setCalls] = useState<Call[]>([]);
    const [filteredCalls, setFilteredCalls] = useState<Call[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCall, setSelectedCall] = useState<Call | null>(null);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [showResultForm, setShowResultForm] = useState(false);
    const [expandedCallId, setExpandedCallId] = useState<string | null>(null);
    const [callHistory, setCallHistory] = useState<{ [key: string]: CallStatus[] }>({});

    useEffect(() => {
        fetchCalls();
    }, []);

    const fetchCalls = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/agent/my-calls', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setCalls(data);
            setFilteredCalls(data);
        } catch (error) {
            console.error('Error fetching calls:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCallHistory = async (assignmentId: string) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/agent/call/${assignmentId}/history`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setCallHistory(prev => ({ ...prev, [assignmentId]: data }));
        } catch (error) {
            console.error('Error fetching call history:', error);
        }
    };

    const handleFilterChange = async (filters: any) => {
        try {
            const token = localStorage.getItem('token');
            const params = new URLSearchParams();

            if (filters.status) params.append('status', filters.status);
            if (filters.priority) params.append('priority', filters.priority);
            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate);
            if (filters.customerType) params.append('customerType', filters.customerType);
            if (filters.search) params.append('search', filters.search);

            const response = await fetch(`http://localhost:5000/api/agent/calls/filter?${params}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setFilteredCalls(data);
        } catch (error) {
            console.error('Error filtering calls:', error);
        }
    };

    const handleResetFilters = () => {
        setFilteredCalls(calls);
    };

    const handleSchedule = async (data: any) => {
        if (!selectedCall) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/agent/call/${selectedCall._id}/schedule`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert('Contact scheduled successfully!');
                setShowScheduleModal(false);
                setSelectedCall(null);
                fetchCalls();
            } else {
                alert('Failed to schedule contact');
            }
        } catch (error) {
            console.error('Error scheduling contact:', error);
            alert('Error scheduling contact');
        }
    };

    const handleCallResult = async (data: any) => {
        if (!selectedCall) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/agent/call/${selectedCall._id}/update-status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert('Call result saved successfully!');
                setShowResultForm(false);
                setSelectedCall(null);
                fetchCalls();
            } else {
                alert('Failed to save call result');
            }
        } catch (error) {
            console.error('Error saving call result:', error);
            alert('Error saving call result');
        }
    };

    const handleActionClick = (call: Call, method: string) => {
        // Optionally log the action or update UI
        console.log(`${method} action clicked for customer:`, call.customerId.name);
    };

    const toggleHistory = (callId: string) => {
        if (expandedCallId === callId) {
            setExpandedCallId(null);
        } else {
            setExpandedCallId(callId);
            if (!callHistory[callId]) {
                fetchCallHistory(callId);
            }
        }
    };

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'Sales Generated':
                return 'bg-green-100 text-green-800';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'Closed':
            case 'Not Relevant':
                return 'bg-gray-100 text-gray-800';
            case 'Not Reachable':
            case 'Non-Responsive':
                return 'bg-red-100 text-red-800';
            case 'Scheduled':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority?: string) => {
        switch (priority) {
            case 'High':
                return 'bg-red-100 text-red-800';
            case 'Medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'Low':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl">Loading your calls...</div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Calls</h1>
                    <p className="text-gray-600 mt-2">Manage your assigned customer calls</p>
                </div>

                {/* Advanced Filters */}
                <AdvancedFilterPanel
                    onFilterChange={handleFilterChange}
                    onReset={handleResetFilters}
                />

                {/* Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="text-sm text-gray-600">Total Calls</div>
                        <div className="text-2xl font-bold text-gray-900">{filteredCalls.length}</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="text-sm text-gray-600">Pending</div>
                        <div className="text-2xl font-bold text-yellow-600">
                            {filteredCalls.filter(c => c.callStatus?.status === 'Pending').length}
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="text-sm text-gray-600">Sales Generated</div>
                        <div className="text-2xl font-bold text-green-600">
                            {filteredCalls.filter(c => c.callStatus?.status === 'Sales Generated').length}
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="text-sm text-gray-600">Scheduled</div>
                        <div className="text-2xl font-bold text-blue-600">
                            {filteredCalls.filter(c => c.callStatus?.status === 'Scheduled').length}
                        </div>
                    </div>
                </div>

                {/* Calls List */}
                {filteredCalls.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <p className="text-gray-500 text-lg">No calls found</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredCalls.map((call) => (
                            <div key={call._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                                <div className="p-6">
                                    {/* Customer Info */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                {call.customerId.name || 'Unnamed Customer'}
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                                                <div>
                                                    <span className="font-medium">Phone:</span>{' '}
                                                    {call.customerId.phone || 'N/A'}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Email:</span>{' '}
                                                    {call.customerId.email || 'N/A'}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Area:</span>{' '}
                                                    {call.customerId.area || 'N/A'}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Type:</span>{' '}
                                                    {call.customerId.customerType || 'Undefined'}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status Badge */}
                                        <div className="flex flex-col items-end gap-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(call.callStatus?.status)}`}>
                                                {call.callStatus?.status || 'Pending'}
                                            </span>
                                            {call.callStatus?.priority && (
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(call.callStatus.priority)}`}>
                                                    {call.callStatus.priority} Priority
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Latest Notes */}
                                    {call.callStatus?.notes && (
                                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                            <div className="text-sm font-medium text-gray-700 mb-1">Latest Notes:</div>
                                            <div className="text-sm text-gray-600">{call.callStatus.notes}</div>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap gap-3 mb-4">
                                        <CallActionButtons
                                            customer={call.customerId}
                                            onActionClick={(method) => handleActionClick(call, method)}
                                        />
                                    </div>

                                    {/* Management Buttons */}
                                    <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                                        <button
                                            onClick={() => {
                                                setSelectedCall(call);
                                                setShowResultForm(true);
                                            }}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                        >
                                            Record Call Result
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedCall(call);
                                                setShowScheduleModal(true);
                                            }}
                                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                        >
                                            Schedule Next Contact
                                        </button>
                                        <button
                                            onClick={() => toggleHistory(call._id)}
                                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors"
                                        >
                                            {expandedCallId === call._id ? 'Hide History' : 'View History'}
                                        </button>
                                    </div>

                                    {/* Call History */}
                                    {expandedCallId === call._id && (
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <h4 className="font-semibold text-gray-900 mb-3">Call History</h4>
                                            {callHistory[call._id] ? (
                                                callHistory[call._id].length === 0 ? (
                                                    <p className="text-gray-500 text-sm">No history available</p>
                                                ) : (
                                                    <div className="space-y-3">
                                                        {callHistory[call._id].map((log) => (
                                                            <div key={log._id} className="bg-gray-50 rounded-lg p-3">
                                                                <div className="flex justify-between items-start mb-2">
                                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                                                                        {log.status}
                                                                    </span>
                                                                    <span className="text-xs text-gray-500">
                                                                        {new Date(log.createdAt).toLocaleString()}
                                                                    </span>
                                                                </div>
                                                                {log.notes && (
                                                                    <p className="text-sm text-gray-600">{log.notes}</p>
                                                                )}
                                                                <div className="flex gap-4 mt-2 text-xs text-gray-500">
                                                                    {log.communicationMethod && (
                                                                        <span>Method: {log.communicationMethod}</span>
                                                                    )}
                                                                    {log.priority && (
                                                                        <span>Priority: {log.priority}</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )
                                            ) : (
                                                <p className="text-gray-500 text-sm">Loading history...</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modals */}
            <ScheduleContactModal
                isOpen={showScheduleModal}
                onClose={() => {
                    setShowScheduleModal(false);
                    setSelectedCall(null);
                }}
                onSchedule={handleSchedule}
                assignmentId={selectedCall?._id || ''}
            />

            <CallResultForm
                isOpen={showResultForm}
                onClose={() => {
                    setShowResultForm(false);
                    setSelectedCall(null);
                }}
                onSubmit={handleCallResult}
            />
        </div>
    );
}
