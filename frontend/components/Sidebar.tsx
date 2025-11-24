"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

const Sidebar = () => {
    const pathname = usePathname();
    const { logout, user } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const isActive = (path: string) => pathname.startsWith(path);

    const adminLinks = [
        {
            href: '/admin/dashboard',
            label: 'Dashboard',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            )
        },
        {
            href: '/admin/teams',
            label: 'Teams',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            )
        },
        {
            href: '/admin/agents',
            label: 'Agents',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            )
        },
        {
            href: '/admin/projects',
            label: 'Projects',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
            )
        },
        {
            href: '/admin/assignments',
            label: 'Assignments',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            )
        },
        {
            href: '/admin/monitoring',
            label: 'Monitoring',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            )
        },
    ];

    const agentLinks = [
        {
            href: '/agent/dashboard',
            label: 'Dashboard',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            )
        },
        {
            href: '/agent/my-calls',
            label: 'My Calls',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
            )
        },
    ];

    const isAdmin = user?.role === 'admin' || user?.role === 'ADMIN' || user?.role === 'MANAGER';
    const links = isAdmin ? adminLinks : agentLinks;

    return (
        <div className={`${isCollapsed ? 'w-20' : 'w-64'} bg-gradient-to-b from-slate-800 to-slate-900 text-white min-h-screen flex flex-col transition-all duration-300 shadow-xl`}>
            {/* Header with Collapse Button */}
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                {!isCollapsed && (
                    <div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Call Center
                        </h1>
                        {user && (
                            <div className="mt-1">
                                <div className="text-sm font-medium text-white truncate">{user.name}</div>
                                <div className="text-xs text-slate-400 capitalize">{user.role}</div>
                            </div>
                        )}
                    </div>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                    title={isCollapsed ? 'Expand' : 'Collapse'}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isCollapsed ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 overflow-y-auto p-3">
                <ul className="space-y-1">
                    {links.map((link) => (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} p-3 rounded-lg transition-all ${isActive(link.href)
                                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/50'
                                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                    }`}
                                title={isCollapsed ? link.label : ''}
                            >
                                {link.icon}
                                {!isCollapsed && <span className="font-medium">{link.label}</span>}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Logout Button */}
            <div className="p-3 border-t border-slate-700">
                <button
                    onClick={logout}
                    className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} w-full p-3 rounded-lg text-slate-300 hover:bg-red-600 hover:text-white transition-all`}
                    title={isCollapsed ? 'Logout' : ''}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    {!isCollapsed && <span className="font-medium">Logout</span>}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
