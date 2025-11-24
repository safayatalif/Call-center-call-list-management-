"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

interface Project {
    _id: string;
    projectName: string;
    description: string;
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const { token } = useAuth();

    useEffect(() => {
        fetchProjects();
    }, [token]);

    const fetchProjects = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/projects', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProjects(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/admin/projects',
                { projectName: name, description },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setName('');
            setDescription('');
            fetchProjects();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/admin/projects/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchProjects();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-gray-800">Projects</h1>

                <div className="bg-white p-8 rounded-xl shadow-lg mb-8 border border-gray-200">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800">Create New Project</h2>
                    <form onSubmit={handleSubmit} className="flex gap-4">
                        <input
                            type="text"
                            placeholder="Project Name"
                            className="border-2 border-gray-300 p-3 rounded-lg flex-1 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            className="border-2 border-gray-300 p-3 rounded-lg flex-1 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors shadow-md">
                            Create
                        </button>
                    </form>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                    <table className="min-w-full">
                        <thead className="bg-gradient-to-r from-gray-700 to-gray-800">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">Description</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {projects.map((project) => (
                                <tr key={project._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">{project.projectName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{project.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => handleDelete(project._id)}
                                            className="text-red-600 hover:text-red-900 font-semibold transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
