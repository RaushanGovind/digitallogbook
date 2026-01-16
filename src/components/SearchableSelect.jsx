import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

const SearchableSelect = ({ options, value, onChange, placeholder, style }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef(null);

    useEffect(() => {
        setSearchTerm(value || '');
    }, [value]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const filteredOptions = (options || []).filter(option =>
        option && option.toLowerCase().includes((searchTerm || '').toLowerCase())
    );

    const handleSelect = (optionValue) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    const handleInputChange = (e) => {
        const val = e.target.value.toUpperCase();
        setSearchTerm(val);
        onChange(val);
        setIsOpen(true);
    };

    return (
        <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
            <div style={{ position: 'relative' }}>
                <input
                    type="text"
                    style={{ ...style, paddingRight: '30px', fontFamily: 'var(--font-sans)', color: 'var(--text-primary)' }}
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    className="form-input"
                />
                <ChevronDown
                    size={16}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', pointerEvents: 'none' }}
                />
            </div>
            {isOpen && filteredOptions.length > 0 && (
                <ul className="animate-fade-in" style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--color-slate-200)',
                    borderRadius: 'var(--radius-md)',
                    marginTop: '4px',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    zIndex: 1000,
                    listStyle: 'none',
                    padding: '4px',
                    margin: '4px 0 0 0',
                    boxShadow: 'var(--shadow-lg)'
                }}>
                    {filteredOptions.map((opt, idx) => (
                        <li
                            key={idx}
                            onClick={() => handleSelect(opt)}
                            style={{
                                padding: '10px',
                                cursor: 'pointer',
                                fontSize: '0.95rem',
                                color: 'var(--text-primary)',
                                borderRadius: 'var(--radius-sm)',
                                transition: 'background 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.background = 'var(--color-slate-100)'}
                            onMouseLeave={(e) => e.target.style.background = 'transparent'}
                        >
                            {opt}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchableSelect;
