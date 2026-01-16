import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, UserCheck, Droplet, Clock, CheckCircle } from 'lucide-react';
import PageLayout from '../components/ui/PageLayout';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const MadeOver = () => {
    const navigate = useNavigate();

    return (
        <PageLayout title="Made Over Details">
            <div className="flex flex-col gap-4">

                {/* Fluid Levels */}
                <Card title="Fluid Levels" icon={Droplet}>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Fuel Balance" placeholder="Liters" />
                        <Input label="Lube Oil" placeholder="Level" />
                    </div>
                </Card>

                {/* Handover Details */}
                <Card title="Handover To" icon={UserCheck}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Crew Name" placeholder="Name of Relieving Crew" />
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Head Quarter" placeholder="HQ" />
                            <Input label="Time" type="time" />
                        </div>
                    </div>
                </Card>

                <Button
                    onClick={() => navigate('/sign-off')}
                    variant="primary"
                    className="w-full text-lg py-4 shadow-lg flex items-center justify-center gap-2 mt-2"
                >
                    Submit Made Over & Proceed <ArrowRight size={20} />
                </Button>

            </div>
        </PageLayout>
    );
};

export default MadeOver;
