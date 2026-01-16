import React, { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import PageLayout from '../components/ui/PageLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import StationSearchInput from '../components/ui/StationSearchInput';
import { Moon, Sun, Palette, Clock, Calculator, Plus, Trash2, Map, Navigation, GitBranch } from 'lucide-react';

const Settings = () => {
    const { settings, updateSetting } = useSettings();
    const [activeTab, setActiveTab] = useState('appearance');

    // Manual Section State
    const [manualSections, setManualSections] = useState([]);
    const [newSection, setNewSection] = useState({ from: '', to: '', distance: '' });
    const [editingId, setEditingId] = useState(null);

    // Calculator State
    const [calcFrom, setCalcFrom] = useState('');
    const [calcTo, setCalcTo] = useState('');
    const [calculatedDist, setCalculatedDist] = useState(null);
    const [routeDetails, setRouteDetails] = useState(null);
    const [routeOptions, setRouteOptions] = useState(null);

    // Routes State
    const [allStations, setAllStations] = useState([]);
    const [sectionFrom, setSectionFrom] = useState('');
    const [sectionTo, setSectionTo] = useState('');
    const [sectionPath, setSectionPath] = useState(null);
    const [isExploring, setIsExploring] = useState(false);
    const [junctions, setJunctions] = useState([]);
    const [selectedJunction, setSelectedJunction] = useState(null);

    // Load User Sections
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (activeTab === 'sections' && user?.cmsId) {
            fetch(`/api/user-sections/${user.cmsId}`)
                .then(res => res.json())
                .then(data => setManualSections(data))
                .catch(err => console.error(err));
        }

        if (activeTab === 'appearance' || activeTab === 'routes' || activeTab === 'calculator') {
            fetch('/api/stations')
                .then(res => res.json())
                .then(data => setAllStations(data))
                .catch(err => console.error(err));
        }

        if (activeTab === 'routes' || activeTab === 'calculator') {
            fetch('/api/junctions')
                .then(res => res.json())
                .then(data => setJunctions(data))
                .catch(err => console.error(err));
        }
    }, [activeTab]);

    const exploreSection = async () => {
        if (!sectionFrom || !sectionTo) return;
        setIsExploring(true);
        setSectionPath(null);
        try {
            const res = await fetch(`/api/route?from=${sectionFrom}&to=${sectionTo}`);
            const data = await res.json();
            if (res.ok) {
                setSectionPath(data);
            } else {
                setSectionPath({ error: true, message: data.message });
            }
        } catch (err) {
            console.error(err);
            setSectionPath({ error: true, message: "Server unreachable or connection error." });
        } finally {
            setIsExploring(false);
        }
    };

    const handleAddSection = async () => {
        if (!newSection.from || !newSection.to || !newSection.distance) return;

        try {
            const url = editingId
                ? `/api/user-sections/${editingId}`
                : '/api/user-sections';

            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cmsId: user?.cmsId || 'GUEST',
                    fromStation: newSection.from,
                    toStation: newSection.to,
                    distance: newSection.distance
                })
            });
            const data = await res.json();

            if (editingId) {
                setManualSections(manualSections.map(s => s._id === editingId ? data : s));
                setEditingId(null);
            } else {
                setManualSections([...manualSections, data]);
            }

            setNewSection({ from: '', to: '', distance: '' });
        } catch (err) {
            alert("Failed to save section");
        }
    };

    const handleDeleteSection = async (id) => {
        if (!window.confirm('Are you sure you want to delete this section?')) return;
        try {
            await fetch(`/api/user-sections/${id}`, { method: 'DELETE' });
            setManualSections(manualSections.filter(s => s._id !== id));
        } catch (err) {
            alert("Failed to delete section");
        }
    };

    const startEditing = (sec) => {
        setEditingId(sec._id);
        setNewSection({
            from: sec.fromStation,
            to: sec.toStation,
            distance: sec.distance
        });
    };

    const calculateDistance = async () => {
        if (!calcFrom || !calcTo) return;
        setCalculatedDist(null);
        setRouteDetails(null);
        setRouteOptions(null);

        try {
            const res = await fetch(`/api/route?from=${calcFrom}&to=${calcTo}`);
            const data = await res.json();

            if (res.ok) {
                if (data.multipleOptions) {
                    setRouteOptions(data.options);
                } else {
                    setCalculatedDist(data.totalDistance);
                    setRouteDetails(data);
                }
            } else {
                alert(data.message || 'Error calculating distance');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSelectRoute = (option) => {
        setCalculatedDist(option.totalDistance);
        setRouteDetails(option);
        setRouteOptions(null);
    };


    return (
        <PageLayout title="Settings">

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {['appearance', 'routes', 'sections', 'calculator'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-full text-sm font-bold capitalize whitespace-nowrap transition-colors ${activeTab === tab
                            ? 'bg-teal-600 text-white shadow-md'
                            : 'bg-white text-slate-500 hover:bg-slate-50'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="flex flex-col gap-4">

                {activeTab === 'appearance' && (
                    <>
                        <Card title="Appearance" icon={Palette}>
                            <div className="mb-4">
                                <label className="form-label mb-2 block">Theme</label>
                                <div className="flex bg-slate-100 p-1 rounded-lg">
                                    <button onClick={() => updateSetting('theme', 'light')} className={`flex-1 py-2 text-sm rounded-md ${settings.theme === 'light' ? 'bg-white shadow' : ''}`}>Light</button>
                                    <button onClick={() => updateSetting('theme', 'dark')} className={`flex-1 py-2 text-sm rounded-md ${settings.theme === 'dark' ? 'bg-white shadow' : ''}`}>Dark</button>
                                </div>
                            </div>
                        </Card>
                        <Card title="User Preferences" icon={Navigation}>
                            <p className="text-xs text-slate-500 mb-4 font-medium">Add multiple stations you frequently sign on from.</p>

                            <div className="mb-4">
                                <StationSearchInput
                                    key={`frequent-stn-adder-${settings.frequentStations.length}`}
                                    label="Add Frequent Station"
                                    placeholder="e.g. LMG, GHY, NBQ"
                                    value={''}
                                    showQuickSelect={false}
                                    onChange={(val) => {
                                        if (val && !settings.frequentStations.includes(val) && allStations.some(s => s.code === val)) {
                                            updateSetting('frequentStations', [...settings.frequentStations, val]);
                                        }
                                    }}
                                />
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {settings.frequentStations.map(stn => {
                                    const stationObj = allStations.find(s => s.code === stn);
                                    const fullName = stationObj ? stationObj.name : stn;

                                    return (
                                        <div key={stn} className="flex items-center gap-2 bg-teal-50 text-teal-700 px-3 py-1.5 rounded-full border border-teal-100 text-xs font-bold animate-fade-in group shadow-sm">
                                            <span className="underline decoration-teal-200 decoration-dotted cursor-help" title={fullName}>{stn}</span>
                                            <button
                                                onClick={() => updateSetting('frequentStations', settings.frequentStations.filter(s => s !== stn))}
                                                className="text-teal-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    );
                                })}
                                {settings.frequentStations.length === 0 && (
                                    <div className="text-[10px] text-slate-400 italic">No frequent stations added.</div>
                                )}
                            </div>
                        </Card>
                    </>
                )}

                {activeTab === 'routes' && (
                    <>
                        <Card title="Section Explorer" icon={Map}>
                            <p className="text-xs text-slate-500 mb-4">
                                Dynamically link any two stations to explore the section.
                            </p>

                            <div className="grid grid-cols-2 gap-4 mb-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <StationSearchInput
                                    label="From"
                                    placeholder="Origin Station"
                                    value={sectionFrom}
                                    onChange={setSectionFrom}
                                />
                                <StationSearchInput
                                    label="To"
                                    placeholder="Destination Station"
                                    value={sectionTo}
                                    onChange={setSectionTo}
                                />
                                <div className="col-span-2">
                                    <Button
                                        onClick={exploreSection}
                                        variant="primary"
                                        className="w-full"
                                        disabled={isExploring || !sectionFrom || !sectionTo}
                                    >
                                        {isExploring ? 'Exploring...' : 'Link Section & Explore'}
                                    </Button>
                                </div>
                            </div>

                            {sectionPath && sectionPath.error && (
                                <div className="p-6 bg-red-50 rounded-xl border border-red-100 text-center animate-fade-in mb-4">
                                    <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Navigation size={24} />
                                    </div>
                                    <p className="text-sm text-red-700 font-bold mb-1">Route Not Found</p>
                                    <p className="text-xs text-red-500">{sectionPath.message}</p>
                                </div>
                            )}

                            {sectionPath && !sectionPath.error && !sectionPath.multipleOptions && (
                                <div className="animate-fade-in">
                                    <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-4 rounded-xl border border-teal-100 mb-4">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <div className="text-xs font-bold text-teal-600 uppercase">Current Section</div>
                                                <div className="font-bold text-slate-800 text-lg">
                                                    <span className="underline decoration-slate-300 decoration-dotted cursor-help" title={sectionPath.from}>{sectionPath.fromCode}</span>
                                                    <span className="mx-2 text-slate-300">➝</span>
                                                    <span className="underline decoration-slate-300 decoration-dotted cursor-help" title={sectionPath.to}>{sectionPath.toCode}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-lg font-mono font-bold text-blue-600">{sectionPath.totalDistance} km</div>
                                                <div className="text-[10px] text-slate-500 font-bold uppercase">{sectionPath.hops} Stations</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 border-l-2 border-teal-100 ml-3 pl-6 relative">
                                        {/* Start Station Dot */}
                                        <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-teal-500"></div>

                                        {sectionPath.route.map((seg, idx) => (
                                            <div key={idx} className="relative group hover:bg-white p-2 rounded-lg transition-colors border border-transparent hover:border-teal-50">
                                                <div className="absolute -left-[30px] top-1/2 -translate-y-1/2 w-4 h-[2px] bg-teal-100"></div>
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <div className="text-sm font-bold text-slate-700 underline decoration-slate-200 decoration-dotted cursor-help" title={seg.destinationName}>{seg.destination}</div>
                                                        <div className="text-[10px] text-slate-400 font-medium">via {seg.routeName || 'Direct'}</div>
                                                    </div>
                                                    <div className="text-xs font-mono text-slate-500">+{seg.distance} km</div>
                                                </div>
                                            </div>
                                        ))}

                                        <div className="absolute -left-[5px] bottom-0 w-2 h-2 rounded-full bg-blue-500"></div>
                                    </div>
                                </div>
                            )}

                            {sectionPath && !sectionPath.error && sectionPath.multipleOptions && (
                                <div className="p-6 bg-amber-50 rounded-xl border border-amber-100 text-center mt-4">
                                    <p className="text-sm text-amber-700 font-medium mb-3">Multiple routes exist between these stations.</p>
                                    <div className="space-y-2">
                                        {sectionPath.options.map((opt, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setSectionPath(opt)}
                                                className="w-full bg-white p-3 rounded-lg border border-amber-200 text-xs font-bold text-slate-700 hover:bg-amber-100 transition-colors flex justify-between items-center"
                                            >
                                                <span>Via {opt.via}</span>
                                                <span>{opt.totalDistance} km</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Card>

                        <Card title="Junction Explorer" icon={GitBranch}>
                            <p className="text-xs text-slate-500 mb-4">
                                Identify nodes with 3 or more directions. Useful for complex routing.
                            </p>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {junctions.map(j => (
                                    <button
                                        key={j.code}
                                        onClick={() => setSelectedJunction(j)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${selectedJunction?.code === j.code ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-400'}`}
                                    >
                                        {j.code}
                                    </button>
                                ))}
                            </div>

                            {selectedJunction && (
                                <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 animate-fade-in">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                        <span className="font-bold text-slate-800">{selectedJunction.name}</span>
                                        <span className="text-[10px] bg-indigo-200 text-indigo-700 px-1.5 py-0.5 rounded font-bold">{selectedJunction.destinations.length} DIRECTIONS</span>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                        {selectedJunction.destinations.map((d, i) => (
                                            <div key={i} className="flex justify-between items-center bg-white p-3 rounded-lg border border-indigo-50 shadow-sm">
                                                <div>
                                                    <div className="text-xs font-bold text-slate-700">{d.name} ({d.code})</div>
                                                    <div className="text-[10px] text-slate-400 uppercase font-medium">{d.routeName || 'Branch'}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xs font-mono font-bold text-indigo-600">{d.distance} km</div>
                                                    <div className="text-[9px] text-slate-400 uppercase tracking-tighter">{d.direction}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Card>
                    </>
                )}



                {
                    activeTab === 'sections' && (
                        <>
                            <Card title="Add Manual Section" icon={Plus}>
                                <p className="text-xs text-slate-500 mb-4">
                                    Add sections visible only to you.
                                </p>
                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <StationSearchInput
                                        label="From (Code)"
                                        placeholder="e.g. BOE"
                                        value={newSection.from}
                                        onChange={val => setNewSection({ ...newSection, from: val })}
                                    />
                                    <StationSearchInput
                                        label="To (Code)"
                                        placeholder="e.g. KNE"
                                        value={newSection.to}
                                        onChange={val => setNewSection({ ...newSection, to: val })}
                                    />
                                </div>
                                <Input
                                    label="Distance (KM)"
                                    type="number"
                                    placeholder="0.00"
                                    value={newSection.distance}
                                    onChange={e => setNewSection({ ...newSection, distance: e.target.value })}
                                />
                                <Button className={`w-full mt-4 ${editingId ? 'bg-amber-600 hover:bg-amber-700' : ''}`} onClick={handleAddSection}>
                                    {editingId ? 'Update Section' : 'Save Section'}
                                </Button>
                                {editingId && (
                                    <button
                                        onClick={() => { setEditingId(null); setNewSection({ from: '', to: '', distance: '' }); }}
                                        className="w-full mt-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors py-1"
                                    >
                                        Cancel Edit
                                    </button>
                                )}
                            </Card>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center ml-1">
                                    <h3 className="text-sm font-bold text-slate-500">My Saved Sections</h3>
                                    {editingId && <span className="text-[10px] font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">Editing Mode</span>}
                                </div>
                                {manualSections.length === 0 ? (
                                    <div className="text-center p-8 bg-slate-50 rounded-xl text-slate-400 text-sm">
                                        No manual sections added.
                                    </div>
                                ) : (
                                    manualSections.map((sec, i) => (
                                        <div key={sec._id || i} className={`bg-white p-4 rounded-xl shadow-sm border transition-all flex justify-between items-center ${editingId === sec._id ? 'border-amber-400 ring-2 ring-amber-50' : 'border-slate-100'}`}>
                                            <div>
                                                <div className="font-bold text-slate-800 flex items-center gap-2">
                                                    {sec.fromStation} ➝ {sec.toStation}
                                                </div>
                                                <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">{sec.distance} KM • Manual Link</div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => startEditing(sec)}
                                                    className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                                                    title="Edit Section"
                                                >
                                                    <Palette size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteSection(sec._id)}
                                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete Section"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    )
                }

                {
                    activeTab === 'calculator' && (
                        <Card title="Distance Calculator" icon={Calculator}>
                            <p className="text-xs text-slate-500 mb-4">
                                Calculate distance accurately using database KM markers.
                            </p>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <StationSearchInput
                                    label="Station 1"
                                    placeholder="Code"
                                    value={calcFrom}
                                    onChange={val => { setCalcFrom(val); setRouteOptions(null); setCalculatedDist(null); }}
                                />
                                <StationSearchInput
                                    label="Station 2"
                                    placeholder="Code"
                                    value={calcTo}
                                    onChange={val => { setCalcTo(val); setRouteOptions(null); setCalculatedDist(null); }}
                                />
                            </div>

                            {routeOptions && (
                                <div className="mb-6 animate-fade-in p-4 bg-slate-50 rounded-2xl border border-slate-200">
                                    <label className="text-xs font-bold text-slate-500 mb-3 block uppercase tracking-wider text-center">Multiple Routes Found. Select One:</label>
                                    <div className="space-y-3">
                                        {routeOptions.map((opt, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleSelectRoute(opt)}
                                                className="w-full text-left p-4 rounded-xl border border-teal-100 bg-white hover:bg-teal-50 hover:border-teal-300 transition-all shadow-sm flex justify-between items-center group active:scale-[0.98]"
                                            >
                                                <div>
                                                    <div className="text-sm font-bold text-slate-800">Via {opt.via}</div>
                                                    <div className="text-xs text-slate-500 mt-0.5">{opt.hops} Stations • {opt.routesUsed} Route{opt.routesUsed !== 1 ? 's' : ''}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-mono font-bold text-teal-600 leading-none">{opt.totalDistance} <span className="text-[10px] uppercase">km</span></div>
                                                    <div className="text-[9px] font-bold text-teal-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity uppercase">Select Path →</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {calculatedDist && (
                                <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 text-center mb-4 animate-fade-in">
                                    <div className="text-sm text-teal-600 font-medium">Calculated Distance</div>
                                    <div className="text-3xl font-bold text-teal-800">{calculatedDist} km</div>

                                    {routeDetails && routeDetails.route && (
                                        <div className="mt-4 pt-4 border-t border-teal-200">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="text-xs font-semibold text-teal-700">
                                                    Route Details ({routeDetails.hops} hop{routeDetails.hops !== 1 ? 's' : ''})
                                                </div>
                                                {routeDetails.routesUsed > 1 && (
                                                    <div className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-full border border-amber-300">
                                                        🔀 Multi-Route Journey
                                                    </div>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                {routeDetails.route.map((seg, i) => (
                                                    <div key={i} className="bg-white rounded-lg p-3 border border-teal-100">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <div className="text-xs font-medium text-slate-700">
                                                                        {seg.originName || seg.origin}
                                                                    </div>
                                                                    {seg.routeName && (
                                                                        <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 border border-slate-200">
                                                                            {seg.routeName}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div className="text-xs text-slate-400 my-1">↓</div>
                                                                <div className="text-xs font-medium text-slate-700">
                                                                    {seg.destinationName || seg.destination}
                                                                </div>
                                                            </div>
                                                            <div className="font-mono text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded">
                                                                {seg.distance} km
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <Button className="w-full" onClick={calculateDistance}>
                                Calculate
                            </Button>
                        </Card>
                    )
                }

            </div >
        </PageLayout >
    );
};

export default Settings;
