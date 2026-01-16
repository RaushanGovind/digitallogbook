import React from 'react';

const Tile = ({ icon: Icon, label, color = 'blue', onClick }) => {
    // Map colors to CSS variables or classes if we had them extended
    const gradients = {
        green: 'linear-gradient(135deg, #86efac 0%, #22c55e 100%)',
        orange: 'linear-gradient(135deg, #fdba74 0%, #f97316 100%)',
        red: 'linear-gradient(135deg, #fca5a5 0%, #ef4444 100%)',
        blue: 'linear-gradient(135deg, #93c5fd 0%, #3b82f6 100%)',
        purple: 'linear-gradient(135deg, #d8b4fe 0%, #a855f7 100%)',
        teal: 'linear-gradient(135deg, #5eead4 0%, #14b8a6 100%)',
        indigo: 'linear-gradient(135deg, #a5b4fc 0%, #6366f1 100%)',
        yellow: 'linear-gradient(135deg, #fde047 0%, #eab308 100%)',
        gray: 'linear-gradient(135deg, #cbd5e1 0%, #64748b 100%)',
    };

    return (
        <div
            className="card"
            onClick={onClick}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px 8px',
                gap: '12px',
                cursor: 'pointer',
                height: '100%',
                minHeight: '110px',
                marginBottom: 0 // Override card margin
            }}
        >
            <div style={{
                background: gradients[color] || gradients.blue,
                borderRadius: '50%',
                padding: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
            }}>
                <Icon size={24} strokeWidth={2.5} />
            </div>
            <span style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                textAlign: 'center',
                lineHeight: '1.2',
                color: 'var(--text-primary)'
            }}>
                {label}
            </span>
        </div>
    );
};

export default Tile;
