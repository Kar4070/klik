import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const ArrowLeftIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
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

const dayNames = { 1: 'Lundi', 2: 'Mardi', 3: 'Mercredi', 4: 'Jeudi', 5: 'Vendredi', 6: 'Samedi', 0: 'Dimanche' };

export default function SchedulesList() {
    const navigate = useNavigate();
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [savingSchedules, setSavingSchedules] = useState(false);

    useEffect(() => {
        fetchSchedules();
    }, []);

    const fetchSchedules = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/login');
                return;
            }
            setUser(user);

            const { data: schedData } = await supabase
                .from('schedules')
                .select('*')
                .eq('pro_id', user.id)
                .order('day_of_week', { ascending: true });

            if (schedData && schedData.length === 7) {
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
            console.error("Error fetching schedules:", error);
        } finally {
            setLoading(false);
        }
    };

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
        try {
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
        } catch (error) {
            console.error("Error saving schedules:", error);
        } finally {
            setSavingSchedules(false);
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
            <div className="w-full max-w-[390px] relative px-4 flex flex-col pt-6 page-transition">
                
                {/* Header */}
                <header className="flex items-center mb-6">
                    <button 
                        onClick={() => navigate('/settings')} 
                        className="p-3 mr-3 bg-white hover:bg-gray-50 rounded-full shadow-sm text-gray-800 transition-colors"
                    >
                        <ArrowLeftIcon />
                    </button>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Mes horaires</h1>
                </header>

                {/* Schedules List */}
                <div className="flex flex-col gap-4 mb-24">
                    {schedules.map((sched, idx) => (
                        <div key={idx} className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div 
                                        onClick={() => handleToggleDay(idx)}
                                        className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${sched.is_open ? 'bg-[#C8372D]' : 'bg-gray-200'}`}
                                    >
                                        <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-300 ${sched.is_open ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                    </div>
                                    <span className={`font-black text-lg ${sched.is_open ? 'text-gray-900' : 'text-gray-400'}`}>
                                        {dayNames[sched.day_of_week]}
                                    </span>
                                </div>
                                {!sched.is_open && <span className="text-sm font-bold text-gray-300">Fermé</span>}
                            </div>
                            
                            {sched.is_open && (
                                <div className="flex flex-col gap-4 animate-fadeIn">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1">
                                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 px-1">Ouverture</label>
                                            <input 
                                                type="time" 
                                                value={sched.start_time} 
                                                onChange={(e) => handleTimeChange(idx, 'start_time', e.target.value)} 
                                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-3 text-sm font-bold text-center outline-none focus:border-[#C8372D] transition-colors" 
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 px-1">Fermeture</label>
                                            <input 
                                                type="time" 
                                                value={sched.end_time} 
                                                onChange={(e) => handleTimeChange(idx, 'end_time', e.target.value)} 
                                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-3 text-sm font-bold text-center outline-none focus:border-[#C8372D] transition-colors" 
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-gray-700">Pause déjeuner</span>
                                            </div>
                                            <div 
                                                onClick={() => handleTimeChange(idx, 'break_enabled', !sched.break_enabled)}
                                                className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${sched.break_enabled ? 'bg-orange-500' : 'bg-gray-200'}`}
                                            >
                                                <div className={`bg-white w-3 h-3 rounded-full shadow-sm transform transition-transform duration-300 ${sched.break_enabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                            </div>
                                        </div>
                                        
                                        {sched.break_enabled && (
                                            <div className="flex items-center gap-3 animate-slideDown">
                                                <div className="flex-1">
                                                    <input 
                                                        type="time" 
                                                        value={sched.break_start} 
                                                        onChange={(e) => handleTimeChange(idx, 'break_start', e.target.value)} 
                                                        className="w-full bg-white border border-gray-200 rounded-lg px-2 py-2 text-xs font-bold text-center outline-none focus:border-orange-500" 
                                                    />
                                                </div>
                                                <span className="text-gray-300 font-bold">à</span>
                                                <div className="flex-1">
                                                    <input 
                                                        type="time" 
                                                        value={sched.break_end} 
                                                        onChange={(e) => handleTimeChange(idx, 'break_end', e.target.value)} 
                                                        className="w-full bg-white border border-gray-200 rounded-lg px-2 py-2 text-xs font-bold text-center outline-none focus:border-orange-500" 
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Save Button */}
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-[350px] px-4">
                    <button 
                        onClick={handleSaveSchedules} 
                        disabled={savingSchedules}
                        className="w-full bg-gray-900 hover:bg-black text-white font-black py-4 rounded-2xl shadow-xl active:scale-95 transition-all text-lg flex items-center justify-center gap-3 disabled:opacity-70"
                    >
                        {savingSchedules ? (
                            <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        ) : "Enregistrer les horaires"}
                    </button>
                </div>
            </div>
        </div>
    );
}
