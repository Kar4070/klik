import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, useLocation } from 'react-router-dom';

// Simple Icons
const HomeIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);
const StatsIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);
const SettingsIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

export default function Settings() {
    const navigate = useNavigate();
    const location = useLocation();
    const [pro, setPro] = useState(null);
    const [servicesCount, setServicesCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [scheduleSummary, setScheduleSummary] = useState('Chargement...');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/login');
                return;
            }

            // Fetch Pro
            const { data: proData } = await supabase.from('pros').select('*').eq('id', user.id).single();
            if (proData) setPro(proData);

            // Fetch Services Count
            const { count } = await supabase
                .from('services')
                .select('*', { count: 'exact', head: true })
                .eq('pro_id', user.id);
            setServicesCount(count || 0);

            // Fetch Schedules for summary
            const { data: schedData } = await supabase
                .from('schedules')
                .select('*')
                .eq('pro_id', user.id)
                .order('day_of_week', { ascending: true });

            if (schedData && schedData.length > 0) {
                const openDays = schedData.filter(s => s.is_open);
                if (openDays.length === 0) {
                    setScheduleSummary('Fermé');
                } else {
                    const firstDay = openDays[0];
                    setScheduleSummary(`Lun-Sam · ${firstDay.start_time}-${firstDay.end_time}`); // Simplified summary
                }
            } else {
                setScheduleSummary('Non configuré');
            }

        } catch (error) {
            console.error("Error fetching settings data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F4F1EC] flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#C8372D]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F4F1EC] flex justify-center font-sans pb-32">
            <div className="w-full max-w-[390px] relative px-4 flex flex-col pt-10 page-transition">
                
                <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-8 px-2">Paramètres</h1>

                {/* Profile Card */}
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 mb-8 relative overflow-hidden group">
                    <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-[#C8372D]/5 rounded-full blur-[20px] transition-transform group-hover:scale-125"></div>
                    <div className="flex items-center gap-5 relative z-10">
                        <div className="w-16 h-16 bg-[#C8372D]/10 text-[#C8372D] rounded-full flex items-center justify-center font-black text-3xl shadow-inner border border-[#C8372D]/20">
                            {pro?.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                            <p className="font-black text-gray-900 text-xl leading-tight mb-1">{pro?.name}</p>
                            <p className="text-gray-500 font-bold text-sm mb-2">{pro?.phone}</p>
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-orange-50 text-orange-600 rounded-lg text-[10px] font-black uppercase tracking-wider border border-orange-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                                24 jours restants
                            </div>
                        </div>
                    </div>
                </div>

                {/* Settings Menu */}
                <div className="flex flex-col gap-4">
                    
                    {/* Services */}
                    <div 
                        onClick={() => navigate('/settings/services')} 
                        className="flex items-center gap-4 p-5 bg-white rounded-[1.5rem] shadow-sm border border-gray-100 active:scale-[0.98] transition-all cursor-pointer hover:border-[#C8372D]/20 group"
                    >
                        <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🛎️</div>
                        <div className="flex-1">
                            <div className="font-black text-gray-900 text-base mb-0.5">Mes services & tarifs</div>
                            <div className="text-xs text-gray-400 font-bold">{servicesCount} services configurés</div>
                        </div>
                        <div className="text-gray-300 text-2xl font-light">›</div>
                    </div>

                    {/* Schedules */}
                    <div 
                        onClick={() => navigate('/settings/schedules')} 
                        className="flex items-center gap-4 p-5 bg-white rounded-[1.5rem] shadow-sm border border-gray-100 active:scale-[0.98] transition-all cursor-pointer hover:border-[#C8372D]/20 group"
                    >
                        <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">⏰</div>
                        <div className="flex-1">
                            <div className="font-black text-gray-900 text-base mb-0.5">Mes horaires</div>
                            <div className="text-xs text-gray-400 font-bold">{scheduleSummary}</div>
                        </div>
                        <div className="text-gray-300 text-2xl font-light">›</div>
                    </div>

                    {/* QR Code */}
                    <div 
                        onClick={() => navigate('/settings/qr')} 
                        className="flex items-center gap-4 p-5 bg-white rounded-[1.5rem] shadow-sm border border-gray-100 active:scale-[0.98] transition-all cursor-pointer hover:border-[#C8372D]/20 group"
                    >
                        <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">📲</div>
                        <div className="flex-1">
                            <div className="font-black text-gray-900 text-base mb-0.5">Mon QR Code</div>
                            <div className="text-xs text-gray-400 font-bold">Partager avec vos clients</div>
                        </div>
                        <div className="text-gray-300 text-2xl font-light">›</div>
                    </div>

                    <div className="h-4"></div>

                    {/* Toggles & Other settings placeholders */}
                    <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
                        <div className="flex items-center justify-between p-5 border-b border-gray-50">
                            <div className="flex items-center gap-4">
                                <div className="text-xl">🔔</div>
                                <span className="font-bold text-gray-700">Notifications</span>
                            </div>
                            <div className="w-12 h-6 bg-[#C8372D] rounded-full p-1 flex items-center justify-end">
                                <div className="bg-white w-4 h-4 rounded-full"></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-5 border-b border-gray-50">
                            <div className="flex items-center gap-4">
                                <div className="text-xl">📅</div>
                                <span className="font-bold text-gray-700">Sync. Calendrier</span>
                            </div>
                            <div className="text-gray-300">›</div>
                        </div>
                        <div className="flex items-center justify-between p-5">
                            <div className="flex items-center gap-4">
                                <div className="text-xl">💳</div>
                                <span className="font-bold text-gray-700">Paiements</span>
                            </div>
                            <div className="text-gray-300">›</div>
                        </div>
                    </div>

                    {/* Subscribe Button */}
                    <button className="mt-4 w-full bg-gray-900 text-white font-black py-5 rounded-[1.5rem] shadow-xl active:scale-95 transition-all text-lg flex items-center justify-center gap-3">
                        <span>⭐</span>
                        Passer à KLIK Pro
                    </button>

                </div>
            </div>

            {/* Bottom Nav */}
            <div key={location.pathname} className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-[350px]">
                <div className="bg-white/90 backdrop-blur-xl border border-white/50 shadow-2xl shadow-gray-300/40 rounded-full p-2 flex justify-between items-center">
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className={`flex flex-col items-center flex-1 py-3 rounded-full transition-colors ${location.pathname === '/dashboard' ? 'text-[#C8372D]' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <div className={`${location.pathname === '/dashboard' ? 'bg-[#C8372D]/10 p-2 rounded-full' : ''}`}>
                            <HomeIcon />
                        </div>
                    </button>
                    <button 
                        onClick={() => navigate('/stats')}
                        className={`flex flex-col items-center flex-1 py-3 rounded-full transition-colors ${location.pathname === '/stats' ? 'text-[#C8372D]' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <div className={`${location.pathname === '/stats' ? 'bg-[#C8372D]/10 p-2 rounded-full' : ''}`}>
                            <StatsIcon />
                        </div>
                    </button>
                    <button 
                        onClick={() => navigate('/settings')}
                        className={`flex flex-col items-center flex-1 py-3 rounded-full transition-colors ${location.pathname === '/settings' ? 'text-[#C8372D]' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <div className={`${location.pathname === '/settings' ? 'bg-[#C8372D]/10 p-2 rounded-full' : ''}`}>
                            <SettingsIcon />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
