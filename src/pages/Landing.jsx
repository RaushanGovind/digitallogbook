import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Train } from 'lucide-react';
import Button from '../components/ui/Button';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="app-container animate-fade-in" style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '24px',
            background: 'linear-gradient(135deg, var(--color-primary-50) 0%, var(--color-primary-100) 100%)'
        }}>
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '24px',
                textAlign: 'center'
            }}>
                <div style={{
                    width: '100px',
                    height: '100px',
                    background: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-xl)'
                }}>
                    <Train size={48} color="var(--color-primary-600)" />
                </div>

                <div>
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: 800,
                        color: 'var(--color-primary-800)',
                        marginBottom: '8px'
                    }}>
                        DIGITAL LOG BOOK
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.5' }}>
                        The official digital companion for <br />Loco Pilots & Assistants.
                    </p>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '32px' }}>
                <Button variant="primary" onClick={() => navigate('/login')} className="w-full text-lg py-4">
                    Login
                </Button>

                <Button variant="secondary" onClick={() => navigate('/register')} className="w-full text-lg py-4 border-2 border-primary-600">
                    Register New Account
                </Button>

                <p style={{
                    textAlign: 'center',
                    fontSize: '0.8rem',
                    color: 'var(--text-tertiary)',
                    marginTop: '16px'
                }}>
                    Indian Railways • Safety First
                </p>
            </div>
        </div>
    );
};

export default Landing;
