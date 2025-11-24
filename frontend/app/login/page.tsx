"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            login(res.data.token, res.data.user);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">
                <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Call Center Login</h2>
                {error && <p className="text-red-600 mb-4 text-center bg-red-50 p-3 rounded-lg font-medium">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-gray-700 font-semibold mb-2">Email</label>
                        <input
                            type="email"
                            className="w-full border-2 border-gray-300 p-3 rounded-lg text-gray-800 focus:border-blue-500 focus:outline-none transition-colors"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-8">
                        <label className="block text-gray-700 font-semibold mb-2">Password</label>
                        <input
                            type="password"
                            className="w-full border-2 border-gray-300 p-3 rounded-lg text-gray-800 focus:border-blue-500 focus:outline-none transition-colors"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-lg hover:from-blue-700 hover:to-blue-800 font-semibold text-lg shadow-lg transition-all transform hover:scale-105"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
