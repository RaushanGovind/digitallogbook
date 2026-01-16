import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Train, Search, Zap, LogOut, UserCheck } from 'lucide-react';
import Tile from '../components/Tile';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import PageLayout from '../components/ui/PageLayout';
import Input from '../components/ui/Input';

const Dashboard = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleTileClick = (id) => {
        switch (id) {
            case 'sign-on': navigate('/sign-on'); break;
            case 'take-over': navigate('/take-over'); break;
            case 'running-details': navigate('/running'); break;
            case 'made-over': navigate('/made-over'); break;
            case 'sign-off': navigate('/sign-off'); break;
            default: console.log(`Clicked ${id}`);
        }
    };

    const coreActions = [
        { label: 'Sign ON', icon: LogIn, color: 'green', id: 'sign-on' },
        { label: 'Take Over', icon: Zap, color: 'orange', id: 'take-over' },
        { label: 'Running Details', icon: Train, color: 'blue', id: 'running-details' },
        { label: 'Made Over', icon: UserCheck, color: 'indigo', id: 'made-over' },
        { label: 'Sign OFF', icon: LogOut, color: 'red', id: 'sign-off' },
    ];

    const filteredTiles = coreActions.filter(tile =>
        tile.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <PageLayout title="Dashboard" showBack={false} showHome={false}>
            {/* We insert Header manually here as PageLayout title might overlap or be redundant if we want the full profile header */}
            <div style={{ marginTop: '-24px' }}>
                <Header />
            </div>

            <div className="mb-6">
                <p className="form-label">Operational Modules</p>
                <div className="card flex items-center gap-2 p-3">
                    <Search size={20} className="text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search operations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full outline-none text-slate-700 font-medium"
                        style={{ border: 'none', fontSize: '1rem' }}
                    />
                </div>
            </div>

            <div className="mb-4">
                <div style={{
                    background: 'var(--color-primary-50)',
                    borderRadius: '24px',
                    padding: '16px',
                    border: '1px solid var(--color-primary-100)'
                }}>
                    <div style={{
                        marginBottom: '12px',
                        display: 'inline-block',
                        background: 'var(--color-primary-600)',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 600
                    }}>
                        DUTY CYCLE
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        {filteredTiles.map(tile => (
                            <Tile
                                key={tile.id}
                                label={tile.label}
                                icon={tile.icon}
                                color={tile.color}
                                onClick={() => handleTileClick(tile.id)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <BottomNav />
        </PageLayout>
    );
};

export default Dashboard;
