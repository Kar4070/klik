import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { getCachedData, setCachedData, clearCache } from '../utils/cacheUtils';

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

export default function ServicesList() {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [showAddServiceModal, setShowAddServiceModal] = useState(false);
    const [newService, setNewService] = useState({ name: '', price: '', duration_minutes: '' });

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const cached = getCachedData('klik_services');
            if (cached) {
                setServices(cached);
                setLoading(false);
            } else {
                setLoading(true);
            }

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/login');
                return;
            }
            setUser(user);

            const { data: servicesData } = await supabase
                .from('services')
                .select('*')
                .eq('pro_id', user.id);
            
            const sData = servicesData || [];
            setServices(sData);
            setCachedData('klik_services', sData);
        } catch (error) {
            console.error("Error fetching services:", error);
        } finally {
            setLoading(false);
        }
    };

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
            clearCache('klik_services');
        }
    };

    const handleDeleteService = async (id) => {
        const { error } = await supabase.from('services').delete().eq('id', id);
        if (!error) {
            const updated = services.filter(s => s.id !== id);
            setServices(updated);
            clearCache('klik_services');
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
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Mes services</h1>
                </header>

                {/* Services List */}
                <div className="flex flex-col gap-3">
                    {services.length === 0 ? (
                        <div className="text-sm text-gray-400 font-medium text-center py-12 bg-white rounded-[1.5rem] border border-dashed border-gray-200">
                            Aucun service défini
                        </div>
                    ) : services.map(s => (
                        <div key={s.id} className="flex items-center justify-between p-4 bg-white rounded-[1.5rem] shadow-sm border border-gray-100">
                            <div>
                                <p className="font-bold text-gray-900 text-lg mb-0.5">{s.name}</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500 font-bold bg-gray-100 px-2 py-0.5 rounded-md">{s.duration_minutes} min</span>
                                    <span className="text-[10px] text-gray-300">•</span>
                                    <span className="text-sm text-[#C8372D] font-black">{s.price} DT</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleDeleteService(s.id)} 
                                className="p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all active:scale-95"
                            >
                                <TrashIcon />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Add Button Sticky at bottom */}
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-[350px] px-4">
                    <button 
                        onClick={() => setShowAddServiceModal(true)}
                        className="w-full bg-[#C8372D] hover:bg-[#b02e24] text-white font-black py-4 rounded-2xl shadow-lg shadow-[#C8372D]/30 active:scale-95 transition-all text-lg flex items-center justify-center gap-2"
                    >
                        ＋ Ajouter un service
                    </button>
                </div>

                {/* Add Service Modal */}
                {showAddServiceModal && (
                    <div className="fixed inset-0 z-[100] max-w-[390px] mx-auto flex flex-col justify-end">
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setShowAddServiceModal(false)}></div>
                        
                        <div className="bg-white rounded-t-[2.5rem] p-8 shadow-2xl relative z-10 animate-slideUp">
                            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8"></div>
                            
                            <h3 className="font-black text-2xl mb-8 text-gray-900 text-center">Nouveau service</h3>
                            
                            <div className="flex flex-col gap-6 mb-8">
                                <div>
                                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Nom du service</label>
                                    <input 
                                        type="text" 
                                        placeholder="Ex: Coupe Homme"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-[#C8372D] focus:ring-4 focus:ring-[#C8372D]/10 font-bold transition-all placeholder:font-medium placeholder:text-gray-400"
                                        value={newService.name}
                                        onChange={e => setNewService({...newService, name: e.target.value})}
                                    />
                                </div>
                                
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Durée (min)</label>
                                        <input 
                                            type="number" 
                                            placeholder="30"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-[#C8372D] focus:ring-4 focus:ring-[#C8372D]/10 font-bold transition-all text-center"
                                            value={newService.duration_minutes}
                                            onChange={e => setNewService({...newService, duration_minutes: e.target.value})}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Prix (DT)</label>
                                        <input 
                                            type="number" 
                                            placeholder="15"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-[#C8372D] focus:ring-4 focus:ring-[#C8372D]/10 font-bold transition-all text-center"
                                            value={newService.price}
                                            onChange={e => setNewService({...newService, price: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <button 
                                onClick={handleSaveService}
                                disabled={!newService.name || !newService.price || !newService.duration_minutes}
                                className="w-full bg-gray-900 hover:bg-black text-white font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 text-lg"
                            >
                                Enregistrer le service
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
