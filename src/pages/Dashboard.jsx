import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, useLocation } from 'react-router-dom';

// Simple Icons
const BellIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);
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
const CallIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
);
const EyeIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);
const CheckIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);
const XIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);
const TrashIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

export default function Dashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    
    const [pro, setPro] = useState(null);
    const [services, setServices] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [selectedTab, setSelectedTab] = useState('Aujourd\'hui');
    
    const [loading, setLoading] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [animatingId, setAnimatingId] = useState(null);
    const notifiedRef = useRef(new Set());
    const [showTermines, setShowTermines] = useState(false);
    
    // New RDV Modal states
    const [showNewRdvModal, setShowNewRdvModal] = useState(false);
    const [rdvStep, setRdvStep] = useState(1);
    const [clients, setClients] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClient, setSelectedClient] = useState(null);
    const [isNewClient, setIsNewClient] = useState(false);
    const [newClientName, setNewClientName] = useState('');
    const [clientPhone, setClientPhone] = useState('');
    const [selectedService, setSelectedService] = useState(null);
    const [rdvDate, setRdvDate] = useState(new Date().toISOString().split('T')[0]);
    const [rdvTime, setRdvTime] = useState('');
    const [rdvNotes, setRdvNotes] = useState('');
    const [savingRdv, setSavingRdv] = useState(false);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [schedules, setSchedules] = useState([]); // Bug 1 Fix: Schedules state
    const [takenSlots, setTakenSlots] = useState([]); // fix: takenSlots state
    const [slotMessage, setSlotMessage] = useState('');

    // Derived states moved BEFORE useEffects to prevent ReferenceErrors
    const today = new Date();
    const dayName = today.toLocaleDateString('fr-FR', { weekday: 'long' });
    const fullDate = today.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    
    const trialEndsAt = pro?.trial_ends_at ? new Date(pro.trial_ends_at) : new Date();
    const daysRemaining = pro?.trial_ends_at ? Math.ceil((trialEndsAt - today) / (1000 * 60 * 60 * 24)) : 0;

    const nowMinutes = today.getHours() * 60 + today.getMinutes();
    const targetDateObj = new Date();
    if (selectedTab === 'Demain') {
        targetDateObj.setDate(targetDateObj.getDate() + 1);
    }
    const targetFormatted = `${targetDateObj.getFullYear()}-${String(targetDateObj.getMonth() + 1).padStart(2, '0')}-${String(targetDateObj.getDate()).padStart(2, '0')}`;
    
    // Use targetFormatted for filtering current view
    const visibleAppointments = React.useMemo(() => appointments.filter(a => a.appointment_date === targetFormatted), [appointments, targetFormatted]);

    // Find next appointment from currently fetched appointments
    const upcomingAppts = appointments.filter(a => {
        if (a.status === 'cancelled' || a.status === 'absent') return false;
        
        const apptDateObj = new Date(a.appointment_date);
        const todayDateObj = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        
        if (apptDateObj.getTime() === todayDateObj.getTime()) {
            const [h, m] = a.appointment_time.split(':').map(Number);
            return (h * 60 + m) >= nowMinutes;
        }
        return apptDateObj > todayDateObj;
    });
    const nextAppointment = upcomingAppts.length > 0 ? upcomingAppts[0] : null;

    let nextApptText = "";
    if (nextAppointment) {
        const h_m = nextAppointment.appointment_time.replace(':', 'h');
        const aDate = new Date(nextAppointment.appointment_date);
        const tDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        
        if (aDate.getTime() === tDate.getTime()) {
            const [h, m] = nextAppointment.appointment_time.split(':').map(Number);
            const diff = (h * 60 + m) - nowMinutes;
            if (diff <= 60 && diff >= 0) {
                nextApptText = `Dans ${diff} min`;
            } else {
                nextApptText = `À ${h_m}`;
            }
        } else {
            const tomorrowDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
            if (aDate.getTime() === tomorrowDate.getTime()) {
                nextApptText = `Demain à ${h_m}`;
            } else {
                nextApptText = `${aDate.toLocaleDateString('fr-FR', { weekday: 'short' })} à ${h_m}`;
            }
        }
    }

    const totalRevenue = visibleAppointments
        .filter(a => a.status === 'confirmed')
        .reduce((sum, a) => sum + Number(a.services?.price || 0), 0);

    // Effect hooks
    useEffect(() => {
        if ('Notification' in window && Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [selectedTab]);

    // Realtime subscription for new appointments (Bug 3 Fix)
    useEffect(() => {
        if (!pro?.id) return;

        const channel = supabase
            .channel(`appointments:${pro.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'appointments',
                    filter: `pro_id=eq.${pro.id}`
                },
                (payload) => {
                    // Refresh all dashboard data (Fix for Bug 3)
                    fetchDashboardData();

                    // Force notification
                    if ('Notification' in window) {
                        Notification.requestPermission().then(permission => {
                            if (permission === 'granted') {
                                new Notification('🔔 Nouveau RDV via KLIK !', {
                                    body: `${payload.new.client_name} — ${payload.new.appointment_date} à ${payload.new.appointment_time}`,
                                    icon: '/klik-icon.png',
                                    badge: '/klik-icon.png'
                                });
                            }
                        });
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [pro?.id]); // Removed services dependency as we refresh whole dashboard

    useEffect(() => {
        if (visibleAppointments.length === 0) return;
        
        const checkNotifications = () => {
            if (!('Notification' in window) || Notification.permission !== 'granted') return;
            
            const now = new Date();
            const nowMinutes = now.getHours() * 60 + now.getMinutes();

            visibleAppointments.forEach(appt => {
                if (appt.status !== 'confirmed') return;

                const [h, m] = appt.appointment_time.split(':').map(Number);
                const apptMinutes = h * 60 + m;
                const diff = apptMinutes - nowMinutes;

                const id60 = `${appt.id}-60`;
                const id30 = `${appt.id}-30`;
                const serviceName = appt.services?.name || 'Service';

                if (diff >= 58 && diff <= 62 && !notifiedRef.current.has(id60)) {
                    new Notification("⏰ RDV dans 1h", { body: `${appt.client_name} — ${serviceName}` });
                    notifiedRef.current.add(id60);
                } else if (diff >= 28 && diff <= 32 && !notifiedRef.current.has(id30)) {
                    new Notification("🔔 RDV dans 30min", { body: `${appt.client_name} — ${serviceName} — Partez maintenant !` });
                    notifiedRef.current.add(id30);
                }
            });
        };

        const interval = setInterval(checkNotifications, 60000);
        checkNotifications();
        
        return () => clearInterval(interval);
    }, [visibleAppointments]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            
            if (!user) {
                navigate('/');
                return;
            }

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

            // Bug 1 Fix: Ensure services fetch uses correct pro_id from auth user
            const cachedServices = sessionStorage.getItem('klik_services');
            if (cachedServices) {
                setServices(JSON.parse(cachedServices));
            } else {
                const { data: servicesData } = await supabase
                    .from('services')
                    .select('*')
                    .eq('pro_id', user.id); // Using user.id directly
                const sData = servicesData || [];
                setServices(sData);
                sessionStorage.setItem('klik_services', JSON.stringify(sData));
            }

            // Fix 2 — Show tomorrow's appointments
            const targetDateObj = new Date();
            if (selectedTab === 'Demain') {
                targetDateObj.setDate(targetDateObj.getDate() + 1);
            }
            const targetFormattedStr = targetDateObj.toLocaleDateString('en-CA'); // YYYY-MM-DD
            
            const { data: apptsData } = await supabase
                .from('appointments')
                .select('*, services(name, price, duration_minutes)')
                .eq('pro_id', proDataToUse.id)
                .eq('appointment_date', targetFormattedStr)
                .order('appointment_time', { ascending: true });
            
            setAppointments(apptsData || []);

            // Fetch Clients
            const { data: clientsData } = await supabase.from('clients').select('*').eq('pro_id', proDataToUse.id);
            setClients(clientsData || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
        await supabase.from('appointments').update({ status }).eq('id', id);
    };

    const handleCancelAppt = async (id) => {
        setAnimatingId(id);
        setTimeout(async () => {
            setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'absent' } : a));
            await supabase.from('appointments').update({ status: 'absent' }).eq('id', id);
            setAnimatingId(null);
        }, 300);
    };

    const handleDeleteAppt = async (id) => {
        setAppointments(prev => prev.filter(a => a.id !== id));
        await supabase.from('appointments').delete().eq('id', id);
    };

    // New RDV Handlers
    const filteredClients = clients.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery));

    const handleSelectClient = (client) => {
        setSelectedClient(client);
        setIsNewClient(false);
        setClientPhone(client.phone);
        setSearchQuery("");
    };

    const handleSelectNewClient = () => {
        setIsNewClient(true);
        setSelectedClient(null);
        setNewClientName(searchQuery);
        setSearchQuery("");
    };

    useEffect(() => {
        if (showNewRdvModal && pro?.id) {
            fetchSchedules(pro.id);
        }
    }, [showNewRdvModal, pro?.id]);

    const fetchSchedules = async (proId) => {
        const { data } = await supabase
            .from('schedules')
            .select('*')
            .eq('pro_id', proId);
        setSchedules(data || []);
    };

    useEffect(() => {
        if (showNewRdvModal && rdvStep === 3 && rdvDate && pro) {
            fetchSlots(rdvDate);
        }
    }, [rdvDate, rdvStep, showNewRdvModal, pro, schedules]);

    const generateSlots = (schedules, dateStr) => {
        const dateObj = new Date(dateStr);
        const dayOfWeek = dateObj.getDay();

        let schedule = schedules.find(s => s.day_of_week === dayOfWeek);
        
        // Fallback if no schedule found in DB
        let startStr = '09:00';
        let endStr = '18:00';
        let isOpen = true;

        if (schedule) {
            startStr = schedule.start_time || '09:00';
            endStr = schedule.end_time || '18:00';
            isOpen = schedule.is_open;
        } else if (dayOfWeek === 0) {
            isOpen = false;
        }

        if (!isOpen) return [];

        const [startH, startM] = startStr.split(':').map(Number);
        const [endH, endM] = endStr.split(':').map(Number);
        const startTotal = startH * 60 + startM;
        const endTotal = endH * 60 + endM;
        
        const todayStr = new Date().toLocaleDateString('en-CA');
        const isToday = dateStr === todayStr;
        const now = new Date();
        const currentMins = now.getHours() * 60 + now.getMinutes();

        const slots = [];
        for (let mins = startTotal; mins < endTotal; mins += 30) {
            if (isToday && mins <= currentMins + 30) continue;
            
            let isBreak = false;
            if (schedule?.break_start && schedule?.break_end) {
                const [bSh, bSm] = schedule.break_start.split(':').map(Number);
                const [bEh, bEm] = schedule.break_end.split(':').map(Number);
                const bStartTotal = bSh * 60 + bSm;
                const bEndTotal = bEh * 60 + bEm;
                if (mins >= bStartTotal && mins < bEndTotal) isBreak = true;
            }

            if (!isBreak) {
                const h = Math.floor(mins / 60).toString().padStart(2, '0');
                const m = (mins % 60).toString().padStart(2, '0');
                slots.push({ time: `${h}:${m}`, mins });
            }
        }
        return slots;
    };

    const handleDateSelect = async (date) => {
        // Generate slots for selected date
        const slots = generateSlots(schedules, date);
        
        // If no slots available (all passed) and date is today
        const todayStr = new Date().toLocaleDateString('en-CA');
        if (slots.length === 0 && date === todayStr) {
            // Auto switch to tomorrow
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowStr = tomorrow.toLocaleDateString('en-CA');
            setRdvDate(tomorrowStr);
            // Show message
            setSlotMessage("Plus de créneaux aujourd'hui — affichage de demain 👇");
        } else {
            setRdvDate(date);
            if (slots.length === 0) {
                setSlotMessage("Aucun créneau disponible pour cette date.");
            } else {
                setSlotMessage('');
            }
        }
    };

    const fetchSlots = async (dateStr) => {
        setLoadingSlots(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const { data: apptsData } = await supabase
                .from('appointments')
                .select('appointment_time')
                .eq('pro_id', user.id)
                .eq('appointment_date', dateStr)
                .neq('status', 'cancelled');

            const takenTimes = new Set((apptsData || []).map(a => a.appointment_time));
            setTakenSlots(Array.from(takenTimes));

            const generatedSlots = generateSlots(schedules, dateStr);
            const slotsWithStatus = generatedSlots.map(s => ({
                ...s,
                isTaken: takenTimes.has(s.time)
            }));
            
            setAvailableSlots(slotsWithStatus);
            if (slotsWithStatus.length > 0 && !slotsWithStatus.find(s => s.time === rdvTime && !s.isTaken)) {
                setRdvTime('');
            }
        } catch (e) {
            console.error(e);
            setAvailableSlots([]);
        } finally {
            setLoadingSlots(false);
        }
    };

    const handleConfirmRdv = async () => {
        setSavingRdv(true);
        try {
            const { data: existing } = await supabase
              .from('appointments')
              .select('id')
              .eq('pro_id', pro.id)
              .eq('appointment_date', rdvDate)
              .eq('appointment_time', rdvTime)
              .neq('status', 'cancelled');

            if (existing && existing.length > 0) {
              alert('Ce créneau vient d\'être pris ! Choisissez une autre heure.');
              setSavingRdv(false);
              return;
            }

            let finalClientId = selectedClient?.id;
            let finalClientName = isNewClient ? newClientName : selectedClient?.name;

            if (isNewClient) {
                const { data: newClientData, error: clientErr } = await supabase.from('clients').insert([{
                    pro_id: pro.id,
                    name: newClientName,
                    phone: clientPhone,
                    visit_count: 0
                }]).select();
                
                if (clientErr) throw clientErr;
                finalClientId = newClientData[0].id;
            }

            const { error: apptErr } = await supabase.from('appointments').insert([{
                pro_id: pro.id,
                client_id: finalClientId,
                service_id: selectedService.id,
                client_name: finalClientName,
                client_phone: clientPhone,
                appointment_date: rdvDate,
                appointment_time: rdvTime,
                status: 'confirmed'
            }]);

            if (apptErr) throw apptErr;

            // Fix 3 — Auto navigate after creating appointment
            setShowNewRdvModal(false);
            setRdvStep(1);
            setSelectedClient(null);
            setSelectedService(null);
            setIsNewClient(false);
            setNewClientName('');
            setClientPhone('');
            setSearchQuery('');
            setRdvNotes('');
            
            const tomorrowStr = new Date(Date.now() + 86400000).toLocaleDateString('en-CA');
            const todayStr = new Date().toLocaleDateString('en-CA');
            
            if (rdvDate === tomorrowStr) {
                setSelectedTab('Demain');
            } else if (rdvDate === todayStr) {
                if (selectedTab === 'Aujourd\'hui') {
                    await fetchDashboardData();
                } else {
                    setSelectedTab('Aujourd\'hui');
                }
            } else {
                // For other dates, just fetch if we're on the right view, but shouldn't happen with simple selector
                await fetchDashboardData();
            }
            alert("RDV créé !");
        } catch (e) {
            console.error(e);
            alert("Erreur lors de la création.");
        } finally {
            setSavingRdv(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-[#F4F1EC] flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#C8372D]"></div>
        </div>;
    }

    return (
        <div className="min-h-screen bg-[#F4F1EC] flex justify-center font-sans pb-28">
            <div className="w-full max-w-[390px] relative px-4 flex flex-col gap-5 page-transition">
                
                {/* Header */}
                <header className="flex justify-between items-center pt-6 pb-2">
                    <div>
                        <h1 className="text-xl font-black text-gray-900 leading-tight">
                            {pro?.name || 'Mon Salon'}
                        </h1>
                        <p className="text-sm text-gray-500 font-medium">Bienvenue 👋</p>
                    </div>
                    <button 
                        onClick={() => setIsDrawerOpen(true)}
                        className="relative p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
                    >
                        <BellIcon />
                        {/* Notification Badge Example */}
                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                </header>

                {/* Block 1: Date + RDV count */}
                <div className="bg-[#C8372D] text-white rounded-[1.5rem] p-5 flex justify-between items-center shadow-lg shadow-[#C8372D]/30 relative overflow-hidden">
                    <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-[20px]"></div>
                    <div className="z-10">
                        <p className="text-sm font-semibold capitalize opacity-90">{dayName}</p>
                        <p className="text-lg font-black">{fullDate}</p>
                    </div>
                    <div className="z-10 text-right">
                        <p className="text-4xl font-black leading-none">{visibleAppointments.length}</p>
                        <p className="text-xs font-semibold opacity-90 mt-1">RDV {selectedTab}</p>
                    </div>
                </div>

                {/* Date Tabs */}
                <div className="flex bg-white rounded-[1rem] p-1 shadow-sm border border-gray-100 mt-2">
                    <button 
                        onClick={() => setSelectedTab('Aujourd\'hui')}
                        className={`flex-1 py-2 text-sm font-bold rounded-[0.8rem] transition-all ${selectedTab === 'Aujourd\'hui' ? 'bg-[#C8372D] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        Aujourd'hui
                    </button>
                    <button 
                        onClick={() => setSelectedTab('Demain')}
                        className={`flex-1 py-2 text-sm font-bold rounded-[0.8rem] transition-all ${selectedTab === 'Demain' ? 'bg-[#C8372D] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        Demain
                    </button>
                </div>

                {/* Block 2: Trial period */}
                <div className="bg-white rounded-2xl p-4 border-2 border-orange-200 flex justify-between items-center shadow-sm">
                    <div>
                        <p className="text-orange-500 text-xs font-black uppercase tracking-wider mb-0.5">Période d'essai gratuit</p>
                        <p className="text-gray-900 font-bold text-lg mb-1">{daysRemaining} jours restants</p>
                        <p className="text-gray-500 text-xs font-medium">Après: 10 DT/mois</p>
                    </div>
                    <button className="bg-orange-100 text-orange-600 px-4 py-2.5 rounded-xl text-sm font-bold active:scale-95 transition-transform">
                        S'abonner
                    </button>
                </div>

                {/* Block 3: Next appointment */}
                <div className="bg-[#18120E] text-white rounded-[1.5rem] p-5 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#C8372D]/20 rounded-full blur-[40px] pointer-events-none"></div>
                    
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <span className="bg-white/10 text-xs px-2.5 py-1 rounded-lg font-medium text-gray-300">
                            Prochain rendez-vous
                        </span>
                        {nextAppointment && (
                            <span className="text-sm font-bold flex items-center gap-1 text-[#C8372D]">
                                <span className="w-2 h-2 rounded-full bg-[#C8372D] animate-pulse"></span>
                                {nextApptText}
                            </span>
                        )}
                    </div>

                    {nextAppointment ? (
                        <>
                            <div className="relative z-10 mb-5">
                                <h3 className="text-2xl font-black mb-1">{nextAppointment.client_name}</h3>
                                <p className="text-gray-400 font-medium text-sm flex items-center gap-2">
                                    <span>{nextAppointment.services?.name || 'Service manuel'}</span>
                                    <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                    <span>{nextAppointment.services?.price || '0'} DT</span>
                                </p>
                            </div>

                            <div className="flex items-center gap-3 relative z-10">
                                <div className="bg-white/10 px-3 py-2 rounded-xl">
                                    <p className="text-xs text-gray-400 font-medium font-mono">{nextAppointment.appointment_time}</p>
                                </div>
                                <div className="bg-white/10 px-3 py-2 rounded-xl">
                                    <p className="text-xs text-gray-400 font-medium">{nextAppointment.services?.duration_minutes || 0} min</p>
                                </div>
                                
                                <div className="flex-1 flex justify-end gap-2">
                                    <button 
                                        onClick={() => window.location.href = `tel:${nextAppointment.client_phone}`}
                                        className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                                    >
                                        <CallIcon />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="relative z-10 py-4 text-center">
                            <h3 className="text-xl font-bold text-gray-400">Aucun RDV à venir</h3>
                        </div>
                    )}
                </div>

                {/* Block 4: Today's appointments list */}
                <div className="bg-white rounded-[1.5rem] p-4 shadow-sm border border-gray-100 flex-1">
                    <div className="flex justify-between items-center mb-4 px-1">
                        <h2 className="text-lg font-black text-gray-900">
                            {selectedTab === 'Demain' ? 'Liste de demain' : 'Liste du jour'}
                        </h2>
                        <span className="bg-green-50 text-green-700 font-bold px-3 py-1 rounded-lg text-sm border border-green-100 shadow-sm">
                            {totalRevenue} DT
                        </span>
                    </div>

                    <div className="flex flex-col gap-3">
                        {visibleAppointments.length === 0 ? (
                            <div className="text-center py-8 text-gray-400 font-medium text-sm">
                                Aucun rendez-vous {selectedTab === 'Demain' ? 'demain' : 'aujourd\'hui'}
                            </div>
                        ) : (
                            (() => {
                                const activeAppointments = [];
                                const pastAppointments = [];
                                
                                const todayStr = new Date().toLocaleDateString('en-CA');
                                const now = new Date();
                                const currentMins = now.getHours() * 60 + now.getMinutes();

                                visibleAppointments.forEach(appt => {
                                    const isToday = appt.appointment_date === todayStr;
                                    const [h, m] = appt.appointment_time.split(':').map(Number);
                                    const apptMinutes = h * 60 + m;
                                    
                                    // Fix: Only today's appointments can be "Terminé" visually if they passed > 30 min ago
                                    const isTerminated = isToday && (currentMins - apptMinutes > 30);
                                    
                                    if (isTerminated) {
                                        pastAppointments.push(appt);
                                    } else {
                                        activeAppointments.push(appt);
                                    }
                                });

                                const renderAppt = (appt, isPast = false) => {
                                    // Status styling config
                                    let sColor = "bg-gray-200";
                                    let sText = "bg-gray-100 text-gray-600";
                                    let sLabel = "Nouveau";
                                    let nameStyle = "font-bold text-gray-900 text-sm";
                                    let cardStyle = "relative flex bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm shadow-gray-200/50 group transition-all duration-300";
                                    
                                    if (isPast) {
                                        sColor = "bg-gray-300";
                                        sText = "bg-gray-100 text-gray-500 border border-gray-200";
                                        sLabel = "✓ Terminé";
                                        nameStyle = "font-bold text-gray-900 text-sm";
                                        cardStyle = "relative flex bg-gray-50 border border-gray-200 rounded-xl overflow-hidden group transition-all duration-300 opacity-60";
                                    } else if (appt.status === 'confirmed') {
                                        sColor = "bg-green-500";
                                        sText = "bg-green-100 text-green-700";
                                        sLabel = "Confirmé";
                                    } else if (appt.status === 'pending') {
                                        sColor = "bg-yellow-400";
                                        sText = "bg-yellow-100 text-yellow-700";
                                        sLabel = "En attente";
                                    } else if (appt.status === 'cancelled') {
                                        sColor = "bg-red-500";
                                        sText = "bg-red-50 text-red-600";
                                        sLabel = "Annulé";
                                    } else if (appt.status === 'absent') {
                                        sColor = "bg-gray-300";
                                        sText = "bg-gray-100 text-gray-500 border border-gray-200";
                                        sLabel = "Absent";
                                        nameStyle = "font-bold text-gray-400 text-sm line-through";
                                        cardStyle = "relative flex bg-gray-50 border border-gray-200 rounded-xl overflow-hidden group transition-all duration-300 opacity-80";
                                    }

                                    return (
                                        <div key={appt.id} className={`${cardStyle} ${animatingId === appt.id ? 'opacity-0 scale-95 !h-0 !p-0 !border-0 mb-0 pointer-events-none' : ''}`}>
                                            <div className={`w-1.5 ${sColor}`}></div>
                                            <div className="flex-1 p-3 flex flex-col gap-2">
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-14 text-center border-r border-gray-100 pr-2">
                                                            <p className="font-bold text-gray-900 leading-none">{appt.appointment_time}</p>
                                                            <p className="text-[10px] text-gray-400 font-medium mt-1">{appt.services?.duration_minutes || 0} min</p>
                                                        </div>
                                                        <div>
                                                            <p className={nameStyle}>{appt.client_name}</p>
                                                            <p className="text-xs text-gray-500 font-medium truncate max-w-[120px]">
                                                                {appt.services?.name || 'RDV Manuel'} • {appt.services?.price || '0'} DT
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className={`text-[10px] uppercase font-black px-2 py-1 rounded-md ${sText}`}>
                                                        {sLabel}
                                                    </span>
                                                </div>
                                                
                                                <div className="flex items-center justify-end gap-2">
                                                    {isPast ? (
                                                        <button 
                                                            onClick={() => handleDeleteAppt(appt.id)}
                                                            className="w-7 h-7 rounded-sm bg-gray-200 text-gray-500 flex items-center justify-center hover:bg-gray-300 transition-colors"
                                                        >
                                                            <TrashIcon />
                                                        </button>
                                                    ) : appt.status === 'pending' ? (
                                                        <div className="flex gap-2">
                                                            <button 
                                                                onClick={() => updateStatus(appt.id, 'cancelled')}
                                                                className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 font-bold border border-red-100 active:scale-95 transition-all"
                                                            >
                                                                ✕ Refuser
                                                            </button>
                                                            <button 
                                                                onClick={() => updateStatus(appt.id, 'confirmed')}
                                                                className="text-xs px-3 py-1.5 rounded-lg bg-green-50 text-green-600 font-bold border border-green-100 active:scale-95 transition-all"
                                                            >
                                                                ✓ Confirmer
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex gap-2 items-center">
                                                            {appt.status === 'confirmed' && (
                                                                <button 
                                                                    onClick={() => handleCancelAppt(appt.id)}
                                                                    className="text-[10px] uppercase font-black px-2 py-1 rounded-md bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition-colors active:scale-95"
                                                                >
                                                                    Annuler
                                                                </button>
                                                            )}
                                                            {(appt.status === 'cancelled' || appt.status === 'absent') && (
                                                                <button 
                                                                    onClick={() => handleDeleteAppt(appt.id)}
                                                                    className="w-7 h-7 rounded-sm bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors"
                                                                >
                                                                    <TrashIcon />
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                };

                                return (
                                    <>
                                        {activeAppointments.map(appt => renderAppt(appt, false))}
                                        {pastAppointments.length > 0 && (
                                            <div className="mt-4 pt-4 border-t border-gray-100">
                                                <button 
                                                    onClick={() => setShowTermines(!showTermines)}
                                                    className="w-full flex justify-between items-center py-2 px-1 text-gray-500 hover:text-gray-800 transition-colors"
                                                >
                                                    <span className="font-bold text-sm">Terminés ({pastAppointments.length})</span>
                                                    <span className={`text-xs transform transition-transform ${showTermines ? 'rotate-180' : ''}`}>▼</span>
                                                </button>
                                                
                                                {showTermines && (
                                                    <div className="flex flex-col gap-3 mt-3 animate-fadeIn">
                                                        {pastAppointments.map(appt => renderAppt(appt, true))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {activeAppointments.length === 0 && pastAppointments.length > 0 && !showTermines && (
                                            <div className="text-center py-4 text-gray-400 font-medium text-sm">
                                                Plus de rendez-vous actifs aujourd'hui.
                                            </div>
                                        )}
                                    </>
                                );
                            })()
                        )}
                    </div>
                </div>

                {/* Extra space for FAB and Nav */}
                <div className="h-10"></div>
                
                {/* Block 5: FAB button */}
                <button 
                    onClick={() => setShowNewRdvModal(true)}
                    className="fixed bottom-24 right-4 z-40 bg-[#C8372D] text-white px-5 py-3.5 rounded-full font-bold shadow-xl shadow-[#C8372D]/30 flex items-center gap-2 active:scale-95 transition-transform border border-white/20"
                >
                    <span className="text-lg leading-none mt-[-2px]">+</span> Nouveau RDV
                </button>

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

                {/* Notifications Drawer */}
                {isDrawerOpen && (
                    <div className="fixed inset-0 z-[100] max-w-[390px] mx-auto">
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)}></div>
                        <div className="absolute top-0 left-0 right-0 bg-white rounded-b-3xl p-6 shadow-2xl transform transition-transform animate-slideDown">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-black text-xl">Notifications</h3>
                                <button onClick={() => setIsDrawerOpen(false)} className="p-2 bg-gray-100 rounded-full">
                                    <XIcon />
                                </button>
                            </div>
                            <div className="text-center py-6 text-gray-500 text-sm font-medium">
                                Aucune nouvelle notification
                            </div>
                        </div>
                    </div>
                )}

                {/* New RDV Bottom Sheet */}
                {showNewRdvModal && (
                    <div className="fixed inset-0 z-[100] max-w-[390px] mx-auto flex flex-col justify-end">
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowNewRdvModal(false)}></div>
                        
                        <div className="bg-[#F4F1EC] rounded-t-[2rem] h-[90vh] flex flex-col shadow-2xl relative z-10 animate-slideUp overflow-hidden">
                            {/* Drag handle */}
                            <div className="w-full flex justify-center pt-4 pb-2 bg-white rounded-t-[2rem]">
                                <div className="w-12 h-1.5 bg-gray-200 rounded-full"></div>
                            </div>
                            
                            <div className="px-6 py-4 bg-white border-b border-gray-100 flex items-center justify-between">
                                <h3 className="font-black text-xl text-gray-900">
                                    {rdvStep === 1 && "Client"}
                                    {rdvStep === 2 && "Service"}
                                    {rdvStep === 3 && "Date & Heure"}
                                    {rdvStep === 4 && "Confirmation"}
                                </h3>
                                <button onClick={() => setShowNewRdvModal(false)} className="p-2 bg-gray-100 rounded-full">
                                    <XIcon />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6">
                                {/* STEP 1: Client */}
                                {rdvStep === 1 && (
                                    <div className="flex flex-col gap-4 animate-fadeIn h-full">
                                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                                            {selectedClient || isNewClient ? (
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <span className="bg-green-100 text-green-700 text-[10px] font-black uppercase px-2 py-1 rounded-md mb-2 inline-block">✓ Sélectionné</span>
                                                        <p className="font-bold text-lg">{isNewClient ? newClientName : selectedClient.name}</p>
                                                        <p className="text-xs font-medium text-gray-500">{isNewClient ? 'Nouveau client' : 'Client existant'}</p>
                                                    </div>
                                                    <button onClick={() => { setSelectedClient(null); setIsNewClient(false); }} className="text-xs font-bold text-[#C8372D] bg-[#C8372D]/10 px-3 py-1.5 rounded-lg active:scale-95">Modifier</button>
                                                </div>
                                            ) : (
                                                <>
                                                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Rechercher</label>
                                                    <input 
                                                        type="text" 
                                                        placeholder="Nom ou numéro..."
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-[#C8372D] focus:ring-4 focus:ring-[#C8372D]/10 font-bold mb-4"
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                    />
                                                    
                                                    {searchQuery.length > 0 && (
                                                        <div className="flex flex-col gap-2">
                                                            {filteredClients.map(c => (
                                                                <div key={c.id} onClick={() => handleSelectClient(c)} className="flex justify-between items-center p-3 border border-gray-100 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                                                                    <div>
                                                                        <p className="font-bold text-sm text-gray-900">{c.name}</p>
                                                                        <p className="text-xs text-gray-400 font-medium font-mono">{c.phone}</p>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded-md font-bold">{c.visit_count} visites</span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            
                                                            <div onClick={handleSelectNewClient} className="flex items-center gap-3 p-3 border border-[#C8372D]/20 bg-[#C8372D]/5 rounded-xl cursor-pointer mt-2 group transition-colors hover:bg-[#C8372D]/10">
                                                                <div className="w-8 h-8 rounded-full bg-[#C8372D] text-white flex items-center justify-center font-bold group-hover:scale-110 transition-transform">+</div>
                                                                <div>
                                                                    <p className="font-bold text-sm text-[#C8372D]">Nouveau client</p>
                                                                    <p className="text-xs text-[#C8372D]/80 font-medium truncate max-w-[200px]">"{searchQuery}"</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                        
                                        <button 
                                            disabled={!selectedClient && !isNewClient}
                                            onClick={() => setRdvStep(2)}
                                            className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl shadow-md active:scale-95 transition-all disabled:opacity-50 mt-auto"
                                        >
                                            Continuer
                                        </button>
                                    </div>
                                )}

                                {/* STEP 2: Service */}
                                {rdvStep === 2 && (
                                    <div className="flex flex-col gap-4 animate-fadeIn h-full">
                                        <div className="grid grid-cols-2 gap-3 overflow-y-auto">
                                            {services.map(s => (
                                                <div 
                                                    key={s.id}
                                                    onClick={() => setSelectedService(s)}
                                                    className={`bg-white p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedService?.id === s.id ? 'border-[#C8372D] shadow-md shadow-[#C8372D]/10 scale-[1.02]' : 'border-transparent shadow-sm hover:border-gray-200'}`}
                                                >
                                                    <p className="font-bold text-sm text-gray-900 mb-1 leading-tight">{s.name}</p>
                                                    <p className="text-[10px] text-gray-500 font-bold bg-gray-50 rounded-md inline-block px-1.5 py-0.5">{s.duration_minutes} min • {s.price} DT</p>
                                                </div>
                                            ))}
                                            {services.length === 0 && (
                                                <div className="col-span-2 text-center text-gray-400 py-8 text-sm bg-white rounded-2xl border border-dashed border-gray-200">
                                                    Aucun service défini. Allez dans les paramètres.
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-auto flex gap-3 pt-4">
                                            <button onClick={() => setRdvStep(1)} className="px-5 py-4 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 active:scale-95 transition-transform">Retour</button>
                                            <button 
                                                disabled={!selectedService}
                                                onClick={() => setRdvStep(3)}
                                                className="flex-1 bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl shadow-md disabled:opacity-50 active:scale-95 transition-all"
                                            >
                                                Continuer
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* STEP 3: Date & Time */}
                                {rdvStep === 3 && (
                                    <div className="flex flex-col gap-4 animate-fadeIn h-full">
                                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-5">
                                            <div>
                                                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Numéro de Contact</label>
                                                <input 
                                                    type="tel" 
                                                    placeholder="2X XXX XXX"
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#C8372D] focus:ring-4 focus:ring-[#C8372D]/10 font-bold transition-all"
                                                    value={clientPhone}
                                                    onChange={(e) => setClientPhone(e.target.value)}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-4">
                                                <div>
                                                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Date</label>
                                                    <input 
                                                        type="date" 
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#C8372D] focus:ring-4 focus:ring-[#C8372D]/10 font-bold transition-all"
                                                        value={rdvDate}
                                                        onChange={(e) => handleDateSelect(e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Créneaux horaires</label>
                                                    
                                                    {slotMessage && (
                                                      <div className="text-center text-sm text-amber-600 bg-amber-50 rounded-xl p-3 mb-3 animate-fadeIn">
                                                        ⚠️ {slotMessage}
                                                      </div>
                                                    )}

                                                    {loadingSlots ? (
                                                        <div className="flex justify-center py-6">
                                                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#C8372D]"></div>
                                                        </div>
                                                    ) : availableSlots.length === 0 ? (
                                                        <div className="text-center py-4 bg-gray-50 rounded-xl text-gray-500 font-medium text-sm">
                                                            Aucun créneau disponible ce jour.
                                                        </div>
                                                    ) : (
                                                        <div className="grid grid-cols-3 gap-2 max-h-[180px] overflow-y-auto pr-1 select-none pb-2">
                                                            {availableSlots.map((slot, idx) => (
                                                                <button
                                                                    key={idx}
                                                                    type="button"
                                                                    disabled={slot.isTaken}
                                                                    onClick={() => setRdvTime(slot.time)}
                                                                    className={`py-2 px-1 rounded-lg text-sm font-bold flex flex-col items-center justify-center transition-all ${
                                                                        slot.isTaken 
                                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-60 border border-gray-200' 
                                                                        : rdvTime === slot.time
                                                                            ? 'bg-[#C8372D] text-white shadow-md scale-[1.02] border border-[#C8372D]'
                                                                            : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 active:scale-95'
                                                                    }`}
                                                                >
                                                                    <span>{slot.time}</span>
                                                                    <span className="text-[9px] uppercase tracking-wide mt-0.5 opacity-90">{slot.isTaken ? 'Réservé' : 'Libre'}</span>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Notes (Optionnel)</label>
                                                <textarea 
                                                    rows="2"
                                                    placeholder="Détails du rdv..."
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#C8372D] focus:ring-4 focus:ring-[#C8372D]/10 font-medium text-sm transition-all"
                                                    value={rdvNotes}
                                                    onChange={(e) => setRdvNotes(e.target.value)}
                                                ></textarea>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-auto flex gap-3 pt-4">
                                            <button onClick={() => setRdvStep(2)} className="px-5 py-4 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 active:scale-95 transition-transform">Retour</button>
                                            <button 
                                                disabled={!clientPhone || !rdvDate || !rdvTime}
                                                onClick={() => setRdvStep(4)}
                                                className="flex-1 bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl shadow-md disabled:opacity-50 active:scale-95 transition-all"
                                            >
                                                Continuer
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* STEP 4: Summary */}
                                {rdvStep === 4 && (
                                    <div className="flex flex-col gap-4 animate-fadeIn h-full">
                                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
                                            <div className="absolute top-[-30px] right-[-30px] w-24 h-24 bg-[#C8372D]/5 rounded-full blur-[20px]"></div>
                                            
                                            <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">Récapitulatif</h4>
                                            
                                            <div className="flex flex-col gap-4 relative z-10">
                                                <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                                                    <span className="text-gray-500 font-medium text-sm">Client</span>
                                                    <span className="font-bold text-gray-900">{isNewClient ? newClientName : selectedClient.name}</span>
                                                </div>
                                                <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                                                    <span className="text-gray-500 font-medium text-sm">Service</span>
                                                    <span className="font-bold text-gray-900 flex items-center gap-2">
                                                        <span>{selectedService.icon}</span>
                                                        {selectedService.name}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                                                    <span className="text-gray-500 font-medium text-sm">Date</span>
                                                    <span className="font-bold text-gray-900">
                                                        {new Date(rdvDate).toLocaleDateString('fr-FR')} à {rdvTime}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center pt-2">
                                                    <span className="text-gray-900 font-black">Total estimé</span>
                                                    <span className="font-black text-xl text-[#C8372D]">{selectedService.price} DT</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-auto flex gap-3 pt-4">
                                            <button onClick={() => setRdvStep(3)} className="px-5 py-4 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 active:scale-95 transition-transform" disabled={savingRdv}>Retour</button>
                                            <button 
                                                onClick={handleConfirmRdv}
                                                disabled={savingRdv}
                                                className="flex-1 bg-[#C8372D] hover:bg-[#b02e24] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#C8372D]/30 flex items-center justify-center disabled:opacity-70 active:scale-95 transition-all"
                                            >
                                                {savingRdv ? "Création..." : "✓ Créer le rendez-vous"}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
