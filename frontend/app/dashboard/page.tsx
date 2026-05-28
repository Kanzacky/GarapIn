'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('/api/user');
                setUser(response.data);
            } catch (error: any) {
                if (error.response?.status === 401) {
                    router.push('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [router]);

    const logout = async () => {
        try {
            await axios.post('/logout');
            router.push('/login');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
                <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
                {user ? (
                    <div>
                        <p className="mb-4">Welcome back, <strong>{user.name}</strong>!</p>
                        <p className="mb-2 text-gray-600">Email: {user.email}</p>
                        <p className="mb-4 text-gray-600 capitalize">Role: <span className="font-semibold text-blue-600">{user.role.replace('_', ' ')}</span></p>
                        <button
                            onClick={logout}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <p>You are not logged in.</p>
                )}
            </div>
        </div>
    );
}
