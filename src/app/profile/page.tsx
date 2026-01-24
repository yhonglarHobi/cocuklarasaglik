"use client";

import React, { useState } from "react";
import {
    User,
    Settings,
    FileText,
    PlusCircle,
    Activity,
    LogOut,
    LayoutDashboard,
    Stethoscope,
    Baby
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// --- Mock User Data ---
type UserRole = "admin" | "doctor" | "writer" | "patient";

const mockUsers = {
    doctor: {
        name: "Dr. Ayşe Yılmaz",
        role: "doctor",
        title: "Uzman Pediatrist",
        avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop",
        stats: { articles: 24, views: "125K", patients: 12 }
    },
    writer: {
        name: "Zeynep Editör",
        role: "writer",
        title: "Kıdemli Sağlık Editörü",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop",
        stats: { articles: 142, views: "2.1M", drafts: 3 }
    },
    patient: {
        name: "Selin Demir",
        role: "patient",
        title: "Ebeveyn (2 Çocuk)",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop",
        stats: { appointments: 2, children: 2, saved: 15 }
    }
};

export default function ProfilePage() {
    const [activeRole, setActiveRole] = useState<UserRole>("doctor"); // Default for demo
    const [activeTab, setActiveTab] = useState("overview");

    const user = mockUsers[activeRole as keyof typeof mockUsers] || mockUsers.doctor;

    return (
        <div className="min-h-screen bg-[#f9f9f9] font-sans pb-20">

            {/* Top Bar for Demo Switching */}
            <div className="bg-gray-800 text-white p-2 text-xs flex justify-center gap-4 fixed top-0 w-full z-50">
                <span className="opacity-50 uppercase tracking-widest font-bold self-center">Demo Modu:</span>
                <button onClick={() => setActiveRole("doctor")} className={`px-3 py-1 rounded ${activeRole === "doctor" ? "bg-hc-orange text-white" : "bg-gray-700 hover:bg-gray-600"}`}>Doktor View</button>
                <button onClick={() => setActiveRole("writer")} className={`px-3 py-1 rounded ${activeRole === "writer" ? "bg-hc-blue text-white" : "bg-gray-700 hover:bg-gray-600"}`}>Yazar View</button>
                <button onClick={() => setActiveRole("patient")} className={`px-3 py-1 rounded ${activeRole === "patient" ? "bg-hc-green text-white" : "bg-gray-700 hover:bg-gray-600"}`}>Hasta View</button>
            </div>

            <div className="max-w-6xl mx-auto pt-20 px-4 md:px-8">

                {/* Header Profile Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
                    <div className="h-32 bg-gradient-to-r from-hc-blue/10 to-hc-green/10"></div>
                    <div className="px-8 pb-8 flex flex-col md:flex-row items-center md:items-end -mt-12 gap-6">
                        <div className="relative">
                            <img src={user.avatar} alt={user.name} className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white object-cover shadow-md" />
                            <div className="absolute bottom-1 right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white" title="Online"></div>
                        </div>

                        <div className="flex-1 text-center md:text-left mb-2">
                            <h1 className="text-2xl font-serif font-bold text-[#5c4a3d]">{user.name}</h1>
                            <p className="text-gray-500 text-sm font-medium">{user.title}</p>
                            <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded uppercase font-bold tracking-wide border border-gray-200">{user.role}</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setActiveTab("settings")} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-sm text-sm font-bold hover:bg-gray-50 transition-colors">
                                Profili Düzenle
                            </button>
                            {activeRole !== 'patient' && (
                                <Link href="/profile/new-article">
                                    <button className="px-4 py-2 bg-hc-blue text-white rounded-sm text-sm font-bold hover:bg-blue-700 transition-colors flex items-center gap-2">
                                        <PlusCircle className="w-4 h-4" />
                                        Yeni Yazı
                                    </button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* Sidebar Navigation */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
                            <nav className="flex flex-col gap-1">
                                <button onClick={() => setActiveTab("overview")} className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-hc-blue/10 text-hc-blue' : 'text-gray-600 hover:bg-gray-50'}`}>
                                    <LayoutDashboard className="w-4 h-4" />
                                    Genel Bakış
                                </button>

                                {(activeRole === 'doctor' || activeRole === 'writer') && (
                                    <>
                                        <button onClick={() => setActiveTab("articles")} className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${activeTab === 'articles' ? 'bg-hc-blue/10 text-hc-blue' : 'text-gray-600 hover:bg-gray-50'}`}>
                                            <FileText className="w-4 h-4" />
                                            Yazılarım
                                        </button>
                                        <button onClick={() => setActiveTab("stats")} className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${activeTab === 'stats' ? 'bg-hc-blue/10 text-hc-blue' : 'text-gray-600 hover:bg-gray-50'}`}>
                                            <Activity className="w-4 h-4" />
                                            İstatistikler
                                        </button>
                                    </>
                                )}

                                {activeRole === 'patient' && (
                                    <>
                                        <button className="flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                                            <Baby className="w-4 h-4" />
                                            Çocuklarım
                                        </button>
                                        <button className="flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                                            <Stethoscope className="w-4 h-4" />
                                            Randevularım
                                        </button>
                                    </>
                                )}

                                <button onClick={() => setActiveTab("settings")} className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${activeTab === 'settings' ? 'bg-hc-blue/10 text-hc-blue' : 'text-gray-600 hover:bg-gray-50'}`}>
                                    <Settings className="w-4 h-4" />
                                    Ayarlar
                                </button>
                                <div className="border-t border-gray-100 my-1"></div>
                                <button className="flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                                    <LogOut className="w-4 h-4" />
                                    Çıkış Yap
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="md:col-span-3">

                        {/* OVERVIEW TAB */}
                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {Object.entries(user.stats).map(([key, value]) => (
                                        <div key={key} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                                            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{key}</h3>
                                            <p className="text-3xl font-serif text-[#5c4a3d] font-bold">{value}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Recent Activity / Content */}
                                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                                    <h2 className="text-lg font-bold text-[#5c4a3d] mb-4 border-b border-gray-100 pb-2">
                                        {activeRole === 'patient' ? 'Son Kaydedilenler' : 'Son Yazılar'}
                                    </h2>
                                    <div className="flex flex-col gap-4">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded transition-colors cursor-pointer group">
                                                <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                                                    <img src={`https://source.unsplash.com/random/100x100?sig=${i}`} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-800 text-sm group-hover:text-hc-blue transition-colors">
                                                        Çocuklarda Gelişim Basamakları: {i}. Ay
                                                    </h4>
                                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                                    </p>
                                                    <div className="flex gap-2 mt-2">
                                                        <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">YAYINDA</span>
                                                        <span className="text-[10px] text-gray-400">12 Ocak 2026</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="w-full mt-4 text-center text-xs font-bold text-hc-blue hover:underline">TÜMÜNÜ GÖR</button>
                                </div>
                            </div>
                        )}

                        {/* WRITER: ARTICLES TAB */}
                        {activeTab === 'articles' && (activeRole === 'admin' || activeRole === 'writer' || activeRole === 'doctor') && (
                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden min-h-[500px]">
                                <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                                    <h2 className="font-bold text-gray-700">Yazı Yönetimi</h2>
                                    <div className="flex gap-2">
                                        <input placeholder="Ara..." className="px-3 py-1.5 text-sm border border-gray-300 rounded-sm" />
                                        <select className="px-3 py-1.5 text-sm border border-gray-300 rounded-sm">
                                            <option>Tümü</option>
                                            <option>Yayında</option>
                                            <option>Taslak</option>
                                        </select>
                                    </div>
                                </div>
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-200">
                                        <tr>
                                            <th className="p-4">Başlık</th>
                                            <th className="p-4">Durum</th>
                                            <th className="p-4">Tarih</th>
                                            <th className="p-4 text-right">İşlem</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                                                <td className="p-4 font-medium text-gray-800">Yenidoğan Sarılığı Rehberi {i}</td>
                                                <td className="p-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">YAYINDA</span></td>
                                                <td className="p-4 text-gray-500">1{i} Ocak 2026</td>
                                                <td className="p-4 text-right">
                                                    <button className="text-hc-blue hover:underline font-bold text-xs">DÜZENLE</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* STATISTICS TAB */}
                        {activeTab === 'stats' && (
                            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm text-center py-20">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Activity className="w-10 h-10 text-gray-400" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-800 mb-2">Detaylı İstatistikler</h2>
                                <p className="text-gray-500 max-w-md mx-auto">Okunma sayıları, demografik veriler ve etkileşim analizleri yakında burada olacak.</p>
                            </div>
                        )}

                        {/* SETTINGS TAB */}
                        {activeTab === 'settings' && (
                            <div key={user.name} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-gray-100">
                                    <h2 className="text-lg font-bold text-gray-800">Hesap Ayarları</h2>
                                    <p className="text-sm text-gray-500">Profil bilgilerinizi ve tercihlerinizi güncelleyin.</p>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Ad Soyad</label>
                                            <input type="text" defaultValue={user.name} className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:border-hc-blue outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Ünvan</label>
                                            <input type="text" defaultValue={user.title} className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:border-hc-blue outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">E-posta</label>
                                            <input type="email" defaultValue="ornek@email.com" className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:border-hc-blue outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Şifre</label>
                                            <button onClick={() => alert("Şifre sıfırlama talimatları e-posta adresinize gönderildi.")} className="text-hc-blue font-bold text-sm hover:underline mt-2">Şifre Değiştir</button>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                                        <button onClick={() => alert("Profil bilgileriniz başarıyla güncellendi.")} className="bg-hc-blue text-white px-6 py-2 rounded-sm font-bold text-sm hover:bg-blue-700">Değişiklikleri Kaydet</button>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>

                </div>
            </div>
        </div>
    );
}
