"use client";

import React, { useState } from "react";
import {
    Mail,
    Send,
    Calendar,
    CheckCircle,
    Clock,
    Users,
    FileText,
    MousePointerClick
} from "lucide-react";

export default function NewsletterPage() {
    const [activeTab, setActiveTab] = useState("create"); // create, subscribers, history
    const [frequency, setFrequency] = useState("weekly"); // weekly, 10days, monthly
    const [contentMode, setContentMode] = useState("auto"); // auto, manual
    const [isSending, setIsSending] = useState(false);
    const [sentSuccess, setSentSuccess] = useState(false);

    const subscribers = [
        { email: "ayse.yilmaz@gmail.com", date: "23 Oca 2026", status: "Aktif" },
        { email: "mehmet.demir@hotmail.com", date: "22 Oca 2026", status: "Aktif" },
        { email: "selin.k@yahoo.com", date: "20 Oca 2026", status: "Aktif" },
        { email: "burak.t@gmail.com", date: "18 Oca 2026", status: "Aktif" },
        { email: "zeynep.p@outlook.com", date: "15 Oca 2026", status: "Pasif" },
    ];

    const recentArticles = [
        { id: 1, title: "Bebeklerde Ateş: Ne Zaman Acile Gidilmeli?", date: "Bugün" },
        { id: 2, title: "Mevsimsel Alerjiler: AAP Rehberi", date: "Dün" },
        { id: 3, title: "Çocuklarda Ekran Bağımlılığı Nasıl Önlenir?", date: "2 gün önce" },
        { id: 4, title: "Okul Öncesi Beslenme Çantası Örileri", date: "3 gün önce" },
        { id: 5, title: "Ev Kazalarını Önleme Rehberi", date: "4 gün önce" },
    ];

    const handleSend = () => {
        setIsSending(true);
        setTimeout(() => {
            setIsSending(false);
            setSentSuccess(true);
            setTimeout(() => setSentSuccess(false), 3000);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-[#f0f2f5] font-sans p-8">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-[#5c4a3d] flex items-center gap-3">
                            <Mail className="w-8 h-8 text-hc-orange" fill="currentColor" />
                            Bülten Yönetimi
                        </h1>
                        <p className="text-gray-500 mt-2 ml-1">Otomatik e-posta bültenleri oluşturun ve gönderin.</p>
                    </div>

                    <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 flex items-center gap-3 shadow-sm">
                        <Users className="w-5 h-5 text-gray-400" />
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase">Toplam Abone</p>
                            <p className="text-xl font-bold text-hc-blue">1,248</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Configuration */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Frequency Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-hc-blue" />
                                Gönderim Sıklığı
                            </h2>
                            <div className="grid grid-cols-3 gap-4">
                                <button
                                    onClick={() => setFrequency("weekly")}
                                    className={`p-4 rounded-lg border-2 text-center transition-all ${frequency === 'weekly' ? 'border-hc-orange bg-orange-50' : 'border-gray-100 hover:border-gray-300'}`}
                                >
                                    <span className="block text-2xl font-bold text-gray-800 mb-1">7</span>
                                    <span className="text-xs font-bold uppercase text-gray-500">Günlük (Hafta)</span>
                                    {frequency === 'weekly' && <CheckCircle className="w-5 h-5 text-hc-orange mx-auto mt-2" />}
                                </button>
                                <button
                                    onClick={() => setFrequency("10days")}
                                    className={`p-4 rounded-lg border-2 text-center transition-all ${frequency === '10days' ? 'border-hc-orange bg-orange-50' : 'border-gray-100 hover:border-gray-300'}`}
                                >
                                    <span className="block text-2xl font-bold text-gray-800 mb-1">10</span>
                                    <span className="text-xs font-bold uppercase text-gray-500">Günlük Peryot</span>
                                    {frequency === '10days' && <CheckCircle className="w-5 h-5 text-hc-orange mx-auto mt-2" />}
                                </button>
                                <button
                                    onClick={() => setFrequency("monthly")}
                                    className={`p-4 rounded-lg border-2 text-center transition-all ${frequency === 'monthly' ? 'border-hc-orange bg-orange-50' : 'border-gray-100 hover:border-gray-300'}`}
                                >
                                    <span className="block text-2xl font-bold text-gray-800 mb-1">30</span>
                                    <span className="text-xs font-bold uppercase text-gray-500">Aylık Özet</span>
                                    {frequency === 'monthly' && <CheckCircle className="w-5 h-5 text-hc-orange mx-auto mt-2" />}
                                </button>
                            </div>
                        </div>

                        {/* Content Selection Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-hc-blue" />
                                İçerik Seçimi
                            </h2>

                            <div className="flex gap-4 mb-6">
                                <button
                                    onClick={() => setContentMode("auto")}
                                    className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${contentMode === 'auto' ? 'bg-hc-blue text-white' : 'bg-gray-100 text-gray-600'}`}
                                >
                                    Otomatik (Son Yazılar)
                                </button>
                                <button
                                    onClick={() => setContentMode("manual")}
                                    className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${contentMode === 'manual' ? 'bg-hc-blue text-white' : 'bg-gray-100 text-gray-600'}`}
                                >
                                    Manuel Seçim
                                </button>
                            </div>

                            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                                <h3 className="text-xs font-bold uppercase text-gray-400 mb-3 ml-1">Bültende Yer Alacak İçerikler</h3>
                                <div className="space-y-2">
                                    {recentArticles.map((article) => (
                                        <div key={article.id} className="flex items-center gap-3 bg-white p-3 rounded border border-gray-200 shadow-sm">
                                            <input
                                                type="checkbox"
                                                checked={contentMode === 'auto' ? true : undefined}
                                                disabled={contentMode === 'auto'}
                                                className="w-4 h-4 text-hc-orange rounded focus:ring-hc-orange"
                                            />
                                            <div className="flex-1">
                                                <p className="font-bold text-gray-800 text-sm">{article.title}</p>
                                                <p className="text-xs text-gray-500">{article.date}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={handleSend}
                            disabled={isSending}
                            className={`w-full py-4 rounded-lg font-bold text-white shadow-lg transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 ${isSending ? 'bg-gray-400 cursor-not-allowed' : sentSuccess ? 'bg-green-500' : 'bg-gradient-to-r from-hc-orange to-[#f5a623]'}`}
                        >
                            {isSending ? (
                                <>GÖNDERİLİYOR...</>
                            ) : sentSuccess ? (
                                <>
                                    <CheckCircle className="w-6 h-6" />
                                    BAŞARIYLA GÖNDERİLDİ
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    BÜLTENİ OLUŞTUR VE GÖNDER
                                </>
                            )}
                        </button>

                    </div>

                    {/* Right Column: Preview & Logs */}
                    <div className="lg:col-span-1 space-y-6">

                        {/* Email Preview */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-xs font-bold uppercase text-gray-400 mb-4 tracking-wider">E-Posta Önizleme</h3>
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <div className="bg-gray-100 p-3 border-b border-gray-200 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-red-400"></span>
                                    <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                                    <span className="w-2 h-2 rounded-full bg-green-400"></span>
                                </div>
                                <div className="p-4 bg-white min-h-[300px]">
                                    <div className="text-center border-b border-gray-100 pb-4 mb-4">
                                        <h4 className="font-serif font-bold text-[#e45d32] text-lg">CocuklaraSaglik</h4>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-widest">Haftalık Bülten</p>
                                    </div>
                                    <div className="space-y-4">
                                        {recentArticles.slice(0, 3).map(art => (
                                            <div key={art.id} className="flex gap-3">
                                                <div className="w-12 h-12 bg-gray-200 rounded shrink-0"></div>
                                                <div>
                                                    <p className="font-bold text-gray-800 text-xs leading-tight mb-1">{art.title}</p>
                                                    <a href="#" className="text-[10px] text-hc-blue underline">Devamını Oku</a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-8 pt-4 border-t border-gray-100 text-center">
                                        <p className="text-[10px] text-gray-400">Bu e-posta otomatik olarak gönderilmiştir.</p>
                                        <p className="text-[10px] text-gray-400 underline">Abonelikten Ayrıl</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Subscribers List */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Son Aboneler</h3>
                                <button className="text-hc-blue text-xs font-bold hover:underline">Tümü</button>
                            </div>
                            <div className="space-y-3">
                                {subscribers.map((sub, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                                                {sub.email[0].toUpperCase()}
                                            </div>
                                            <span className="text-gray-600 truncate max-w-[120px]" title={sub.email}>{sub.email}</span>
                                        </div>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sub.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {sub.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}
