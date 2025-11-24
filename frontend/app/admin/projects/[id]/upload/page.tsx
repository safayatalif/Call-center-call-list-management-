"use client";

import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useParams, useRouter } from 'next/navigation';

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState('');
    const { token } = useAuth();
    const params = useParams();
    const router = useRouter();
    const projectId = params.id;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await axios.post(`http://localhost:5000/api/admin/projects/${projectId}/upload-customers`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            setMessage(res.data.message);
            setTimeout(() => router.push('/admin/projects'), 2000);
        } catch (err: any) {
            setMessage(err.response?.data?.message || 'Upload failed');
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Upload Call List</h1>
            <div className="bg-white p-6 rounded shadow max-w-md">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Select CSV File</label>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="w-full border p-2 rounded"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                        disabled={!file}
                    >
                        Upload
                    </button>
                </form>
                {message && <p className="mt-4 text-center font-semibold">{message}</p>}
            </div>
        </div>
    );
}
