'use client';

import React, { useState } from 'react';

interface ScheduleContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSchedule: (data: { targetDateTime: string; notes: string; priority: string }) => void;
    assignmentId: string;
}

export default function ScheduleContactModal({
    isOpen,
    onClose,
    onSchedule,
    assignmentId
}: ScheduleContactModalProps) {
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        notes: '',
        priority: 'Medium'
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Combine date and time
        const targetDateTime = `${formData.date}T${formData.time}:00`;

        onSchedule({
            targetDateTime,
            notes: formData.notes,
            priority: formData.priority
        });

        // Reset form
        setFormData({
            date: '',
            time: '',
            notes: '',
            priority: 'Medium'
        });
    };

    const handleClose = () => {
        setFormData({
            date: '',
            time: '',
            notes: '',
            priority: 'Medium'
        });
        onClose();
    };

    // Get minimum date (today)
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">Schedule Next Contact</h2>
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
                        {/* Date */}
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                                Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                id="date"
                                required
                                min={today}
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Time */}
                        <div>
                            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                                Time <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="time"
                                id="time"
                                required
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
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
                                Notes
                            </label>
                            <textarea
                                id="notes"
                                rows={3}
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Add any notes for the scheduled contact..."
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
                            Schedule Contact
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
