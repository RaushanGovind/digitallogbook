import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
    const loadSettingsFromStorage = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        const prefs = user?.preferences || {};
        return {
            theme: prefs.theme || 'light',
            font: prefs.font || 'Inter',
            primaryColor: prefs.primaryColor || '#0d9488',
            timeFormat: prefs.timeFormat || '24h',
            dateFormat: prefs.dateFormat || 'DD/MM/YYYY',
            sections: [],
            frequentStations: user?.frequentStations || []
        };
    };

    const [settings, setSettings] = useState(loadSettingsFromStorage);

    // Provide a way to reload settings (e.g., after login)
    const refreshSettings = () => {
        setSettings(loadSettingsFromStorage());
    };

    // Apply settings to CSS variables
    useEffect(() => {
        const root = document.documentElement;

        // Theme & Color Logic
        if (settings.theme === 'dark') {
            root.style.setProperty('--bg-gradient', 'linear-gradient(135deg, #111827 0%, #1f2937 100%)');
            root.style.setProperty('--text-dark', '#f9fafb');
            root.style.setProperty('--text-light', '#9ca3af');
            root.style.setProperty('--glass-bg', 'rgba(31, 41, 55, 0.7)');
            root.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.1)');
        } else {
            root.style.setProperty('--bg-gradient', 'linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 100%)');
            root.style.setProperty('--text-dark', '#1f2937');
            root.style.setProperty('--text-light', '#6b7280');
            root.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.7)');
            root.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.5)');
        }

        // Primary Color
        root.style.setProperty('--primary-color', settings.primaryColor);
        root.style.setProperty('--primary-dark', settings.primaryColor);

        // Font
        root.style.setProperty('--font-family', settings.font);
        document.body.style.fontFamily = settings.font;

    }, [settings]);

    const updateSetting = async (key, value) => {
        // 1. Update state immediately
        setSettings(prev => ({ ...prev, [key]: value }));

        // 2. Update localStorage synchronously
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            const isFrequent = key === 'frequentStations';
            if (isFrequent) {
                user.frequentStations = value;
            } else {
                user.preferences = { ...user.preferences, [key]: value };
            }
            localStorage.setItem('user', JSON.stringify(user));

            // 3. Sync with backend asynchronously
            if (user.cmsId) {
                const body = isFrequent
                    ? { frequentStations: value }
                    : { preferences: user.preferences };

                try {
                    await fetch(`/api/users/${user.cmsId}/preferences`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(body)
                    });
                } catch (err) {
                    console.error("Sync error:", err);
                }
            }
        }
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSetting, refreshSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};
