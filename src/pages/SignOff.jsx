import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, LogOut, MapPin, Clock } from 'lucide-react';
import PageLayout from '../components/ui/PageLayout';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import StationSearchInput from '../components/ui/StationSearchInput';
import { useSettings } from '../context/SettingsContext';

const SignOff = () => {
    const navigate = useNavigate();
    const { settings } = useSettings();

    const [formData, setFormData] = useState({
        signOffStation: '',
        signOffDate: '',
        signOffTime: '',
        remarks: ''
    });

    useEffect(() => {
        const now = new Date();
        setFormData(prev => ({
            ...prev,
            signOffStation: settings.preferredSignOnStation || (settings.frequentStations.length > 0 ? settings.frequentStations[0] : ''),
            signOffDate: now.toISOString().split('T')[0],
            signOffTime: now.toTimeString().slice(0, 5)
        }));
    }, [settings.frequentStations]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Sign Off Data:", formData);
        // Here we would typically save the trip to the database
        navigate('/dashboard');
    };

    return (
        <PageLayout title="Crew Sign OFF">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                <Card title="Final Sign OFF" icon={LogOut}>
                    <div className="space-y-6">
                        {/* Station Selection */}
                        <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <StationSearchInput
                                label="Sign Off Station"
                                placeholder="Select Lobby (e.g. LMG)"
                                value={formData.signOffStation}
                                onChange={(val) => handleChange('signOffStation', val)}
                                required
                            />
                        </div>

                        {/* Date and Time */}
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Date"
                                type="date"
                                value={formData.signOffDate}
                                onChange={(e) => handleChange('signOffDate', e.target.value)}
                            />
                            <Input
                                label="Time"
                                type="time"
                                value={formData.signOffTime}
                                onChange={(e) => handleChange('signOffTime', e.target.value)}
                            />
                        </div>

                        {/* Remarks */}
                        <div className="form-group">
                            <label className="form-label">Duty Remarks (Optional)</label>
                            <textarea
                                className="form-input min-h-[100px] py-3"
                                placeholder="Any unusual occurrences, cattle run, etc."
                                value={formData.remarks}
                                onChange={(e) => handleChange('remarks', e.target.value)}
                            />
                        </div>
                    </div>
                </Card>

                <Button
                    type="submit"
                    variant="primary"
                    className="w-full text-lg py-4 shadow-lg flex items-center justify-center gap-2 mt-4 bg-red-600 hover:bg-red-700 border-red-700"
                >
                    <Save size={20} /> Final Submit & Close Duty
                </Button>
            </form>
        </PageLayout>
    );
};

export default SignOff;
