import React from 'react';
import { Home, Power, HelpCircle, FileBarChart } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { icon: Home, label: 'Home', path: '/dashboard' },
        { icon: Power, label: 'Logout', path: '/' },
        { icon: HelpCircle, label: 'Helpdesk', path: '/help' },
        { icon: FileBarChart, label: 'CMS Reports', path: '/reports' },
    ];

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'var(--color-primary-800)',
            display: 'flex',
            justifyContent: 'space-around',
            padding: '12px 0',
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
            boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1)',
            zIndex: 100
        }}>
            {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <div
                        key={item.label}
                        onClick={() => navigate(item.path)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px',
                            cursor: 'pointer',
                            color: isActive ? 'var(--color-warning)' : 'white',
                            transition: 'color 0.2s'
                        }}
                    >
                        <item.icon size={24} strokeWidth={2} />
                        <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>{item.label}</span>
                    </div>
                );
            })}
        </div>
    );
};

export default BottomNav;
