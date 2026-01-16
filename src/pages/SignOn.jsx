import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowRight, Train, Shield, AlertTriangle, Edit, CheckCircle, ChevronDown, ChevronRight } from 'lucide-react';
import PageLayout from '../components/ui/PageLayout';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import StationSearchInput from '../components/ui/StationSearchInput'; // New smart input
import { useSettings } from '../context/SettingsContext';

const SignOn = () => {
    const navigate = useNavigate();
    const { settings } = useSettings();
    const [activeSection, setActiveSection] = useState('signOn');
    const [sectionsStatus, setSectionsStatus] = useState({
        signOn: false,
        assignment: false,
        caution: false
    });

    const toggleSection = (sec) => {
        const isSaving = !sectionsStatus[sec];
        setSectionsStatus(prev => ({ ...prev, [sec]: isSaving }));

        if (isSaving) {
            // Auto-advance to next section on save
            if (sec === 'signOn') setActiveSection('assignment');
            else if (sec === 'assignment') setActiveSection('caution');
            else setActiveSection(null);
        } else {
            // On edit, make sure this section is the active one
            setActiveSection(sec);
        }
    };

    const [formData, setFormData] = useState({
        signOnStation: '',
        signOnDate: '',
        signOnTime: '',
        dutyType: 'Working',
        trainNo: '',
        safetyEquipment: {
            fsd: { issued: false, number: '' },
            walkieTalkie: { issued: false, number: '' },
            detonator: { issued: false, number: '' },
            ctr: { issued: false, number: '' },
            tab: { issued: false, number: '' }
        },
        cautionOrder: {
            dateOfIssue: '',
            timeOfIssue: ''
        }
    });

    useEffect(() => {
        // Set default date/time and preferred station
        const now = new Date();
        setFormData(prev => ({
            ...prev,
            signOnStation: prev.signOnStation || (settings.frequentStations.length > 0 ? settings.frequentStations[0] : ''),
            signOnDate: now.toISOString().split('T')[0],
            signOnTime: now.toTimeString().slice(0, 5)
        }));
    }, [settings.frequentStations]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSafetyToggle = (item) => {
        setFormData(prev => ({
            ...prev,
            safetyEquipment: {
                ...prev.safetyEquipment,
                [item]: {
                    ...prev.safetyEquipment[item],
                    issued: !prev.safetyEquipment[item].issued
                }
            }
        }));
    };

    const handleSafetyNumberChange = (item, num) => {
        setFormData(prev => ({
            ...prev,
            safetyEquipment: {
                ...prev.safetyEquipment,
                [item]: { ...prev.safetyEquipment[item], number: num }
            }
        }));
    };

    const handleCOChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            cautionOrder: { ...prev.cautionOrder, [field]: value }
        }));
    };



    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Sign On Data:", formData);
        navigate('/take-over');
    };

    return (
        <PageLayout title="Crew Sign ON">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                {/* Sign On & Safety Details Card */}
                <Card
                    title="Sign On & Safety"
                    icon={Train}
                    className={`cursor-pointer transition-all ${activeSection === 'signOn' ? 'ring-2 ring-teal-500/20' : ''}`}
                >
                    <div onClick={() => setActiveSection('signOn')} className="flex items-center justify-between -mt-14 mb-6 relative z-10 h-10 w-full cursor-pointer opacity-0">
                        {/* Invisible overlay to handle header click without modifying Card component */}
                    </div>

                    {activeSection === 'signOn' ? (
                        <div className="space-y-6 animate-in slide-in-from-top-2 duration-300">
                            {/* Primary Sign On Info */}
                            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl border transition-all ${sectionsStatus.signOn ? 'bg-emerald-50/30 border-emerald-200 pointer-events-none' : 'bg-slate-50 border-slate-100'}`}>
                                <div className="space-y-3">
                                    <StationSearchInput
                                        label="Station"
                                        placeholder="Select Station (e.g. NJP)"
                                        value={formData.signOnStation}
                                        onChange={(val) => handleChange('signOnStation', val)}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Date"
                                        type="date"
                                        value={formData.signOnDate}
                                        onChange={(e) => handleChange('signOnDate', e.target.value)}
                                    />
                                    <Input
                                        label="Time"
                                        type="time"
                                        value={formData.signOnTime}
                                        onChange={(e) => handleChange('signOnTime', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Safety Equipments Issued (Integrated in same block) */}
                            <div className={`space-y-4 transition-all p-1 rounded-xl ${sectionsStatus.signOn ? 'bg-emerald-50/10 pointer-events-none' : ''}`}>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block px-1">Equipments Issued & Numbers</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                                    {[
                                        { id: 'fsd', label: 'FSD', full: 'Fog Safe Device', numLabel: 'FSD No.' },
                                        { id: 'walkieTalkie', label: 'Walkie Talkie', full: 'Intercom', numLabel: 'W/T No.' },
                                        { id: 'detonator', label: 'Detonator', full: 'Detonator Box', numLabel: 'Box No.' },
                                        { id: 'ctr', label: 'CTR', full: 'Combined Train Report', numLabel: 'CTR No.' },
                                        { id: 'tab', label: 'TAB', full: 'Tablet', numLabel: 'Tablet No.' }
                                    ].map(item => (
                                        <div key={item.id} className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-100 shadow-sm hover:border-teal-100 transition-colors">
                                            <div
                                                onClick={() => handleSafetyToggle(item.id)}
                                                title={item.full}
                                                className={`
                                                    flex-1 py-2 rounded-lg border text-[10px] text-center cursor-pointer transition-all font-black uppercase select-none
                                                    ${formData.safetyEquipment[item.id].issued
                                                        ? 'bg-teal-600 border-teal-600 text-white shadow-sm'
                                                        : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-teal-200'}
                                                `}
                                            >
                                                {item.label}
                                            </div>
                                            {formData.safetyEquipment[item.id].issued && (
                                                <div className="w-1/2 animate-scale-in">
                                                    <input
                                                        type="text"
                                                        placeholder={item.numLabel}
                                                        value={formData.safetyEquipment[item.id].number}
                                                        onChange={(e) => handleSafetyNumberChange(item.id, e.target.value)}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-teal-500 focus:bg-white transition-all uppercase placeholder:text-slate-300"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Section Actions */}
                            <div className="flex justify-end gap-2 pt-2">
                                {sectionsStatus.signOn ? (
                                    <Button type="button" variant="outline" size="sm" onClick={() => toggleSection('signOn')} className="gap-2">
                                        <Edit size={14} /> Edit Section
                                    </Button>
                                ) : (
                                    <Button type="button" variant="primary" size="sm" onClick={() => toggleSection('signOn')} className="gap-2 bg-teal-600">
                                        <CheckCircle size={14} /> Save Section
                                    </Button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div onClick={() => setActiveSection('signOn')} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                            <div className="flex items-center gap-4">
                                <div className={`text-sm font-bold ${sectionsStatus.signOn ? 'text-teal-600' : 'text-slate-500'}`}>
                                    {sectionsStatus.signOn ? (
                                        <div className="flex items-center gap-2">
                                            <CheckCircle size={14} className="text-teal-500" />
                                            <span className="text-teal-600">Ready: {formData.signOnStation}</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <ChevronDown size={14} className="text-slate-300 group-hover:text-teal-500 transition-colors" />
                                            <span className="text-slate-400 group-hover:text-teal-600 transition-colors text-xs font-medium uppercase tracking-wider">Expand Details</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </Card>

                {/* Assignment Details Card */}
                <Card
                    title="Assignment Details"
                    icon={ArrowRight}
                    className={`cursor-pointer transition-all ${activeSection === 'assignment' ? 'ring-2 ring-teal-500/20' : ''}`}
                >
                    <div onClick={() => setActiveSection('assignment')} className="flex items-center justify-between -mt-14 mb-6 relative z-10 h-10 w-full cursor-pointer opacity-0">
                    </div>

                    {activeSection === 'assignment' ? (
                        <div className="animate-in slide-in-from-top-2 duration-300">
                            <div className={`space-y-4 transition-all p-4 rounded-xl border ${sectionsStatus.assignment ? 'bg-emerald-50/30 border-emerald-200 pointer-events-none' : 'border-transparent'}`}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="form-group">
                                        <label className="form-label">Duty Type</label>
                                        <select
                                            className="form-input font-bold"
                                            value={formData.dutyType}
                                            onChange={(e) => handleChange('dutyType', e.target.value)}
                                        >
                                            <option value="Working">Working</option>
                                            <option value="Spare">Spare</option>
                                            <option value="Learning">Learning</option>
                                        </select>
                                    </div>

                                    <Input
                                        label="Train No."
                                        placeholder="12345"
                                        value={formData.trainNo}
                                        onChange={(e) => handleChange('trainNo', e.target.value)}
                                        className="font-bold"
                                    />
                                </div>
                            </div>
                            {/* Section Actions */}
                            <div className="flex justify-end gap-2 mt-4 border-t pt-3">
                                {sectionsStatus.assignment ? (
                                    <Button type="button" variant="outline" size="sm" onClick={() => toggleSection('assignment')} className="gap-2">
                                        <Edit size={14} /> Edit Section
                                    </Button>
                                ) : (
                                    <Button type="button" variant="primary" size="sm" onClick={() => toggleSection('assignment')} className="gap-2 bg-teal-600">
                                        <CheckCircle size={14} /> Save Section
                                    </Button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div onClick={() => setActiveSection('assignment')} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                            <div className="flex items-center gap-4">
                                <div className={`text-sm font-bold ${sectionsStatus.assignment ? 'text-teal-600' : 'text-slate-500'}`}>
                                    {sectionsStatus.assignment ? (
                                        <div className="flex items-center gap-2">
                                            <CheckCircle size={14} className="text-teal-500" />
                                            <span className="text-teal-600">Ready: {formData.dutyType} - {formData.trainNo}</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <ChevronDown size={14} className="text-slate-300 group-hover:text-teal-500 transition-colors" />
                                            <span className="text-slate-400 group-hover:text-teal-600 transition-colors text-xs font-medium uppercase tracking-wider">Expand Details</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </Card>

                {/* Caution Order Card */}
                <Card
                    title="Caution Order"
                    icon={AlertTriangle}
                    className={`cursor-pointer transition-all ${activeSection === 'caution' ? 'ring-2 ring-teal-500/20' : ''}`}
                >
                    <div onClick={() => setActiveSection('caution')} className="flex items-center justify-between -mt-14 mb-6 relative z-10 h-10 w-full cursor-pointer opacity-0">
                    </div>

                    {activeSection === 'caution' ? (
                        <div className="animate-in slide-in-from-top-2 duration-300">
                            <div className={`space-y-4 transition-all p-4 rounded-xl border ${sectionsStatus.caution ? 'bg-emerald-50/30 border-emerald-200 pointer-events-none' : 'border-transparent'}`}>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Date of Issue"
                                        type="date"
                                        value={formData.cautionOrder.dateOfIssue}
                                        onChange={(e) => handleCOChange('dateOfIssue', e.target.value)}
                                        required
                                    />
                                    <Input
                                        label="Time of Caution Order"
                                        type="time"
                                        value={formData.cautionOrder.timeOfIssue}
                                        onChange={(e) => handleCOChange('timeOfIssue', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            {/* Section Actions */}
                            <div className="flex justify-end gap-2 mt-4 border-t pt-3">
                                {sectionsStatus.caution ? (
                                    <Button type="button" variant="outline" size="sm" onClick={() => toggleSection('caution')} className="gap-2">
                                        <Edit size={14} /> Edit Section
                                    </Button>
                                ) : (
                                    <Button type="button" variant="primary" size="sm" onClick={() => toggleSection('caution')} className="gap-2 bg-teal-600">
                                        <CheckCircle size={14} /> Save Section
                                    </Button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div onClick={() => setActiveSection('caution')} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                            <div className="flex items-center gap-4">
                                <div className={`text-sm font-bold ${sectionsStatus.caution ? 'text-teal-600' : 'text-slate-500'}`}>
                                    {sectionsStatus.caution ? (
                                        <div className="flex items-center gap-2">
                                            <CheckCircle size={14} className="text-teal-500" />
                                            <span className="text-teal-600">Ready: {formData.cautionOrder.dateOfIssue} {formData.cautionOrder.timeOfIssue}</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <ChevronDown size={14} className="text-slate-300 group-hover:text-teal-500 transition-colors" />
                                            <span className="text-slate-400 group-hover:text-teal-600 transition-colors text-xs font-medium uppercase tracking-wider">Expand Details</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </Card>

                <Button type="submit" variant="primary" className="w-full text-lg py-4 mt-2 flex items-center justify-center gap-2">
                    <Save size={20} /> Save & Proceed to Take Over <ArrowRight size={20} />
                </Button>

            </form>
        </PageLayout>
    );
};

export default SignOn;
