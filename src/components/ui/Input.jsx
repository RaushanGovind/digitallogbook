import React from 'react';

const Input = ({ label, error, className = '', ...props }) => {
    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            {label && (
                <label className="text-sm font-semibold text-slate-700 ml-1">
                    {label}
                </label>
            )}
            <input
                className={`
                    w-full px-4 py-3.5 
                    bg-white
                    border-2 border-slate-200 
                    rounded-2xl
                    text-base text-slate-700 
                    placeholder-slate-400 
                    outline-none 
                    transition-all duration-200
                    hover:border-teal-300
                    focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10
                    disabled:bg-slate-50 disabled:text-slate-500
                    ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''}
                `}
                {...props}
            />
            {error && <span className="text-xs font-medium text-red-500 ml-1">{error}</span>}
        </div>
    );
};

export default Input;
