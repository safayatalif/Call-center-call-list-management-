"use client";

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user || (user.role !== 'admin' && user.role !== 'ADMIN' && user.role !== 'MANAGER')) {
                router.push('/login');
            }
        }
    }, [user, loading, router]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 p-8 bg-gray-100 min-h-screen flex flex-col">
                <Header />
                {children}
            </main>
        </div>
    );
}
