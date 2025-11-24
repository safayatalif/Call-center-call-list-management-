'use client';

import React, { useState } from 'react';

interface FilterOptions {
    status: string;
    priority: string;
    startDate: string;
    endDate: string;
    customerType: string;
    search: string;
}

interface AdvancedFilterPanelProps {
    onFilterChange: (filters: FilterOptions) => void;
    onReset: () => void;
}

export default function AdvancedFilterPanel({ onFilterChange, onReset }: AdvancedFilterPanelProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [filters, setFilters] = useState<FilterOptions>({
        status: '',
        priority: '',
        startDate: '',
        endDate: '',
        customerType: '',
        search: ''
    });

    const handleFilterChange = (key: keyof FilterOptions, value: string) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleReset = () => {
        const resetFilters: FilterOptions = {
            status: '',
            priority: '',
            startDate: '',
            endDate: '',
            customerType: '',
            search: ''
        };
        setFilters(resetFilters);
        onReset();
    };

    const activeFilterCount = Object.values(filters).filter(v => v !== '').length;

    return (
        <div className="bg-white rounded-lg shadow-sm mb-6">
            {/* Header */}
            <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
                    {activeFilterCount > 0 && (
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {activeFilterCount} active
                        </span>
                    )}
                </div>
                <svg
                    className={`w-5 h-5 text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {/* Filter Content */}
            {isExpanded && (
                <div className="p-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Search */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Search
                            </label>
                            <input
                                type="text"
                                placeholder="Name, phone, email..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                value={filters.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Status</option>
                                <option value="Pending">Pending</option>
                                <option value="Hold">Hold</option>
                                <option value="Recall Required">Recall Required</option>
                                <option value="Non-Responsive">Non-Responsive</option>
                                <option value="Sales Generated">Sales Generated</option>
                                <option value="Call Later">Call Later</option>
                                <option value="Received">Received</option>
                                <option value="Not Reachable">Not Reachable</option>
                                <option value="Closed">Closed</option>
                                <option value="Not Relevant">Not Relevant</option>
                                <option value="Scheduled">Scheduled</option>
                            </select>
                        </div>

                        {/* Priority */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Priority
                            </label>
                            <select
                                value={filters.priority}
                                onChange={(e) => handleFilterChange('priority', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Priorities</option>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>

                        {/* Customer Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Customer Type
                            </label>
                            <select
                                value={filters.customerType}
                                onChange={(e) => handleFilterChange('customerType', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Types</option>
                                <option value="New">New</option>
                                <option value="Regular">Regular</option>
                                <option value="Reorder">Reorder</option>
                                <option value="Undefined">Undefined</option>
                            </select>
                        </div>

                        {/* Start Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={filters.startDate}
                                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* End Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                End Date
                            </label>
                            <input
                                type="date"
                                value={filters.endDate}
                                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-4">
                        <button
                            onClick={handleReset}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                            Reset Filters
                        </button>
                        <div className="text-sm text-gray-600 flex items-center">
                            {activeFilterCount > 0 ? (
                                <span>{activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} applied</span>
                            ) : (
                                <span>No filters applied</span>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
