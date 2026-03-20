import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

// Simple Icons
const ArrowLeftIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
);
const ArrowRightIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
);
const MapPinIcon = () => (
    <svg className="w-4 h-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const CheckIcon = () => (
    <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
};

export default function Booking() {
    const { proId } = useParams();
    
    // Data States
    const [loading, setLoading] = useState(true);
    const [pro, setPro] = useState(null);
    const [services, setServices] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [appointments, setAppointments] = useState([]);
    
    // Booking Flow States
    const [step, setStep] = useState(1);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null); // YYYY-MM-DD
    const [selectedTime, setSelectedTime] = useState(null); // HH:MM
    
    // Calendar States
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    
    // Form States
    const [clientName, setClientName] = useState('');
    const [clientPhone, setClientPhone] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (proId) fetchProData();
    }, [proId]);

    const fetchProData = async () => {
        try {
            setLoading(true);
            const { data: proData, error: proError } = await supabase.from('pros').select('*').eq('id', proId).single();
            if (proError) throw proError;
            setPro(proData);
            
            const { data: servData } = await supabase.from('services').select('*').eq('pro_id', proId).order('created_at', { ascending: true });
            setServices(servData || []);
            
            const { data: schedData } = await supabase.from('schedules').select('*').eq('pro_id', proId);
            setSchedules(schedData || []);
        } catch (err) {
            console.error("Pro introuvable ou erreur:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAppointmentsForDate = async (dateStr) => {
        setSelectedDate(dateStr);
        const { data } = await supabase.from('appointments')
            .select('appointment_time')
            .eq('pro_id', proId)
            .eq('appointment_date', dateStr)
            .neq('status', 'cancelled');
        setAppointments(data || []);
        setSelectedTime(null);
        setStep(3);
    };

    // Calendar Navigation
    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };
    
    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    // Generate Calendar Grid
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Mon = 0, Sun = 6
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Generate Time Slots
    const generateTimeSlots = () => {
        if (!selectedDate) return [];
        // Extract day of week: Date(selectedDate) works, but timezone offsets could shift day. Let's parse securely.
        const [y, m, d] = selectedDate.split('-');
        const dateObj = new Date(y, m - 1, d);
        const dayOfWeek = dateObj.getDay(); // 0 is Sunday
        
        // Find existing schedule or default to open
        const schedule = schedules.find(s => s.day_of_week === dayOfWeek);
        if (schedule && !schedule.is_open) return [];
        
        const startTime = schedule ? schedule.start_time : '09:00';
        const endTime = schedule ? schedule.end_time : '18:00';
        
        const slots = [];
        let [currentH, currentM] = startTime.split(':').map(Number);
        const [endH, endM] = endTime.split(':').map(Number);
        
        const endTotal = endH * 60 + endM;
        const breakStart = schedule?.break_start ? schedule.break_start.split(':').map(Number) : [25, 0];
        const breakEnd = schedule?.break_end ? schedule.break_end.split(':').map(Number) : [25, 0];
        const breakTotalStart = breakStart[0] * 60 + breakStart[1];
        const breakTotalEnd = breakEnd[0] * 60 + breakEnd[1];

        const isToday = selectedDate === new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD local
        const nowTotalMins = new Date().getHours() * 60 + new Date().getMinutes();

        while ((currentH * 60 + currentM) < endTotal) {
            const timeStr = `${String(currentH).padStart(2, '0')}:${String(currentM).padStart(2, '0')}`;
            const slotMins = currentH * 60 + currentM;
            
            const isBreak = slotMins >= breakTotalStart && slotMins < breakTotalEnd;
            const isPast = isToday && slotMins <= nowTotalMins;

            if (!isBreak && !isPast) {
                slots.push(timeStr);
            }
            
            currentM += 30;
            if (currentM >= 60) {
                currentH += 1;
                currentM -= 60;
            }
        }
        return slots;
    };

    const handleConfirmBooking = async () => {
        if (!clientName || !clientPhone) return;
        setSaving(true);
        try {
            const finalPhone = clientPhone.replace(/\s+/g, '');
            const formDbPhone = `+216${finalPhone.replace(/^0+/, '').replace(/^\+216/, '')}`;

            const { error } = await supabase.from('appointments').insert([{
                pro_id: proId,
                service_id: selectedService.id,
                client_name: clientName,
                client_phone: formDbPhone,
                appointment_date: selectedDate,
                appointment_time: selectedTime,
                status: 'pending',
                source: 'qr'
            }]);
            
            if (error) throw error;
            
            setStep(5);
            
            // Trigger WhatsApp (auto-open logic standard behavior)
            const formattedDate = new Date(selectedDate).toLocaleDateString('fr-FR');
            const message = `Nouveau RDV: ${clientName} - ${selectedService.name} - ${formattedDate} à ${selectedTime}`;
            window.location.href = `https://wa.me/${pro.phone}?text=${encodeURIComponent(message)}`;
            
        } catch(e) {
            console.error(e);
            alert("Erreur lors de la réservation");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-[#F4F1EC] flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#C8372D]"></div>
        </div>;
    }

    if (!pro) {
        return <div className="min-h-screen bg-[#F4F1EC] flex items-center justify-center font-bold text-xl text-gray-500">Professionnel introuvable</div>;
    }

    if (step === 5) {
        return (
            <div className="min-h-screen bg-[#22A96E] flex flex-col items-center justify-center p-6 font-sans text-center text-white relative">
                <div className="absolute top-[-5%] left-[-10%] w-72 h-72 bg-white/10 rounded-full blur-[80px]"></div>
                <div className="w-24 h-24 bg-white text-[#22A96E] rounded-full flex items-center justify-center border-4 border-[#22A96E]/50 shadow-2xl mb-6 relative z-10">
                    <CheckIcon />
                </div>
                <h1 className="text-4xl font-black mb-3 relative z-10">Réservé !</h1>
                <p className="text-lg font-medium opacity-90 mb-8 relative z-10">Votre rendez-vous a été enregistré.</p>
                
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 w-full max-w-[390px] border border-white/30 text-left relative z-10">
                    <p className="text-sm opacity-80 uppercase tracking-widest font-black mb-1">Détails</p>
                    <p className="font-bold text-xl mb-1">{selectedService?.name}</p>
                    <p className="font-medium text-white/90 mb-4">{new Date(selectedDate).toLocaleDateString('fr-FR')} à {selectedTime}</p>
                    
                    <div className="mt-4 pt-4 border-t border-white/20 flex items-center gap-3">
                        <span className="text-xl">⚡</span>
                        <p className="font-bold text-sm">Le professionnel a été notifié.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F4F1EC] flex justify-center font-sans pb-10">
            <div className="w-full max-w-[390px] relative flex flex-col shadow-2xl bg-[#F4F1EC]">
                
                {/* Header (Dark) */}
                <header className="bg-[#18120E] text-white pt-10 pb-6 px-6 text-center rounded-b-[2rem] shadow-md relative overflow-hidden z-20">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#C8372D]/20 rounded-full blur-[40px]"></div>
                    <div className="w-16 h-16 bg-[#C8372D] text-white rounded-full mx-auto flex items-center justify-center text-3xl font-black mb-3 border-[3px] border-[#18120E] shadow-xl relative z-10">
                        {pro.name.charAt(0).toUpperCase()}
                    </div>
                    <h1 className="text-2xl font-black tracking-tight mb-1 relative z-10">{pro.name}</h1>
                    <p className="text-[#C8372D] font-bold text-sm mb-2 relative z-10">{pro.business_type || 'Professionnel'}</p>
                    <div className="flex justify-center items-center gap-4 text-xs font-medium text-gray-400 relative z-10">
                        {pro.address && <span><MapPinIcon />{pro.address}</span>}
                        <span className="bg-white/10 px-2 py-0.5 rounded-md text-yellow-400">⭐ 4.8</span>
                    </div>
                </header>

                <div className="px-5 pt-8 flex-1 flex flex-col">
                    
                    {/* Steps Indicator */}
                    <div className="flex justify-between items-center mb-8 relative">
                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -z-10 -translate-y-1/2"></div>
                        <div className="absolute top-1/2 left-0 h-0.5 bg-[#C8372D] -z-10 -translate-y-1/2 transition-all duration-300" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
                        
                        {[1, 2, 3, 4].map(num => (
                            <div key={num} className={`w-8 h-8 rounded-full flex flex-col items-center justify-center font-black text-sm border-2 transition-all duration-300 ${step === num ? 'bg-white border-[#C8372D] text-[#C8372D]' : step > num ? 'bg-[#C8372D] border-[#C8372D] text-white' : 'bg-[#F4F1EC] border-gray-300 text-gray-400'}`}>
                                {step > num ? '✓' : num}
                            </div>
                        ))}
                    </div>

                    {/* Step 1: Services */}
                    {step === 1 && (
                        <div className="flex flex-col flex-1 animate-fadeIn pb-6">
                            <h2 className="text-xl font-black text-gray-900 mb-6 text-center">Que souhaitez-vous faire ?</h2>
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {services.map(s => (
                                    <div 
                                        key={s.id}
                                        onClick={() => setSelectedService(s)}
                                        className={`bg-white p-4 rounded-2xl cursor-pointer transition-all border-2 ${selectedService?.id === s.id ? 'border-[#C8372D] shadow-md scale-[1.02]' : 'border-transparent shadow-sm hover:border-gray-200'}`}
                                    >
                                        <div className="text-3xl mb-3">{s.icon || '✂️'}</div>
                                        <p className="font-bold text-sm text-gray-900 leading-tight mb-2">{s.name}</p>
                                        <div className="flex flex-wrap gap-1.5 mt-auto">
                                            <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-sm">{s.duration_minutes} min</span>
                                            <span className="text-[10px] font-black text-[#C8372D] bg-[#C8372D]/10 px-1.5 py-0.5 rounded-sm">{s.price} DT</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button 
                                disabled={!selectedService}
                                onClick={() => setStep(2)}
                                className="w-full mt-auto bg-[#C8372D] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#C8372D]/30 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95"
                            >
                                Choisir une date →
                            </button>
                        </div>
                    )}

                    {/* Step 2: Date Picker */}
                    {step === 2 && (
                        <div className="flex flex-col flex-1 animate-fadeIn pb-6">
                            <h2 className="text-xl font-black text-gray-900 mb-6 text-center">Choisissez une date</h2>
                            
                            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-6">
                                {/* Calendar Header */}
                                <div className="flex justify-between items-center mb-6">
                                    <button onClick={handlePrevMonth} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-600 font-bold active:scale-95">
                                        <ArrowLeftIcon />
                                    </button>
                                    <h3 className="font-black text-lg text-gray-900 w-32 text-center uppercase tracking-wide">
                                        {monthNames[currentMonth]} {currentYear}
                                    </h3>
                                    <button onClick={handleNextMonth} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-600 font-bold active:scale-95">
                                        <ArrowRightIcon />
                                    </button>
                                </div>
                                
                                {/* Calendar Days Header */}
                                <div className="grid grid-cols-7 gap-1 mb-2">
                                    {['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'].map(d => (
                                        <div key={d} className="text-center text-[10px] font-black text-gray-400">{d}</div>
                                    ))}
                                </div>
                                
                                {/* Calendar Grid */}
                                <div className="grid grid-cols-7 gap-1">
                                    {Array.from({ length: startDay }).map((_, i) => (
                                        <div key={`empty-${i}`} className="p-2"></div>
                                    ))}
                                    
                                    {Array.from({ length: daysInMonth }).map((_, i) => {
                                        const day = i + 1;
                                        const dateObj = new Date(currentYear, currentMonth, day);
                                        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                        
                                        const isPast = dateObj < today;
                                        const dayOfWeek = dateObj.getDay(); // 0 is Sunday
                                        const schedule = schedules.find(s => s.day_of_week === dayOfWeek);
                                        const isOpen = schedule ? schedule.is_open : true; // default true if unknown
                                        
                                        const isSelectable = !isPast && isOpen;
                                        const isSelected = selectedDate === dateStr;
                                        
                                        return (
                                            <div key={day} className="aspect-square relative flex items-center justify-center p-0.5">
                                                <button 
                                                    disabled={!isSelectable}
                                                    onClick={() => fetchAppointmentsForDate(dateStr)}
                                                    className={`w-full h-full rounded-full flex items-center justify-center text-sm font-bold transition-all
                                                        ${isSelected ? 'bg-[#C8372D] text-white shadow-md scale-110 z-10' : 
                                                          !isSelectable ? 'text-gray-300 cursor-not-allowed' : 
                                                          'text-gray-700 hover:bg-gray-100'}`}
                                                >
                                                    {day}
                                                </button>
                                                {!isOpen && !isPast && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[8px] font-bold text-gray-400">Fermé</span>}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            
                            {/* Legend */}
                            <div className="flex justify-center gap-4 text-[10px] font-bold text-gray-500 mb-6">
                                <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full border border-gray-300"></span> Disponible</div>
                                <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-gray-100 border border-gray-200"></span> Fermé/Passé</div>
                                <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#C8372D]"></span> Sélectionné</div>
                            </div>
                            
                            <button onClick={() => setStep(1)} className="mt-auto px-5 py-3 text-sm font-bold text-gray-500 hover:text-gray-900 w-full text-center">
                                ← Revenir aux services
                            </button>
                        </div>
                    )}

                    {/* Step 3: Time Slot */}
                    {step === 3 && (
                        <div className="flex flex-col flex-1 animate-fadeIn pb-6">
                            <h2 className="text-xl font-black text-gray-900 mb-1 text-center">Quelle heure ?</h2>
                            <p className="text-center text-sm font-bold text-[#C8372D] mb-6 capitalize">{new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                            
                            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-6 flex-1 overflow-y-auto max-h-[50vh]">
                                <div className="grid grid-cols-2 gap-3">
                                    {generateTimeSlots().map(time => {
                                        const takenSlotsArray = appointments.map(a => a.appointment_time);
                                        const isTaken = takenSlotsArray.includes(time);
                                        const isSelected = selectedTime === time;
                                        
                                        return (
                                            <button 
                                                key={time}
                                                disabled={isTaken}
                                                onClick={() => setSelectedTime(time)}
                                                className={`py-3.5 px-4 rounded-xl flex justify-between items-center transition-all border-2 font-bold
                                                    ${isTaken ? 'bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed opacity-70' : 
                                                      isSelected ? 'bg-[#22A96E]/10 border-[#22A96E] text-[#22A96E] shadow-sm' : 
                                                      'bg-white border-gray-200 text-gray-800 hover:border-[#22A96E]/50 hover:bg-gray-50'}`}
                                            >
                                                <span className="text-lg tracking-tight">{time}</span>
                                                {isTaken ? (
                                                    <span className="text-[10px] uppercase font-black tracking-widest bg-gray-200 text-gray-500 px-2 py-1 rounded-md">Réservé</span>
                                                ) : isSelected ? (
                                                    <span className="text-[10px] uppercase font-black tracking-widest bg-[#22A96E] text-white px-2 py-1 rounded-md">Choisi</span>
                                                ) : (
                                                    <span className="text-[10px] uppercase font-black tracking-widest text-[#22A96E] opacity-70">Libre ✓</span>
                                                )}
                                            </button>
                                        );
                                    })}
                                    {generateTimeSlots().length === 0 && (
                                        <div className="col-span-2 text-center text-gray-400 py-6 text-sm font-bold bg-gray-50 rounded-xl">
                                            Aucun créneau disponible pour cette journée.
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                           <div className="flex gap-3 mt-auto">
                                <button onClick={() => setStep(2)} className="w-16 flex items-center justify-center bg-white border border-gray-200 rounded-2xl shadow-sm text-gray-700 active:scale-95 transition-transform"><ArrowLeftIcon /></button>
                                <button 
                                    disabled={!selectedTime}
                                    onClick={() => setStep(4)}
                                    className="flex-1 bg-[#C8372D] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#C8372D]/30 disabled:opacity-50 transition-all active:scale-95"
                                >
                                    Valider l'horaire
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Confirm */}
                    {step === 4 && (
                        <div className="flex flex-col flex-1 animate-fadeIn pb-6">
                            <h2 className="text-xl font-black text-gray-900 mb-6 text-center">Dernière étape</h2>
                            
                            {/* Summary Card */}
                            <div className="bg-[#18120E] text-white rounded-[1.5rem] p-5 mb-6 relative overflow-hidden shadow-xl">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#22A96E]/20 rounded-full blur-[40px]"></div>
                                
                                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3 relative z-10">Résumé</h3>
                                
                                <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-4 relative z-10">
                                    <div className="text-3xl bg-white/10 p-2 rounded-xl">{selectedService?.icon}</div>
                                    <div>
                                        <p className="font-bold text-lg leading-tight">{selectedService?.name}</p>
                                        <p className="text-xs text-gray-400">{pro?.name}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 relative z-10">
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">Date</p>
                                        <p className="font-bold text-sm">{new Date(selectedDate).toLocaleDateString('fr-FR')}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">Heure</p>
                                        <p className="font-bold text-[#22A96E] text-lg leading-none">{selectedTime}</p>
                                    </div>
                                    <div className="col-span-2 flex justify-between items-end pt-2">
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-gray-500 mb-0.5">Durée estimée</p>
                                            <p className="font-medium text-sm">{selectedService?.duration_minutes} minutes</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] uppercase font-bold text-gray-500 mb-0.5">Prix total</p>
                                            <p className="font-black text-2xl text-white">{selectedService?.price} <span className="text-sm">DT</span></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Contact Form */}
                            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4 mb-6">
                                <div>
                                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Votre Prénom</label>
                                    <input 
                                        type="text" 
                                        placeholder="Ex: Ahmed"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-[#C8372D] font-bold"
                                        value={clientName}
                                        onChange={(e) => setClientName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Numéro de téléphone</label>
                                    <div className="flex border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#C8372D] focus-within:ring-2 focus-within:ring-[#C8372D]/10 transition-all bg-gray-50">
                                        <span className="bg-gray-100 px-4 py-3.5 text-gray-500 font-bold border-r border-gray-200">+216</span>
                                        <input 
                                            type="tel" 
                                            placeholder="2X XXX XXX"
                                            className="w-full bg-transparent px-4 py-3.5 outline-none font-bold placeholder:text-gray-300"
                                            value={clientPhone}
                                            onChange={(e) => setClientPhone(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button 
                                disabled={!clientName || !clientPhone || saving}
                                onClick={handleConfirmBooking}
                                className="w-full mt-auto bg-[#22A96E] hover:bg-[#1d915d] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#22A96E]/30 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                {saving ? "Réservation..." : "✓ Confirmer ma réservation"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
