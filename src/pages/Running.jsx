import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save, AlertTriangle, FileText, ArrowRight } from 'lucide-react';
import PageLayout from '../components/ui/PageLayout';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Running = () => {
    const navigate = useNavigate();
    const [sections, setSections] = useState([]);

    return (
        <PageLayout title="Running Details">
            <div className="flex flex-col gap-4">

                {/* Caution Orders */}
                <Card title="Caution Orders" icon={AlertTriangle}>
                    <div className="bg-slate-50 p-4 rounded-lg text-center text-slate-500 text-sm mb-4 border border-dashed border-slate-300">
                        No caution orders valid for this section yet.
                    </div>
                    <Button variant="outline" className="w-full">
                        <Plus size={16} /> Add Caution Order
                    </Button>
                </Card>

                {/* BPC Details */}
                <Card title="BPC Details" icon={FileText}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="BPC Number" placeholder="e.g. 983274" />
                        <Input label="Date Issued" type="date" />
                    </div>
                </Card>

                {/* Current Running Section */}
                <Card title="Section Entry">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <Input label="From Station" placeholder="NDLS" />
                        <Input label="To Station" placeholder="CNB" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Departure" type="time" />
                        <Input label="Arrival" type="time" />
                    </div>

                    <div className="mt-4 flex gap-2">
                        <div className="form-group flex-1">
                            <label className="form-label">Line No.</label>
                            <select className="form-input">
                                <option>Main Line</option>
                                <option>Loop 1</option>
                                <option>Loop 2</option>
                            </select>
                        </div>
                    </div>

                    <Button variant="secondary" className="w-full mt-4">
                        <Plus size={18} /> Add Section Entry
                    </Button>
                </Card>

                {/* Station Table Placeholder */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 font-semibold text-slate-700 flex justify-between items-center">
                        <span>Journey Log</span>
                        <span className="text-xs bg-slate-200 px-2 py-1 rounded text-slate-600">0 Entries</span>
                    </div>
                    <div className="p-8 text-center text-slate-400 text-sm italic">
                        No stations logged yet. Start adding your journey details.
                    </div>
                </div>

                <Button
                    onClick={() => navigate('/made-over')}
                    variant="primary"
                    className="w-full text-lg py-4 shadow-lg mt-4"
                >
                    Complete Journey <ArrowRight size={20} />
                </Button>

            </div>
        </PageLayout>
    );
};

export default Running;
