import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [mode, setMode] = useState('login'); // 'login' or 'signup'
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError("Veuillez entrer le nom de l'établissement");
            return;
        }
        if (!phone || phone.length < 8) {
            setError("Veuillez entrer un numéro valide");
            return;
        }
        if (!password || password.length < 6) {
            setError("Le mot de passe doit contenir au moins 6 caractères");
            return;
        }
        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas");
            return;
        }

        setLoading(true);
        setError(null);

        const normalizedPhone = phone.replace(/\s+/g, '').replace(/^0+/, '');
        const email = `${normalizedPhone}@klik.tn`;
        const dbPhone = `+216${normalizedPhone}`;

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (authError) {
            setError(authError.message);
            setLoading(false);
            return;
        }

        const { error: dbError } = await supabase.from('pros').insert([
            {
                id: authData.user.id,
                name: name.trim(),
                phone: dbPhone,
                trial_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            }
        ]);

        if (dbError) {
            setError("Erreur lors de l'enregistrement de l'établissement. Il est possible que ce numéro soit déjà utilisé.");
            setLoading(false);
            return;
        }

        navigate('/dashboard');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!phone || phone.length < 8) {
            setError("Veuillez entrer un numéro valide");
            return;
        }
        if (!password) {
            setError("Veuillez entrer votre mot de passe");
            return;
        }

        setLoading(true);
        setError(null);

        const normalizedPhone = phone.replace(/\s+/g, '').replace(/^0+/, '');
        const email = `${normalizedPhone}@klik.tn`;

        const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (signInError) {
            setError("Identifiants incorrects svp vérifier votre numéro ou mot de passe.");
            setLoading(false);
            return;
        }

        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-[#F4F1EC] flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
            {/* Background Decor Elements for depth */}
            <div className="absolute top-[-5%] left-[-10%] w-72 h-72 bg-[#C8372D]/10 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#C8372D]/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="w-full max-w-sm bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-gray-200/50 border border-white p-8 flex flex-col relative z-10">

                {/* Header Section */}
                <div className="text-center mb-6 animate-fadeIn">
                    <h1 className="text-5xl font-black text-[#C8372D] tracking-tighter mb-2 hover:scale-105 transition-transform duration-300 cursor-default">
                        KLIK
                    </h1>
                    <p className="text-gray-500 font-medium text-sm">
                        Pour les professionnels tunisiens
                    </p>
                </div>

                {/* Tabs for Login / Signup */}
                <div className="flex bg-gray-100/80 p-1 rounded-xl mb-6">
                    <button
                        type="button"
                        onClick={() => { setMode('login'); setError(null); }}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${mode === 'login' ? 'bg-white text-[#C8372D] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Se connecter
                    </button>
                    <button
                        type="button"
                        onClick={() => { setMode('signup'); setError(null); }}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${mode === 'signup' ? 'bg-white text-[#C8372D] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Créer un compte
                    </button>
                </div>

                {/* Dynamic Error Message */}
                {error && (
                    <div className="mb-6 p-3 bg-red-50 border border-red-100 text-[#C8372D] text-sm font-medium rounded-xl text-center animate-fadeIn">
                        {error}
                    </div>
                )}

                <form onSubmit={mode === 'signup' ? handleSignup : handleLogin} className="flex flex-col gap-4 animate-fadeIn">
                    
                    {mode === 'signup' && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1 pl-1">
                                Nom de l'établissement
                            </label>
                            <input
                                type="text"
                                placeholder="Mon Salon"
                                className="w-full py-3.5 px-4 bg-white border-2 border-transparent shadow-sm rounded-2xl outline-none text-gray-800 font-semibold placeholder-gray-300 focus:border-[#C8372D]/30 focus:ring-4 focus:ring-[#C8372D]/10 transition-all duration-300"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1 pl-1">
                            Numéro de téléphone
                        </label>
                        <div className="flex items-center w-full bg-white border-2 border-transparent shadow-sm rounded-2xl overflow-hidden focus-within:border-[#C8372D]/30 focus-within:ring-4 focus-within:ring-[#C8372D]/10 transition-all duration-300">
                            <span className="px-4 py-3.5 bg-gray-50/80 text-gray-600 font-bold border-r border-gray-100 selection:bg-transparent">
                                +216
                            </span>
                            <input
                                type="tel"
                                placeholder="2X XXX XXX"
                                className="flex-1 py-3.5 px-4 outline-none text-gray-800 font-semibold placeholder-gray-300 w-full bg-transparent"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1 pl-1">
                            Mot de passe
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full py-3.5 px-4 bg-white border-2 border-transparent shadow-sm rounded-2xl outline-none text-gray-800 font-semibold placeholder-gray-300 focus:border-[#C8372D]/30 focus:ring-4 focus:ring-[#C8372D]/10 transition-all duration-300"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    {mode === 'signup' && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1 pl-1">
                                Confirmer le mot de passe
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full py-3.5 px-4 bg-white border-2 border-transparent shadow-sm rounded-2xl outline-none text-gray-800 font-semibold placeholder-gray-300 focus:border-[#C8372D]/30 focus:ring-4 focus:ring-[#C8372D]/10 transition-all duration-300"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 bg-[#C8372D] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#C8372D]/25 hover:shadow-[#C8372D]/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0 transition-all duration-300 flex justify-center items-center"
                    >
                        {loading ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            mode === 'signup' ? "Créer mon compte" : "Se connecter"
                        )}
                    </button>
                </form>

                {/* Footer Note */}
                <div className="mt-8 text-center pt-6 border-t border-gray-100/60">
                    <p className="text-gray-400 font-bold text-sm flex items-center justify-center gap-2">
                        <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        1 numéro = 1 mois gratuit
                    </p>
                </div>
            </div>
        </div>
    );
}
