
"use client";

import React, { useState } from "react";
import { ArticleCard, Article } from "@/components/blog/ArticleCard";
import { ChevronRight, X, Calendar as CalendarIcon } from "lucide-react";
import Link from "next/link";
import { AdPlaceholder } from "@/components/ui/AdPlaceholder";

// Mock Data Translations
const articles: Article[] = [
    {
        id: "1",
        title: "Yenidoğan Sarılığı: Ne Zaman Endişelenmeli?",
        summary: "Bebeklerde sık görülen fizyolojik sarılık ile patolojik sarılık arasındaki farklar ve tedavi yöntemleri.",
        category: "urgent",
        readTime: "4 dk",
        ageGroup: "Yaş ve Gelişim: Bebek",
        isDoctorApproved: true,
    },
    {
        id: "3",
        title: "Ateşli Çocuğa Yaklaşım: Evde İlk Yardım",
        summary: "38 derece ve üzeri ateş durumunda yapılması gerekenler ve ilaç kullanımı.",
        category: "health",
        readTime: "5 dk",
        ageGroup: "Sağlık Sorunları",
        isDoctorApproved: true,
    },
    {
        id: "2",
        title: "Ek Gıdaya Geçiş Rehberi",
        summary: "Katı gıdalarla tanışma süreci, 3 gün kuralı ve güvenli ilk besinler.",
        category: "nutrition",
        readTime: "7 dk",
        ageGroup: "Sağlıklı Yaşam",
        isDoctorApproved: true,
    },
    {
        id: "4",
        title: "Bebeklerde Uyku Eğitimi: Ferber Yöntemi",
        summary: "Uyku eğitimi yöntemleri arasında popüler olan Ferber metodunun uygulanışı.",
        category: "growth",
        readTime: "6 dk",
        ageGroup: "Aile Hayatı",
        isDoctorApproved: true,
    },
];

const agesStages = [
    "Hamilelik",
    "Bebek",
    "Yürümeye Başlayan (Toddler)",
    "Okul Öncesi",
    "İlkokul Çağı",
    "Ergenlik",
    "Genç Yetişkin"
];

export default function Homepage() {
    const [showWebinarModal, setShowWebinarModal] = useState(false);

    return (
        <div className="font-sans">
            {/* Hero Heading */}
            <div className="text-center py-6">
                <h1 className="text-2xl md:text-5xl text-[#5c4a3d] font-serif tracking-tight px-4">Türkiye'nin En Kapsamlı Çocuk Sağlığı Portalı</h1>
            </div>

            {/* Hero Banner Section */}
            <div onClick={() => setShowWebinarModal(true)} className="relative w-full h-auto md:h-[340px] bg-[#fbfbf1] flex flex-col md:flex-row overflow-hidden rounded-sm shadow-md mb-10 group cursor-pointer">
                {/* Text Content */}
                <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center text-[#5c4a3d] z-10 relative order-2 md:order-1">
                    <div className="bg-hc-orange/10 backdrop-blur-sm px-4 py-1 text-[10px] md:text-xs uppercase font-bold tracking-widest w-fit mb-3 rounded-sm border border-hc-orange/20 text-hc-orange">Ücretsiz Ebeveyn Webinarı</div>
                    <div className="text-sm md:text-lg font-bold text-gray-600 mb-1">Cuma, 30 Oca, 2026 - 14:00</div>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold leading-tight mb-4 md:mb-6 text-[#5c4a3d] drop-shadow-sm">
                        Çocuk Aşıları: Ne Zaman, Neden ve Yan Etkiler?
                    </h2>
                    <button
                        className="bg-[#fcd087] text-[#5c4a3d] px-6 py-2 md:px-8 md:py-3 font-bold text-base md:text-lg rounded-sm shadow hover:bg-white transition-all w-fit border-b-4 border-[#dcb36f] hover:border-gray-300 transform translate-y-0 hover:-translate-y-1"
                    >
                        Kayıt Ol
                    </button>
                </div>

                {/* Abstract Visual (Right side on Desktop, Top on Mobile) */}
                <div className="w-full md:absolute md:right-0 md:top-0 h-48 md:h-full md:w-3/5 bg-[url('https://images.unsplash.com/photo-1632053009664-67252cb72412?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center order-1 md:order-2 opacity-100 md:opacity-40 md:mix-blend-overlay md:group-hover:opacity-50 transition-opacity">
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 px-4 pb-12">

                {/* Column 1: Ages & Stages (Left Sidebar) */}
                <div className="flex flex-col gap-4 lg:col-span-1">
                    <h3 className="text-lg font-bold text-hc-blue uppercase border-b-2 border-hc-green pb-1 mb-2">Yaş ve Gelişim</h3>
                    {agesStages.map((stage, i) => (
                        <Link key={i} href={`/yas-ve-gelisim#${stage.toLowerCase().replace(/ /g, '-')}`}>
                            <div className="flex justify-between items-center text-gray-600 hover:text-hc-orange cursor-pointer border-b border-gray-100 py-3 transition-colors group">
                                <span className="group-hover:translate-x-1 transition-transform">{stage}</span>
                                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-hc-orange" />
                            </div>
                        </Link>
                    ))}

                    {/* Ad Placeholder (Sidebar) */}
                    <div className="mt-8">
                        <AdPlaceholder height="250px" label="Sponsorlu Alan" />
                    </div>
                </div>

                {/* Column 2: Latest Articles (Center/Right Content) */}
                <div className="lg:col-span-3">
                    <div className="flex items-center justify-between border-b-2 border-hc-orange mb-6 pb-1">
                        <h3 className="text-xl font-bold text-hc-blue uppercase">Öne Çıkan Makaleler</h3>
                        <Link href="/makaleler" className="text-xs font-bold text-hc-orange cursor-pointer hover:underline">TÜMÜNÜ GÖR &rarr;</Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {articles.slice(0, 2).map(article => (
                            <ArticleCard key={article.id} article={article} />
                        ))}
                    </div>

                    {/* Middle Banner: Seasonal Guide */}
                    <div className="my-8 relative rounded-xl overflow-hidden bg-gradient-to-r from-[#9ec446] to-[#7a9c32] text-white shadow-lg">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
                        <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="text-center md:text-left">
                                <span className="bg-white/20 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded mb-3 inline-block text-white">Mevsimsel Rehber</span>
                                <h3 className="text-2xl md:text-3xl font-serif font-bold mb-2 text-white">Kış Hastalıklarından Korunma</h3>
                                <p className="text-green-50 text-sm max-w-md">Influenza, RSV ve soğuk algınlığı... Çocuğunuzu kış aylarında nasıl korursunuz? Bağışıklık güçlendiren tarifler ve uzman önerileri.</p>
                            </div>
                            <button className="bg-white text-[#5c8a00] px-6 py-3 rounded font-bold text-sm shadow-sm hover:bg-green-50 transition-colors shrink-0">
                                Rehberi İncele
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {articles.slice(2).map(article => (
                            <ArticleCard key={article.id} article={article} />
                        ))}

                        {/* More Articles Placeholder */}
                        <div className="col-span-1 md:col-span-2 mt-4 p-4 bg-gray-50 border border-gray-200 text-center rounded-sm">
                            <p className="text-gray-500 text-sm mb-2">Daha fazla içeriğe mi ihtiyacınız var?</p>
                            <Link href="/makaleler" className="text-hc-blue font-bold text-sm hover:underline">Kütüphaneye Git</Link>
                        </div>
                    </div>
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

        </div>
    );
}
