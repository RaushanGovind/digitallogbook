import React, { useState, useEffect, useRef } from 'react';
import { useSettings } from '../../context/SettingsContext';

const StationSearchInput = ({ label, value, onChange, placeholder, required, showQuickSelect = true }) => {
    const { settings } = useSettings();
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [allStations, setAllStations] = useState([]);
    const wrapperRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchText, setSearchText] = useState(value || '');

    // Sync internal state with prop value
    useEffect(() => {
        setSearchText(value || '');
    }, [value]);

    // Fetch all stations once on mount
    useEffect(() => {
        setIsLoading(true);
        fetch('http://localhost:5000/api/stations')
            .then(res => res.json())
            .then(data => {
                setAllStations(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Failed to load stations", err);
                setIsLoading(false);
            });
    }, []);

    // Handle outside click to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const handleInputChange = (e) => {
        const inputVal = e.target.value.toUpperCase();
        setSearchText(inputVal);

        // Removed onChange(inputVal) to prevent automatic selection while typing

        if (inputVal.length >= 0) { // Changed to >= 0 to show items when user starts (even empty)
            const filtered = allStations.filter(station =>
                (station.code && station.code.toUpperCase().includes(inputVal)) ||
                (station.name && station.name.toUpperCase().includes(inputVal)) ||
                (station.section && station.section.toUpperCase().includes(inputVal))
            );

            // Sort: Exact code match first, then starts with code, then others
            const sorted = filtered.sort((a, b) => {
                const aCode = a.code.toUpperCase();
                const bCode = b.code.toUpperCase();
                if (aCode === inputVal) return -1;
                if (bCode === inputVal) return 1;
                if (aCode.startsWith(inputVal) && !bCode.startsWith(inputVal)) return -1;
                if (!aCode.startsWith(inputVal) && bCode.startsWith(inputVal)) return 1;
                return aCode.localeCompare(bCode);
            });

            setSuggestions(sorted.slice(0, 50)); // Limit to 50 for performance
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleSelectSuggestion = (code) => {
        setSearchText(code);
        onChange(code);
        setShowSuggestions(false);
    };

    return (
        <div className="relative mb-4" ref={wrapperRef}>
            {label && <label className="form-label mb-2 block">{label}</label>}
            <input
                type="text"
                className="form-input"
                value={searchText}
                onChange={handleInputChange}
                onFocus={() => handleInputChange({ target: { value: searchText || '' } })} // Show suggestions on focus immediately
                placeholder={placeholder}
                required={required}
            />

            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 w-full bg-white mt-1 rounded-xl shadow-lg border border-slate-100 max-h-60 overflow-y-auto animate-fade-in">
                    {suggestions.map((station) => (
                        <div
                            key={station._id || station.code}
                            onClick={() => handleSelectSuggestion(station.code)}
                            className="px-4 py-3 hover:bg-teal-50 cursor-pointer border-b border-slate-50 last:border-none transition-colors"
                        >
                            <div className="font-bold text-slate-800">{station.code}</div>
                            <div className="flex justify-between items-center">
                                <div className="text-xs text-slate-500">{station.name}</div>
                                {station.section && (
                                    <div className="text-[9px] bg-slate-100 px-1 rounded text-slate-400 border border-slate-100">
                                        {station.section}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {/* Quick Select Frequent Stations */}
            {showQuickSelect && settings.frequentStations.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2 animate-fade-in px-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase self-center mr-1">Quick Select:</span>
                    {settings.frequentStations.map(stn => (
                        <button
                            key={stn}
                            type="button"
                            onClick={() => handleSelectSuggestion(stn)}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition-all border ${value === stn
                                    ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                                    : 'bg-white text-teal-600 border-teal-200 hover:border-teal-400'
                                }`}
                        >
                            {stn}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StationSearchInput;
