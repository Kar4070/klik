import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

const ArrowLeftIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
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

export default function SettingsQR() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/login');
                return;
            }
            setUser(user);
            setLoading(false);
        };
        fetchUser();
    }, []);

    const bookingUrl = user ? `${window.location.origin}/booking/${user.id}` : '';

    const handleDownloadQR = () => {
        const svg = document.getElementById("qr-svg");
        if (!svg) return;
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.onload = () => {
            const padding = 40;
            canvas.width = img.width + padding * 2;
            canvas.height = img.height + padding * 2;
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, padding, padding);
            const downloadLink = document.createElement("a");
            downloadLink.download = "KLIK-PRO-QR.png";
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
                <header className="flex items-center mb-10">
                    <button 
                        onClick={() => navigate('/settings')} 
                        className="p-3 mr-3 bg-white hover:bg-gray-50 rounded-full shadow-sm text-gray-800 transition-colors"
                    >
                        <ArrowLeftIcon />
                    </button>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Mon QR Code</h1>
                </header>

                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex flex-col items-center">
                    <div className="text-center mb-8">
                        <p className="text-gray-400 font-bold text-sm mb-1 uppercase tracking-widest">Lien de réservation</p>
                        <p className="text-[#C8372D] font-black text-xs break-all">{bookingUrl}</p>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-[2rem] border-2 border-dashed border-gray-100 mb-10">
                        <div className="bg-white p-4 rounded-2xl shadow-inner">
                            <QRCodeSVG 
                                id="qr-svg"
                                value={bookingUrl}
                                size={200}
                                bgColor="#ffffff"
                                fgColor="#18120E"
                                level="H"
                            />
                        </div>
                    </div>

                    <div className="w-full flex flex-col gap-4">
                        <button 
                            onClick={handleDownloadQR} 
                            className="w-full bg-gray-900 hover:bg-black text-white font-black py-4 rounded-2xl flex justify-center items-center gap-3 text-lg transition-all shadow-xl active:scale-95"
                        >
                            <DownloadIcon />
                            <span>Télécharger l'image</span>
                        </button>
                        
                        <button 
                            onClick={handleWhatsAppShare} 
                            className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-black py-4 rounded-2xl flex justify-center items-center gap-3 text-lg transition-all shadow-lg active:scale-95"
                        >
                            <WhatsappIcon />
                            <span>Partager par WhatsApp</span>
                        </button>
                    </div>
                </div>

                <div className="mt-10 px-6 text-center">
                    <p className="text-gray-400 text-sm font-medium leading-relaxed">
                        Affichez ce code dans votre salon pour permettre à vos clients de réserver en un clic.
                    </p>
                </div>
            </div>
        </div>
    );
}
