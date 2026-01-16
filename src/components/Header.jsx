import React from 'react';
import { User, Settings, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

const Header = () => {
    const navigate = useNavigate();
    const { settings } = useSettings();

    return (
        <div className="card flex items-center justify-between p-4 mb-6 bg-white border-slate-200">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-lg border-2 border-primary-200">
                    RK
                </div>
                <div>
                    <h2 className="text-base font-bold text-slate-800 leading-tight">R K JHA</h2>
                    <p className="text-xs text-slate-500 font-medium tracking-wide">LPG (P) / NJP</p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button className="p-2 text-slate-400 hover:text-primary-600 transition-colors relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>
                <button
                    onClick={() => navigate('/settings')}
                    className="p-2 text-slate-400 hover:text-primary-600 transition-colors bg-slate-50 rounded-full hover:bg-primary-50"
                >
                    <Settings size={20} />
                </button>
            </div>
        </div>
    );
};

export default Header;
