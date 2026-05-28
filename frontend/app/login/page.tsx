'use client';

import { useState } from 'react';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<any>([]);
    const [status, setStatus] = useState<string | null>(null);

    const submitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);
        setStatus(null);

        try {
            // Get CSRF cookie first (Sanctum requirement)
            await axios.get('/sanctum/csrf-cookie');

            // Send login request
            await axios.post('/login', {
                email,
                password,
            });

            // If successful, redirect to dashboard or home
            setStatus('Login successful! Redirecting...');
            router.push('/dashboard');
        } catch (error: any) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ email: ['Something went wrong. Please try again.'] });
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h1>

                {status && (
                    <div className="mb-4 text-green-600 font-medium text-sm">
                        {status}
                    </div>
                )}

                <form onSubmit={submitForm}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoFocus
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs italic mt-1">{errors.email[0]}</p>
                        )}
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {errors.password && (
                            <p className="text-red-500 text-xs italic mt-1">{errors.password[0]}</p>
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                        >
                            Sign In
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
