"use client";

import React, { useState } from "react";
import { X, Calendar as CalendarIcon } from "lucide-react";

export function HeroWebinar() {
    const [showWebinarModal, setShowWebinarModal] = useState(false);

    return (
        <>
            {/* Hero Banner Section */}
            <div onClick={() => setShowWebinarModal(true)} className="relative w-full min-h-[300px] md:h-[340px] bg-[#fbfbf1] flex items-center overflow-hidden rounded-sm shadow-md mb-10 group cursor-pointer">

                {/* Text Content */}
                <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center text-[#5c4a3d] z-10 relative">
                    <div className="bg-hc-orange/10 backdrop-blur-md px-4 py-1 text-[10px] md:text-xs uppercase font-bold tracking-widest w-fit mb-3 rounded-sm border border-hc-orange/20 text-hc-orange shadow-sm bg-white/80">Ücretsiz Ebeveyn Webinarı</div>
                    <div className="text-sm md:text-lg font-bold text-gray-700 md:text-gray-600 mb-1 drop-shadow-sm md:drop-shadow-none">Cuma, 30 Oca, 2026 - 14:00</div>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold leading-tight mb-4 md:mb-6 text-[#5c4a3d] drop-shadow-sm">
                        Çocuk Aşıları: Ne Zaman, Neden ve Yan Etkiler?
                    </h2>
                    <button
                        className="bg-[#fcd087] text-[#5c4a3d] px-6 py-2 md:px-8 md:py-3 font-bold text-base md:text-lg rounded-sm shadow hover:bg-white transition-all w-fit border-b-4 border-[#dcb36f] hover:border-gray-300 transform translate-y-0 hover:-translate-y-1"
                    >
                        Kayıt Ol
                    </button>
                </div>

                {/* Visual Background (Absolute for both Mobile and Desktop) */}
                <div className="absolute inset-0 w-full h-full md:w-3/5 md:left-auto md:right-0 bg-[url('https://images.unsplash.com/photo-1632053009928-12b2e0436979?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center md:bg-right opacity-30 md:opacity-100 md:mix-blend-overlay transition-opacity">
                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#fbfbf1] via-[#fbfbf1]/80 to-transparent md:via-[#fbfbf1] md:to-transparent"></div>
                </div>
            </div>

            {/* WEBINAR MODAL */}
            {showWebinarModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full relative overflow-hidden animate-in zoom-in-95 duration-200">

                        {/* Modal Header */}
                        <div className="bg-[#f39200] p-6 text-white text-center relative">
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowWebinarModal(false); }}
                                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                                <CalendarIcon className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-serif font-bold">Webinar Kayıt</h3>
                            <p className="text-white/90 text-sm mt-1">Kontenjanlar dolmak üzere!</p>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 text-center">
                            <h4 className="text-lg font-bold text-gray-800 mb-2">Çocuk Aşıları Bilgilendirme</h4>
                            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                                Şu an için kayıt dönemimiz aktif değildir. Ancak yeni dönem kayıtları açıldığında sizi ilk sıradan haberdar edebiliriz.
                            </p>

                            <div className="space-y-3">
                                <button
                                    onClick={() => setShowWebinarModal(false)}
                                    className="w-full bg-[#f39200] text-white font-bold py-3 rounded-lg hover:bg-[#d98300] transition-colors shadow-md"
                                >
                                    Beni Haberdar Et
                                </button>
                                <button
                                    onClick={() => setShowWebinarModal(false)}
                                    className="w-full bg-gray-100 text-gray-600 font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Kapat
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
}
