'use client';

import React, { useState } from 'react';

interface CallResultFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        status: string;
        notes: string;
        priority: string;
        followUpDate?: string;
        communicationMethod: string;
        statusText?: string;
    }) => void;
}

export default function CallResultForm({ isOpen, onClose, onSubmit }: CallResultFormProps) {
    const [formData, setFormData] = useState({
        status: 'Pending',
        notes: '',
        priority: 'Medium',
        followUpDate: '',
        communicationMethod: 'Call',
        statusText: ''
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            followUpDate: formData.followUpDate || undefined,
            statusText: formData.statusText || undefined
        });

        // Reset form
        setFormData({
            status: 'Pending',
            notes: '',
            priority: 'Medium',
            followUpDate: '',
            communicationMethod: 'Call',
            statusText: ''
        });
    };

    const handleClose = () => {
        setFormData({
            status: 'Pending',
            notes: '',
            priority: 'Medium',
            followUpDate: '',
            communicationMethod: 'Call',
            statusText: ''
        });
        onClose();
    };

    const statusOptions = [
        'Pending',
        'Hold',
        'Recall Required',
        'Non-Responsive',
        'Sales Generated',
        'Call Later',
        'Reassigned',
        'Others',
        'Received',
        'Not Reachable',
        'Closed',
        'Not Relevant',
        'Scheduled'
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
                    <h2 className="text-xl font-semibold text-gray-900">Record Call Result</h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-4">
                        {/* Communication Method */}
                        <div>
                            <label htmlFor="communicationMethod" className="block text-sm font-medium text-gray-700 mb-2">
                                Communication Method <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="communicationMethod"
                                required
                                value={formData.communicationMethod}
                                onChange={(e) => setFormData({ ...formData, communicationMethod: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="Call">Call</option>
                                <option value="SMS">SMS</option>
                                <option value="WhatsApp">WhatsApp</option>
                                <option value="Email">Email</option>
                                <option value="Facebook">Facebook</option>
                                <option value="LinkedIn">LinkedIn</option>
                            </select>
                        </div>

                        {/* Status */}
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                                Call Status <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="status"
                                required
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                {statusOptions.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>

                        {/* Status Text */}
                        <div>
                            <label htmlFor="statusText" className="block text-sm font-medium text-gray-700 mb-2">
                                Status Description
                            </label>
                            <input
                                type="text"
                                id="statusText"
                                value={formData.statusText}
                                onChange={(e) => setFormData({ ...formData, statusText: e.target.value })}
                                placeholder="Brief description of the call outcome..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Priority */}
                        <div>
                            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                                Priority
                            </label>
                            <select
                                id="priority"
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>

                        {/* Notes */}
                        <div>
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                                Notes <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="notes"
                                required
                                rows={4}
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Enter detailed notes about the call..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Follow-up Date */}
                        <div>
                            <label htmlFor="followUpDate" className="block text-sm font-medium text-gray-700 mb-2">
                                Follow-up Date (Optional)
                            </label>
                            <input
                                type="date"
                                id="followUpDate"
                                value={formData.followUpDate}
                                onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-6">
                        <button
                            type="submit"
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                            Save Call Result
                        </button>
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
