import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, useLocation } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

// Simple Icons
const HomeIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);
const StatsIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);
const SettingsIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const ArrowLeftIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);
const TrashIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);
const DownloadIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);
const WhatsappIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.031 0C5.385 0 0 5.373 0 12.01c0 2.128.553 4.205 1.603 6.035L.234 22.84l4.94-1.293C6.93 22.484 8.925 23 11 23c6.646 0 12.031-5.373 12.031-12.01S17.646 0 12.031 0zm0 21.056c-1.802 0-3.553-.483-5.088-1.396l-.364-.216-3.666.96.975-3.57-.237-.378C2.71 14.937 2.193 13.116 2.193 11.23c0-5.385 4.385-9.771 9.771-9.771 5.385 0 9.771 4.386 9.771 9.771 0 5.386-4.386 9.772-9.771 9.772zm5.35-7.39c-.29-.145-1.74-.858-2.012-.958-.27-.1-.47-.145-.66.145-.19.29-.76.958-.93 1.15-.17.193-.34.218-.63.072-1.666-.826-2.903-2.316-3.235-2.887-.1-.17-.01-.26.062-.332.065-.065.145-.17.218-.26a1.14 1.14 0 00.145-.244c.048-.1.025-.19-.01-.26-.035-.072-.66-1.59-.905-2.18-.24-.58-.485-.5-.66-.51H8.05c-.19 0-.5.072-.76.36-.265.29-1.015.99-1.015 2.41 0 1.42 1.04 2.79 1.185 2.98.145.19 2.03 3.1 4.92 4.3.69.285 1.23.455 1.65.584.69.213 1.32.183 1.81.11.55-.08 1.74-.71 1.98-1.4.24-.69.24-1.28.17-1.4-.07-.12-.26-.195-.55-.34z" />
    </svg>
);

const DEFAULT_SCHEDULES = [
    { day_of_week: 1, is_open: true, start_time: '09:00', end_time: '18:00', break_enabled: false, break_start: '13:00', break_end: '14:00' },
    { day_of_week: 2, is_open: true, start_time: '09:00', end_time: '18:00', break_enabled: false, break_start: '13:00', break_end: '14:00' },
    { day_of_week: 3, is_open: true, start_time: '09:00', end_time: '18:00', break_enabled: false, break_start: '13:00', break_end: '14:00' },
    { day_of_week: 4, is_open: true, start_time: '09:00', end_time: '18:00', break_enabled: false, break_start: '13:00', break_end: '14:00' },
    { day_of_week: 5, is_open: true, start_time: '09:00', end_time: '18:00', break_enabled: false, break_start: '13:00', break_end: '14:00' },
    { day_of_week: 6, is_open: true, start_time: '09:00', end_time: '18:00', break_enabled: false, break_start: '13:00', break_end: '14:00' },
    { day_of_week: 0, is_open: false, start_time: '09:00', end_time: '18:00', break_enabled: false, break_start: '13:00', break_end: '14:00' }
];

const dayNames = { 1: 'Lun', 2: 'Mar', 3: 'Mer', 4: 'Jeu', 5: 'Ven', 6: 'Sam', 0: 'Dim' };

export default function Settings() {
    const navigate = useNavigate();
    const location = useLocation();
    const [pro, setPro] = useState(null);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    
    // Services
    const [showAddServiceModal, setShowAddServiceModal] = useState(false);
    const [newService, setNewService] = useState({ name: '', price: '', duration_minutes: '' });

    // Schedules
    const [schedules, setSchedules] = useState([]);
    const [savingSchedules, setSavingSchedules] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/');
                return;
            }
            setUser(user);

            // Fix 1 — Faster navigation between pages
            let proDataToUse = null;
            const cachedPro = sessionStorage.getItem('klik_pro');
            if (cachedPro) {
                proDataToUse = JSON.parse(cachedPro);
                setPro(proDataToUse);
            } else {
                const { data: proData } = await supabase.from('pros').select('*').eq('id', user.id).single();
                if (proData) {
                    setPro(proData);
                    sessionStorage.setItem('klik_pro', JSON.stringify(proData));
                    proDataToUse = proData;
                }
            }

            if (!proDataToUse) return;

            // Fetch Services
            const cachedServices = sessionStorage.getItem('klik_services');
            if (cachedServices) {
                setServices(JSON.parse(cachedServices));
            } else {
                const { data: servicesData } = await supabase.from('services').select('*').eq('pro_id', proDataToUse.id);
                const sData = servicesData || [];
                setServices(sData);
                sessionStorage.setItem('klik_services', JSON.stringify(sData));
            }

            // Fetch Schedules
            const { data: schedData } = await supabase
                .from('schedules')
                .select('*')
                .eq('pro_id', user.id)
                .order('day_of_week', { ascending: true });

            if (schedData && schedData.length === 7) {
                // Ensure proper order 1..6 then 0
                const sorted = [...schedData].sort((a, b) => {
                    const orderA = a.day_of_week === 0 ? 7 : a.day_of_week;
                    const orderB = b.day_of_week === 0 ? 7 : b.day_of_week;
                    return orderA - orderB;
                }).map(s => ({
                    ...s,
                    break_enabled: !!s.break_start && !!s.break_end,
                    break_start: s.break_start || '13:00',
                    break_end: s.break_end || '14:00'
                }));
                setSchedules(sorted);
            } else {
                setSchedules(DEFAULT_SCHEDULES);
            }

        } catch (error) {
            console.error("Error fetching settings:", error);
        } finally {
            setLoading(false);
        }
    };

    // Services methods
    const handleSaveService = async () => {
        if (!newService.name || !newService.price || !newService.duration_minutes) return;

        const { data, error } = await supabase.from('services').insert([{
            pro_id: user.id,
            name: newService.name,
            price: Number(newService.price),
            duration_minutes: Number(newService.duration_minutes)
        }]).select();

        if (!error && data) {
            setServices([...services, data[0]]);
            setShowAddServiceModal(false);
            setNewService({ name: '', price: '', duration_minutes: '' });
        }
    };

    const handleDeleteService = async (id) => {
        const { error } = await supabase.from('services').delete().eq('id', id);
        if (!error) {
            setServices(services.filter(s => s.id !== id));
        }
    };

    // Schedules methods
    const handleToggleDay = (idx) => {
        const updated = [...schedules];
        updated[idx].is_open = !updated[idx].is_open;
        setSchedules(updated);
    };

    const handleTimeChange = (idx, field, value) => {
        const updated = [...schedules];
        updated[idx][field] = value;
        setSchedules(updated);
    };

    const handleSaveSchedules = async () => {
        setSavingSchedules(true);
        // Clear old ones first to avoid conflict if any (simplest upsert for multiple rows)
        await supabase.from('schedules').delete().eq('pro_id', user.id);
        
        const toInsert = schedules.map(s => ({
            pro_id: user.id,
            day_of_week: s.day_of_week,
            is_open: s.is_open,
            start_time: s.start_time,
            end_time: s.end_time,
            break_start: s.break_enabled ? s.break_start : null,
            break_end: s.break_enabled ? s.break_end : null
        }));

        await supabase.from('schedules').insert(toInsert);
        setSavingSchedules(false);
        // Optional alert or toast
    };

    const bookingUrl = user ? `${window.location.origin}/booking/${user.id}` : '';

    const handleDownloadQR = () => {
        const svg = document.getElementById("qr-svg");
        if (!svg) return;
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.onload = () => {
            const padding = 20;
            canvas.width = img.width + padding * 2;
            canvas.height = img.height + padding * 2;
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, padding, padding);
            const downloadLink = document.createElement("a");
            downloadLink.download = "KLIK-QR.png";
            downloadLink.href = canvas.toDataURL("image/png");
            downloadLink.click();
        };
        img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    };

    const handleWhatsAppShare = () => {
        if (!bookingUrl) return;
        window.open(`https://wa.me/?text=${encodeURIComponent(`Réservez chez moi: ${bookingUrl}`)}`, '_blank');
    };

    if (loading) {
        return <div className="min-h-screen bg-[#F4F1EC] flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#C8372D]"></div>
        </div>;
    }

    return (
        <div className="min-h-screen bg-[#F4F1EC] flex justify-center font-sans pb-32">
            <div className="w-full max-w-[390px] relative px-4 flex flex-col pt-6 page-transition">
                
                {/* Header */}
                <header className="flex items-center mb-6">
                    <button 
                        onClick={() => navigate('/dashboard')} 
                        className="p-3 mr-3 bg-white hover:bg-gray-50 rounded-full shadow-sm text-gray-800 transition-colors"
                    >
                        <ArrowLeftIcon />
                    </button>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Paramètres</h1>
                </header>

                {/* Section 1: Mon profil */}
                <section className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-100 mb-5 relative overflow-hidden">
                    <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-[#C8372D]/5 rounded-full blur-[20px]"></div>
                    <h2 className="text-[11px] font-black uppercase text-gray-400 tracking-wider mb-4">Mon profil</h2>
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-14 h-14 bg-[#C8372D]/10 text-[#C8372D] rounded-full flex items-center justify-center font-black text-2xl shadow-inner border border-[#C8372D]/20">
                            {pro?.name?.charAt(0)?.toUpperCase() || 'P'}
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 text-lg leading-tight mb-1">{pro?.name}</p>
                            <p className="text-gray-500 font-medium text-sm flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                {pro?.phone}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Section 2: Mes services & tarifs */}
                <section className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-100 mb-5">
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-[11px] font-black uppercase text-gray-400 tracking-wider">Mes services</h2>
                        <button 
                            onClick={() => setShowAddServiceModal(true)} 
                            className="text-[#C8372D] font-bold text-sm bg-[#C8372D]/10 px-3.5 py-1.5 rounded-xl hover:bg-[#C8372D]/20 transition-colors"
                        >
                            ＋ Ajouter
                        </button>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                        {services.length === 0 ? (
                            <div className="text-sm text-gray-400 font-medium text-center py-6 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                                Aucun service défini
                            </div>
                        ) : services.map(s => (
                            <div key={s.id} className="flex items-center justify-between p-3.5 border border-gray-100 rounded-2xl bg-gray-50/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                                <div className="flex items-center gap-3">
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm mb-0.5">{s.name}</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-500 font-medium bg-gray-200/50 px-2 py-0.5 rounded-md">{s.duration_minutes} min</span>
                                            <span className="text-[10px] text-gray-300">•</span>
                                            <span className="text-xs text-gray-700 font-bold">{s.price} DT</span>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleDeleteService(s.id)} 
                                    className="p-2.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all active:scale-95"
                                >
                                    <TrashIcon />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section 3: Mes horaires */}
                <section className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-100 mb-5">
                    <h2 className="text-[11px] font-black uppercase text-gray-400 tracking-wider mb-5">Mes horaires</h2>
                    <div className="flex flex-col gap-3.5 mb-6">
                        {schedules.map((sched, idx) => (
                            <div key={idx} className="flex flex-col border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3 w-[120px]">
                                        {/* Toggle Switch */}
                                        <div 
                                            onClick={() => handleToggleDay(idx)}
                                            className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${sched.is_open ? 'bg-[#C8372D]' : 'bg-gray-200'}`}
                                        >
                                            <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-300 ${sched.is_open ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                        </div>
                                        <span className={`font-bold text-sm w-9 ${sched.is_open ? 'text-gray-900' : 'text-gray-400'}`}>
                                            {dayNames[sched.day_of_week]}
                                        </span>
                                    </div>
                                    
                                    {sched.is_open ? (
                                        <div className="flex items-center gap-2 flex-1 justify-end">
                                            <div className="relative">
                                                <input 
                                                    type="time" 
                                                    value={sched.start_time} 
                                                    onChange={(e) => handleTimeChange(idx, 'start_time', e.target.value)} 
                                                    className="bg-gray-50 border border-gray-200/80 rounded-lg px-2 py-1.5 text-xs font-bold text-center w-20 outline-none focus:border-[#C8372D] focus:ring-2 focus:ring-[#C8372D]/10" 
                                                />
                                            </div>
                                            <span className="text-gray-300 font-bold">-</span>
                                            <div className="relative">
                                                <input 
                                                    type="time" 
                                                    value={sched.end_time} 
                                                    onChange={(e) => handleTimeChange(idx, 'end_time', e.target.value)} 
                                                    className="bg-gray-50 border border-gray-200/80 rounded-lg px-2 py-1.5 text-xs font-bold text-center w-20 outline-none focus:border-[#C8372D] focus:ring-2 focus:ring-[#C8372D]/10" 
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex-1 text-right text-xs font-bold text-gray-300 mr-2">Fermé</div>
                                    )}
                                </div>

                                {sched.is_open && (
                                    <div className="mt-2 ml-[120px] bg-gray-50 rounded-xl p-3 border border-gray-100 flex flex-col gap-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-gray-600">Pause déjeuner</span>
                                            <div 
                                                onClick={() => handleTimeChange(idx, 'break_enabled', !sched.break_enabled)}
                                                className={`w-9 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${sched.break_enabled ? 'bg-orange-500' : 'bg-gray-200'}`}
                                            >
                                                <div className={`bg-white w-3 h-3 rounded-full shadow-sm transform transition-transform duration-300 ${sched.break_enabled ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                            </div>
                                        </div>
                                        {sched.break_enabled && (
                                            <div className="flex items-center gap-2 justify-end mt-1">
                                                <input 
                                                    type="time" 
                                                    value={sched.break_start || '13:00'} 
                                                    onChange={(e) => handleTimeChange(idx, 'break_start', e.target.value)} 
                                                    className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-bold text-center w-20 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10" 
                                                />
                                                <span className="text-gray-400 font-bold">-</span>
                                                <input 
                                                    type="time" 
                                                    value={sched.break_end || '14:00'} 
                                                    onChange={(e) => handleTimeChange(idx, 'break_end', e.target.value)} 
                                                    className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-bold text-center w-20 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10" 
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <button 
                        onClick={handleSaveSchedules} 
                        disabled={savingSchedules}
                        className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3.5 rounded-xl shadow-md active:scale-95 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {savingSchedules ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        ) : "Enregistrer les horaires"}
                    </button>
                </section>

                {/* Section 4: Mon QR Code */}
                <section className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-100 mb-8">
                    <h2 className="text-[11px] font-black uppercase text-gray-400 tracking-wider mb-5">Mon QR Code</h2>
                    
                    <div className="border-2 border-dashed border-gray-100 rounded-3xl p-6 flex flex-col items-center justify-center mb-5 bg-gray-50/50">
                        {user && (
                            <div className="w-[180px] h-[180px] bg-white flex items-center justify-center mb-4">
                                <QRCodeSVG 
                                    id="qr-svg"
                                    value={bookingUrl}
                                    size={180}
                                    bgColor="#ffffff"
                                    fgColor="#18120E"
                                    level="H"
                                />
                            </div>
                        )}
                        <p className="text-[11px] font-mono font-bold text-gray-500 text-center tracking-wide break-all w-full leading-relaxed">
                            {bookingUrl}
                        </p>
                    </div>
                    
                    <div className="flex gap-3">
                        <button onClick={handleDownloadQR} className="flex-1 bg-white border border-gray-200 hover:border-gray-300 text-gray-800 font-bold py-3.5 rounded-xl flex justify-center items-center gap-2 text-sm transition-all shadow-sm active:scale-95">
                            <DownloadIcon />
                            <span>Télécharger</span>
                        </button>
                        <button onClick={handleWhatsAppShare} className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3.5 rounded-xl flex justify-center items-center gap-2 text-sm transition-all shadow-md shadow-[#25D366]/20 active:scale-95">
                            <WhatsappIcon />
                        </button>
                    </div>
                </section>

                {/* Modal Ajouter un service */}
                {showAddServiceModal && (
                    <div className="fixed inset-0 z-[100] max-w-[390px] mx-auto flex flex-col justify-end">
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setShowAddServiceModal(false)}></div>
                        
                        <div className="bg-white rounded-t-[2rem] p-7 shadow-2xl relative z-10 animate-slideUp">
                            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
                            
                            <h3 className="font-black text-2xl mb-6 text-gray-900">Ajouter un service</h3>
                            
                            <div className="flex flex-col gap-5 mb-8">
                                <div>
                                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Nom du service</label>
                                    <input 
                                        type="text" 
                                        placeholder="Ex: Coupe Homme"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-[#C8372D] focus:ring-4 focus:ring-[#C8372D]/10 font-bold transition-all placeholder:font-medium placeholder:text-gray-400"
                                        value={newService.name}
                                        onChange={e => setNewService({...newService, name: e.target.value})}
                                    />
                                </div>
                                
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Durée (min)</label>
                                        <input 
                                            type="number" 
                                            placeholder="30"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-[#C8372D] focus:ring-4 focus:ring-[#C8372D]/10 font-bold transition-all text-center"
                                            value={newService.duration_minutes}
                                            onChange={e => setNewService({...newService, duration_minutes: e.target.value})}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Prix (DT)</label>
                                        <input 
                                            type="number" 
                                            placeholder="15"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-[#C8372D] focus:ring-4 focus:ring-[#C8372D]/10 font-bold transition-all text-center"
                                            value={newService.price}
                                            onChange={e => setNewService({...newService, price: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <button 
                                onClick={handleSaveService}
                                disabled={!newService.name || !newService.price || !newService.duration_minutes}
                                className="w-full bg-[#C8372D] hover:bg-[#b02e24] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#C8372D]/30 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
                            >
                                Enregistrer
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Nav */}
            <div key={location.pathname} className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-[350px]">
                <div className="bg-white/90 backdrop-blur-xl border border-white/50 shadow-2xl shadow-gray-300/40 rounded-full p-2 flex justify-between items-center">
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className={`flex flex-col items-center flex-1 py-2 rounded-full transition-colors ${location.pathname === '/dashboard' ? 'text-[#C8372D]' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <div className={`${location.pathname === '/dashboard' ? 'bg-[#C8372D]/10 p-1.5 rounded-full' : ''}`}>
                            <HomeIcon />
                        </div>
                    </button>
                    <button 
                        onClick={() => navigate('/stats')}
                        className={`flex flex-col items-center flex-1 py-2 rounded-full transition-colors ${location.pathname === '/stats' ? 'text-[#C8372D]' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <div className={`${location.pathname === '/stats' ? 'bg-[#C8372D]/10 p-1.5 rounded-full' : ''}`}>
                            <StatsIcon />
                        </div>
                    </button>
                    <button 
                        onClick={() => navigate('/settings')}
                        className={`flex flex-col items-center flex-1 py-2 rounded-full transition-colors ${location.pathname === '/settings' ? 'text-[#C8372D]' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <div className={`${location.pathname === '/settings' ? 'bg-[#C8372D]/10 p-1.5 rounded-full' : ''}`}>
                            <SettingsIcon />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
