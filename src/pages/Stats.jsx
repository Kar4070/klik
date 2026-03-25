import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, useLocation } from 'react-router-dom';

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

export default function StatsPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        todayRevenue: 0,
        monthRevenue: 0,
        absentCountToday: 0,
        lostRevenueToday: 0,
        totalApptsMonth: 0,
        respectCountMonth: 0,
        successRateMonth: 0,
        absentCountMonth: 0,
        uniqueClientsMonth: 0,
        cancelledSumMonth: 0,
        regularClients: 0,
        avgPerRdv: 0,
        serviceStats: []
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/');
                return;
            }

            const now = new Date();
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();

            // Fetch ALL appointments this month
            const startOfMonth = new Date(currentYear, currentMonth, 1).toISOString().split('T')[0]
            const endOfMonth = new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0]

            const { data: monthAppointmentsData } = await supabase
                .from('appointments')
                .select('*, services(name, price, duration_minutes)')
                .eq('pro_id', user.id)
                .gte('appointment_date', startOfMonth)
                .lte('appointment_date', endOfMonth)

            const monthAppointments = monthAppointmentsData || []
            const today = new Date().toISOString().split('T')[0]

            // Today's confirmed revenue
            const confirmedToday = monthAppointments.filter(a => 
                a.appointment_date === today && a.status === 'confirmed'
            )
            const revenueToday = confirmedToday.reduce((sum, a) => sum + (a.services?.price || 0), 0)

            // This month's confirmed revenue
            const confirmedMonth = monthAppointments.filter(a => a.status === 'confirmed')
            const revenueMonth = confirmedMonth.reduce((sum, a) => sum + (a.services?.price || 0), 0)

            // Manque à gagner today (absent + cancelled today)
            const lostToday = monthAppointments.filter(a => 
                a.appointment_date === today && 
                (a.status === 'absent' || a.status === 'cancelled')
            )
            const manqueToday = lostToday.reduce((sum, a) => sum + (a.services?.price || 0), 0)

            // Total this month (all except cancelled/absent)
            const totalMonth = monthAppointments.filter(a => 
                a.status !== 'cancelled' && a.status !== 'absent'
            ).length

            // Absent this month
            const absentMonth = monthAppointments.filter(a => 
                a.status === 'absent' || a.status === 'cancelled'
            ).length

            // Success rate
            const successRate = totalMonth > 0 
                ? Math.round((confirmedMonth.length / totalMonth) * 100) 
                : 0

            // Unique clients this month
            const uniqueClients = [...new Set(
                monthAppointments
                    .filter(a => a.status === 'confirmed')
                    .map(a => a.client_phone)
            )].length

            // Average per appointment
            const avgPerRdv = confirmedMonth.length > 0 
                ? Math.round(revenueMonth / confirmedMonth.length) 
                : 0

            // Regular clients (more than 2 visits)
            const clientVisits = {}
            monthAppointments
                .filter(a => a.status === 'confirmed')
                .forEach(a => {
                    if (a.client_phone) {
                        clientVisits[a.client_phone] = (clientVisits[a.client_phone] || 0) + 1
                    }
                })
            const regularClients = Object.values(clientVisits).filter(v => v > 2).length

            // Top services
            const serviceCount = {}
            monthAppointments
                .filter(a => a.status === 'confirmed')
                .forEach(a => {
                    const name = a.services?.name || 'Inconnu'
                    serviceCount[name] = (serviceCount[name] || 0) + 1
                })
            const topServices = Object.entries(serviceCount)
                .sort((a, b) => b[1] - a[1])
                .map(([name, count]) => ({
                    name,
                    count,
                    percentage: confirmedMonth.length > 0 ? Math.round((count / confirmedMonth.length) * 100) : 0
                })).slice(0, 5)

            setStats({
                todayRevenue: revenueToday,
                monthRevenue: revenueMonth,
                absentCountToday: lostToday.length,
                lostRevenueToday: manqueToday,
                totalApptsMonth: totalMonth,
                respectCountMonth: confirmedMonth.length,
                successRateMonth: successRate,
                absentCountMonth: absentMonth,
                uniqueClientsMonth: uniqueClients,
                cancelledSumMonth: monthAppointments.filter(a => a.status === 'cancelled').length, // Explicit for UI
                regularClients: regularClients,
                avgPerRdv: avgPerRdv,
                serviceStats: topServices
            });

        } catch (err) {
            console.error("Stats Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const today = new Date();
    const currentMonthYear = today.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F4F1EC] flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#C8372D]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F4F1EC] flex justify-center font-sans pb-28 text-gray-900">
            <div className="w-full max-w-[390px] relative px-4 flex flex-col gap-5 pt-6 animate-fadeIn page-transition">
                
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Statistiques</h1>
                    <p className="text-[#C8372D] font-bold capitalize mt-0.5">{currentMonthYear}</p>
                </div>

                {/* Section 1: Recette row */}
                <div className="flex gap-4">
                    <div className="flex-1 bg-white p-4 rounded-[1.5rem] shadow-sm border border-gray-100 flex flex-col gap-2 relative overflow-hidden">
                        <p className="text-[11px] font-black text-gray-500 uppercase tracking-wide">💵 Recette du jour</p>
                        <p className="text-2xl font-black text-green-600 leading-none">{stats.todayRevenue} <span className="text-sm">DT</span></p>
                    </div>
                    <div className="flex-1 bg-white p-4 rounded-[1.5rem] shadow-sm border border-gray-100 flex flex-col gap-2 relative overflow-hidden">
                        <p className="text-[11px] font-black text-gray-500 uppercase tracking-wide">📈 Ce mois-ci</p>
                        <p className="text-2xl font-black text-[#C8372D] leading-none">{stats.monthRevenue} <span className="text-sm">DT</span></p>
                    </div>
                </div>

                {/* Section 2: Manque à gagner */}
                <div className="bg-red-500 p-5 rounded-[1.5rem] text-white shadow-lg shadow-red-500/20 relative overflow-hidden">
                    <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-white/10 rounded-full blur-[30px] pointer-events-none"></div>
                    <div className="relative z-10">
                        <p className="text-sm font-bold opacity-90 flex items-center gap-2 mb-1">😔 Manque à gagner</p>
                        <p className="text-3xl font-black mb-1">{stats.lostRevenueToday} DT</p>
                        <p className="text-sm font-medium opacity-90">{stats.absentCountToday} RDV absent(s) aujourd'hui</p>
                    </div>
                </div>

                {/* Section 3: Stats Hero */}
                <div className="bg-[#18120E] text-white p-6 rounded-[1.5rem] shadow-xl relative overflow-hidden flex flex-col gap-4">
                    <div className="absolute top-[-20px] left-[-20px] w-40 h-40 bg-[#C8372D]/20 rounded-full blur-[40px] pointer-events-none"></div>
                    
                    <div className="flex justify-between items-end relative z-10">
                        <div>
                            <p className="text-4xl font-black text-[#C8372D] mb-0.5 leading-none">{stats.totalApptsMonth}</p>
                            <p className="text-xs font-semibold text-gray-400">RDV Total ce mois</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-black mb-0.5 leading-none text-green-400">{stats.respectCountMonth}</p>
                            <p className="text-xs font-semibold text-gray-400">RDV Respectés</p>
                        </div>
                    </div>
                    
                    <div className="w-full h-px bg-white/10 my-1 relative z-10"></div>
                    
                    <div className="flex justify-between items-center relative z-10">
                        <div>
                            <p className="text-xl font-bold">{stats.successRateMonth}%</p>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">Taux de succès</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-bold text-red-400">{stats.absentCountMonth}</p>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">Absents ce mois</p>
                        </div>
                    </div>
                </div>

                {/* Section 4: Mini stats grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-3">👤</div>
                        <p className="text-2xl font-black mb-0.5 leading-none">{stats.uniqueClientsMonth}</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-wide">Clients uniques</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start">
                        <div className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-3 text-sm">❌</div>
                        <p className="text-2xl font-black mb-0.5 leading-none">{stats.cancelledSumMonth}</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-wide">Annulés ce mois</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start">
                        <div className="w-8 h-8 rounded-full bg-[#C8372D]/10 text-[#C8372D] flex items-center justify-center mb-3 text-sm">⭐</div>
                        <p className="text-2xl font-black mb-0.5 leading-none">{stats.regularClients}</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-wide">Clients réguliers</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start">
                        <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-3 text-sm">💰</div>
                        <p className="text-2xl font-black mb-0.5 leading-none">{stats.avgPerRdv} <span className="text-sm">DT</span></p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-wide">Moyenne / RDV</p>
                    </div>
                </div>

                {/* Section 5: Services */}
                <div className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-gray-100 flex flex-col gap-4 mb-4">
                    <h2 className="text-lg font-black text-gray-900">Services les plus demandés</h2>
                    {stats.serviceStats.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-6 font-medium bg-gray-50 rounded-xl">Aucune donnée disponible ce mois-ci.</p>
                    ) : (
                        <div className="flex flex-col gap-5">
                            {stats.serviceStats.map((s, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between items-end mb-1.5">
                                        <span className="text-sm font-bold text-gray-800">{s.name}</span>
                                        <span className="text-sm font-black text-gray-900">{s.percentage}%</span>
                                    </div>
                                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-[#C8372D] rounded-full transition-all duration-1000" 
                                            style={{ width: `${s.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Nav */}
            <div key={location.pathname} className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[350px]">
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
