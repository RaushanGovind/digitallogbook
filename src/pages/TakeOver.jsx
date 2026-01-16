import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Zap, Droplet, Train } from 'lucide-react';
import PageLayout from '../components/ui/PageLayout';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const TakeOver = () => {
    const navigate = useNavigate();
    const [tractionType, setTractionType] = useState('Electric');

    // Form State
    const [formData, setFormData] = useState({
        locoFormation: 'Single Loco', // Single / Multiple
        locoNumber: '',
        locoType: '', // Dynamic

        // Diesel Specific
        fuelOilTakeOver: '',
        lubeOil: '',
        governorOil: '',
        compressorOil: '',

        // Electric Specific
        cp1: '', cp2: '', bcp: '',
        transformerOil1: '', transformerOil2: '',
        tractionConverterOil1: '', tractionConverterOil2: '',
        panto1: '', panto2: '', pss: '',
        startEnergy: '', startRegen: '',
        startKm: '',
    });

    const dieselTypes = ['WDM-3A', 'WDM-3D', 'WDG-4', 'WDP-4', 'WDP-4D'];
    const electricTypes = ['WAG-9', 'WAP-7', 'WAG-12', 'WAG-7', 'WAP-4'];

    const currentLocoTypes = tractionType === 'Diesel' ? dieselTypes : electricTypes;

    return (
        <PageLayout title="Take Over Details">
            <div className="flex flex-col gap-4">

                {/* Traction Selection */}
                <Card>
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button
                            onClick={() => setTractionType('Electric')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-md text-sm font-bold transition-all ${tractionType === 'Electric'
                                    ? 'bg-teal-600 text-white shadow-md'
                                    : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <Zap size={18} /> Electric
                        </button>
                        <button
                            onClick={() => setTractionType('Diesel')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-md text-sm font-bold transition-all ${tractionType === 'Diesel'
                                    ? 'bg-amber-500 text-white shadow-md'
                                    : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <Droplet size={18} /> Diesel
                        </button>
                    </div>
                </Card>

                {/* Common Details */}
                <Card title="Loco Configuration" icon={Train}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-group">
                            <label className="form-label">Formation</label>
                            <select
                                className="form-input"
                                value={formData.locoFormation}
                                onChange={e => setFormData({ ...formData, locoFormation: e.target.value })}
                            >
                                <option>Single Loco</option>
                                <option>Multiple Loco</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Loco Type</label>
                            <select
                                className="form-input"
                                value={formData.locoType}
                                onChange={e => setFormData({ ...formData, locoType: e.target.value })}
                            >
                                <option value="">Select Type</option>
                                {currentLocoTypes.map(t => <option key={t}>{t}</option>)}
                            </select>
                        </div>
                        <Input
                            label="Loco Number"
                            type="number"
                            placeholder="Enter Number"
                            value={formData.locoNumber}
                            onChange={e => setFormData({ ...formData, locoNumber: e.target.value })}
                        />
                    </div>
                </Card>

                {/* Conditional Fields */}
                {tractionType === 'Diesel' ? (
                    <Card title="Diesel Parameters" icon={Droplet}>
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Fuel Oil (L)" />
                            <Input label="Lube Oil" />
                            <Input label="Governor Oil" />
                            <Input label="Compressor Oil" />
                        </div>
                    </Card>
                ) : (
                    <Card title="Electric Parameters" icon={Zap}>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <Input label="Start Energy (kV)" />
                            <Input label="Start Regen" />
                            <Input label="Panto 1 Type" />
                            <Input label="Panto 2 Type" />
                        </div>

                        <h4 className="text-sm font-semibold text-slate-500 mb-3 border-b pb-1">Oil Levels</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="CP1 Oil" />
                            <Input label="Transformer 1" />
                            <Input label="Tract. Conv 1" />
                            <Input label="BCP Oil" />
                        </div>
                    </Card>
                )}

                <Button
                    onClick={() => navigate('/running')}
                    variant="primary"
                    className="w-full text-lg py-4 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
                >
                    <Save size={20} /> Submit & Start Duty
                </Button>
            </div>
        </PageLayout>
    );
};

export default TakeOver;
