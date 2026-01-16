import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Home } from 'lucide-react';

const PageLayout = ({ title, showBack = true, showHome = true, children }) => {
    const navigate = useNavigate();

    return (
        <div className="app-container animate-fade-in py-4">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    {showBack && (
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                        >
                            <ChevronLeft size={24} className="text-slate-700" />
                        </button>
                    )}
                    {title && <h2 className="text-xl font-bold text-slate-800">{title}</h2>}
                </div>

                {showHome && (
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                    >
                        <Home size={24} className="text-slate-700" />
                    </button>
                )}
            </div>

            <div className="pb-20">
                {children}
            </div>
        </div>
    );
};

export default PageLayout;
