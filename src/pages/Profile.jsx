import React from 'react';
import { User, Badge, ShieldCheck, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/ui/PageLayout';
import Card from '../components/ui/Card';
import { userData } from '../data/user';

const Profile = () => {
    const user = JSON.parse(localStorage.getItem('user')) || {
        name: 'Guest',
        designation: 'Loco Pilot',
        cmsId: 'N/A',
        dlbId: 'DLB0000',
        headQuarter: 'NJP',
        railway: 'NFR',
        division: 'KIR'
    };

    return (
        <PageLayout title="Crew Profile">

            {/* Profile Header Card */}
            <div className="bg-gradient-to-br from-white to-teal-50 rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col items-center mb-6">
                <div className="w-24 h-24 rounded-full bg-teal-600 flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg shadow-teal-600/30">
                    {user.name.charAt(0)}
                </div>
                <h2 className="text-2xl font-bold text-slate-800 text-center">{user.name}</h2>
                <span className="text-teal-600 font-semibold">{user.designation}</span>
                <div className="mt-4 bg-teal-100 text-teal-800 px-4 py-1 rounded-full text-sm font-bold">
                    DLB ID: {user.dlbId}
                </div>
            </div>

            {/* Details Cards */}
            <Card>
                <ProfileRow icon={User} label="CMS ID" value={user.cmsId} />
                <Divider />
                <ProfileRow icon={MapPin} label="Head Quarter" value={user.headQuarter || 'NJP'} />
                <Divider />
                <ProfileRow icon={ShieldCheck} label="Railway Zone" value={user.railway || 'NFR'} />
                <Divider />
                <ProfileRow icon={Badge} label="Division" value={user.division || 'KIR'} />
            </Card>

        </PageLayout>
    );
};

// Helper Components for this page
const ProfileRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-4 py-2">
        <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Icon size={20} />
        </div>
        <div>
            <div className="text-xs text-slate-500 font-medium">{label}</div>
            <div className="text-base font-semibold text-slate-800">{value}</div>
        </div>
    </div>
);

const Divider = () => (
    <div className="h-px bg-slate-100 my-2 ml-14" />
);

export default Profile;
