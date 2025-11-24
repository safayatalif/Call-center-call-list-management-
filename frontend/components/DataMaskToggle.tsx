'use client';

import React from 'react';

interface DataMaskToggleProps {
    value: string;
    isRestricted: boolean;
    label?: string;
}

export default function DataMaskToggle({ value, isRestricted, label }: DataMaskToggleProps) {
    if (!isRestricted) {
        return <span>{value || 'N/A'}</span>;
    }

    return (
        <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-400 italic">***RESTRICTED***</span>
            {label && (
                <span className="text-xs text-gray-500">({label})</span>
            )}
        </div>
    );
}
