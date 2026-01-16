import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, LogIn } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

import { useSettings } from '../context/SettingsContext';

const Login = () => {
    const navigate = useNavigate();
    const { refreshSettings } = useSettings();
    const [credentials, setCredentials] = useState({ id: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cmsId: credentials.id,
                    password: credentials.password
                })
            });

            const data = await res.json();

            if (res.ok) {
                // Save user to local storage if needed, or context
                localStorage.setItem('user', JSON.stringify(data.user));
                refreshSettings(); // Refresh settings state from the newly saved user
                navigate('/dashboard');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Server connection failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-slate-50 flex flex-col p-6 animate-fade-in justify-center max-w-lg mx-auto">
            <button
                onClick={() => navigate('/')}
                className="self-start p-2 -ml-2 text-slate-500 hover:text-slate-800 transition-colors mb-4"
            >
                <ChevronLeft size={24} /> Back
            </button>

            <div className="mb-6 text-center">
                <h2 className="text-3xl font-bold text-teal-800 tracking-tight">Welcome Back</h2>
                <p className="text-slate-500 mt-2">Please sign in to access your running log.</p>
            </div>

            <Card className="shadow-xl border-slate-200">
                <form onSubmit={handleLogin} className="flex flex-col gap-6">

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center font-medium border border-red-100">
                            {error}
                        </div>
                    )}

                    <Input
                        label="CMS ID / User ID"
                        placeholder="Ex: LMG1736"
                        required
                        value={credentials.id}
                        onChange={(e) => setCredentials({ ...credentials, id: e.target.value })}
                    />

                    <div>
                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            required
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                        />
                        <div className="text-right mt-2">
                            <a href="#" className="text-sm text-teal-600 font-medium hover:underline">
                                Forgot Password?
                            </a>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        className="py-4 text-lg w-full shadow-lg"
                        disabled={loading}
                    >
                        <LogIn size={20} className="mr-2" />
                        {loading ? 'Signing In...' : 'Sign In'}
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default Login;
