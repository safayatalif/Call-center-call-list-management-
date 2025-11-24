"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function Header() {
    const { user, logout } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <header className="bg-white shadow-sm h-16 flex items-center justify-end px-8 mb-8 rounded-xl">
            <div className="relative">
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-3 focus:outline-none"
                >
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                        <p className="text-xs text-gray-500 uppercase">{user?.role}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg border-2 border-white shadow-sm">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-100 z-50">
                        <div className="px-4 py-2 border-b border-gray-100 md:hidden">
                            <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                            <p className="text-xs text-gray-500 uppercase">{user?.role}</p>
                        </div>
                        <Link
                            href="/profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsDropdownOpen(false)}
                        >
                            My Profile
                        </Link>
                        <button
                            onClick={() => {
                                setIsDropdownOpen(false);
                                logout();
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                            Sign out
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}
