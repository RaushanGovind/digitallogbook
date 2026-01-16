import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {

    const baseStyles = "relative overflow-hidden transition-all duration-200 font-semibold rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

    const variants = {
        primary: "bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-lg shadow-teal-500/30 hover:shadow-teal-500/40 hover:-translate-y-0.5",
        secondary: "bg-white border-2 border-teal-100 text-teal-600 hover:bg-teal-50 hover:border-teal-200",
        ghost: "bg-transparent text-slate-500 hover:text-teal-600 hover:bg-teal-50",
        danger: "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
