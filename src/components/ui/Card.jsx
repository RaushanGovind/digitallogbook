import React from 'react';

const Card = ({ title, icon: Icon, children, className = '' }) => {
    return (
        <div className={`
            bg-white 
            rounded-3xl 
            shadow-[0_8px_30px_rgb(0,0,0,0.04)] 
            border border-slate-100 
            p-6 
            transition-all duration-300
            hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]
            ${className}
        `}>
            {(title || Icon) && (
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
                    {Icon && (
                        <div className="w-10 h-10 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 shadow-sm">
                            <Icon size={20} />
                        </div>
                    )}
                    {title && <h3 className="text-lg font-bold text-slate-800 tracking-tight">{title}</h3>}
                </div>
            )}
            {children}
        </div>
    );
};

export default Card;
