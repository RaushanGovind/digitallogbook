import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, UserPlus } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        designation: 'Asst. Loco Pilot',
        cmsId: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    designation: formData.designation,
                    cmsId: formData.cmsId,
                    password: formData.password
                })
            });

            const data = await res.json();

            if (res.ok) {
                alert(`Registration Successful! Your unique Digital Log Book ID is: ${data.user.dlbId}. Please login now.`);
                navigate('/login');
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError('Server connection failed. Please try again.');
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
                <h2 className="text-3xl font-bold text-teal-800 tracking-tight">Create Account</h2>
                <p className="text-slate-500 mt-2">Join the professional digital running log system.</p>
            </div>

            <Card className="shadow-xl border-slate-200">
                <form onSubmit={handleRegister} className="flex flex-col gap-5">

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center font-medium border border-red-100">
                            {error}
                        </div>
                    )}

                    <Input
                        label="Full Name"
                        placeholder="e.g. Raushan Kumar Jha"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />

                    <div className="form-group">
                        <label className="form-label">Designation</label>
                        <select
                            className="form-input"
                            value={formData.designation}
                            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                        >
                            <option>Asst. Loco Pilot</option>
                            <option>Sr. Asst. Loco Pilot</option>
                            <option>Loco Pilot (Goods)</option>
                            <option>Loco Pilot (Passenger)</option>
                            <option>Loco Pilot (Mail/Express)</option>
                            <option>Loco Inspector</option>
                        </select>
                    </div>

                    <Input
                        label="CMS ID"
                        placeholder="e.g. LMG1736"
                        value={formData.cmsId}
                        onChange={(e) => setFormData({ ...formData, cmsId: e.target.value })}
                        required
                    />

                    <div className="grid grid-cols-1 gap-5">
                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                        <Input
                            label="Confirm Password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            required
                        />
                    </div>

                    <Button
                        variant="primary"
                        type="submit"
                        className="mt-4 py-4 text-lg shadow-lg"
                        disabled={loading}
                    >
                        <UserPlus size={20} className="mr-2" />
                        {loading ? 'Creating Account...' : 'Register'}
                    </Button>
                </form>
            </Card>

            <p className="text-center text-slate-500 mt-6 text-sm font-medium">
                Already have an account? <span onClick={() => navigate('/login')} className="text-teal-600 font-bold cursor-pointer hover:underline">Login</span>
            </p>
        </div>
    );
};

export default Register;
