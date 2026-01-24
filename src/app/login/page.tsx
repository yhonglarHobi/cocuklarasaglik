"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    User,
    Mail,
    Lock,
    Stethoscope,
    CheckCircle,
    AlertCircle,
    ArrowRight,
    ShieldCheck
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("login"); // login, subscribe, doctor
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            // Simulate login (redirect to profile)
            router.push("/profile");
        }, 1500);
    };

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate captcha check
        setTimeout(() => {
            setLoading(false);
            setSuccessMsg("Harika! Aboneliğiniz başarıyla başlatıldı. Hoş geldiniz!");
        }, 2000);
    };

    const handleDoctorApply = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSuccessMsg("Başvurunuz alındı! Editörlerimiz kimliğinizi doğruladıktan sonra size onay e-postası göndereceğiz.");
        }, 2500);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">

            {/* Brand */}
            <div className="mb-8 text-center w-full px-4">
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#e45d32] break-words">CocuklaraSaglik.com</h1>
                <p className="text-gray-500 text-sm mt-1">Türkiye'nin Pediatri Portalı</p>
            </div>

            <div className="bg-white w-full max-w-md mx-auto rounded-xl shadow-lg overflow-hidden border border-gray-100 flex flex-col">

                {/* Tabs */}
                <div className="flex border-b border-gray-100">
                    <button
                        onClick={() => { setActiveTab("login"); setSuccessMsg(""); }}
                        className={`flex-1 py-3 md:py-4 text-[10px] md:text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'login' ? 'text-hc-blue border-b-2 border-hc-blue bg-blue-50/30' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Giriş Yap
                    </button>
                    <button
                        onClick={() => { setActiveTab("subscribe"); setSuccessMsg(""); }}
                        className={`flex-1 py-3 md:py-4 text-[10px] md:text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'subscribe' ? 'text-hc-orange border-b-2 border-hc-orange bg-orange-50/30' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Hızlı Abone
                    </button>
                    <button
                        onClick={() => { setActiveTab("doctor"); setSuccessMsg(""); }}
                        className={`flex-1 py-3 md:py-4 text-[10px] md:text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1 ${activeTab === 'doctor' ? 'text-green-600 border-b-2 border-green-600 bg-green-50/30' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <Stethoscope className="w-3 h-3" />
                        Uzman
                    </button>
                </div>

                <div className="p-8">

                    {successMsg ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center animate-in zoom-in">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8" />
                            </div>
                            <h3 className="font-bold text-gray-800 mb-2">Teşekkürler!</h3>
                            <p className="text-sm text-gray-600 mb-6">{successMsg}</p>
                            <button
                                onClick={() => {
                                    if (activeTab === 'login') router.push('/profile');
                                    else router.push('/');
                                }}
                                className="text-green-700 font-bold text-sm hover:underline"
                            >
                                Ana Sayfaya Dön
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* LOGIN FORM */}
                            {activeTab === 'login' && (
                                <form onSubmit={handleLogin} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">E-Posta</label>
                                        <div className="relative">
                                            <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                                            <input required type="email" placeholder="ornek@email.com" className="w-full pl-10 p-2.5 border border-gray-200 rounded text-sm focus:border-hc-blue outline-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Şifre</label>
                                        <div className="relative">
                                            <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                                            <input required type="password" placeholder="••••••••" className="w-full pl-10 p-2.5 border border-gray-200 rounded text-sm focus:border-hc-blue outline-none" />
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <label className="flex items-center gap-2 cursor-pointer text-gray-600">
                                            <input type="checkbox" className="rounded text-hc-blue" />
                                            Beni hatırla
                                        </label>
                                        <a href="#" className="text-hc-blue hover:underline">Şifremi unuttum</a>
                                    </div>
                                    <button disabled={loading} className="w-full bg-hc-blue text-white py-3 rounded font-bold transition-all hover:bg-blue-800 flex items-center justify-center gap-2">
                                        {loading && <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />}
                                        GİRİŞ YAP
                                    </button>
                                </form>
                            )}

                            {/* SUBSCRIBE FORM */}
                            {activeTab === 'subscribe' && (
                                <form onSubmit={handleSubscribe} className="space-y-4">
                                    <div className="bg-orange-50 border border-orange-100 p-4 rounded-lg mb-4">
                                        <p className="text-xs text-orange-800 leading-relaxed">
                                            <strong>Ebeveyn misiniz?</strong> Çocuğunuzun gelişimine özel haftalık ücretsiz bültene katılın. Onay gerekmez, hemen başlayın!
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">E-Posta Adresiniz</label>
                                        <div className="relative">
                                            <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                                            <input required type="email" placeholder="ebeveyn@email.com" className="w-full pl-10 p-2.5 border border-gray-200 rounded text-sm focus:border-hc-orange outline-none" />
                                        </div>
                                    </div>

                                    {/* Mock Captcha */}
                                    <div className="bg-gray-50 p-3 rounded border border-gray-200 flex items-center gap-3">
                                        <input required type="checkbox" className="w-5 h-5 rounded border-gray-300 text-hc-orange focus:ring-hc-orange" />
                                        <span className="text-xs text-gray-600 font-medium">Ben robot değilim</span>
                                        <ShieldCheck className="w-5 h-5 text-gray-300 ml-auto" />
                                    </div>

                                    <button disabled={loading} className="w-full bg-hc-orange text-white py-3 rounded font-bold transition-all hover:bg-orange-600 flex items-center justify-center gap-2">
                                        {loading && <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />}
                                        ABONE OL
                                    </button>
                                </form>
                            )}

                            {/* DOCTOR APPLY FORM */}
                            {activeTab === 'doctor' && (
                                <form onSubmit={handleDoctorApply} className="space-y-4">
                                    <div className="bg-green-50 border border-green-100 p-4 rounded-lg mb-4">
                                        <p className="text-xs text-green-800 leading-relaxed">
                                            <strong>Hekimler & Yazarlar:</strong> İçerik üretici ailesine katılmak için başvurun. Hesabınız admin onayı sonrası aktifleşecektir.
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">Adınız</label>
                                            <input required type="text" className="w-full p-2.5 border border-gray-200 rounded text-sm outline-none focus:border-green-500" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">Soyadınız</label>
                                            <input required type="text" className="w-full p-2.5 border border-gray-200 rounded text-sm outline-none focus:border-green-500" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Uzmanlık Alanı / Branş</label>
                                        <input required type="text" placeholder="Örn: Çocuk Sağlığı ve Hastalıkları" className="w-full p-2.5 border border-gray-200 rounded text-sm outline-none focus:border-green-500" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Kurumsal E-Posta</label>
                                        <div className="relative">
                                            <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                                            <input required type="email" placeholder="dr.isim@hastane.com" className="w-full pl-10 p-2.5 border border-gray-200 rounded text-sm focus:border-green-500 outline-none" />
                                        </div>
                                    </div>

                                    {/* Mock Captcha */}
                                    <div className="bg-gray-50 p-3 rounded border border-gray-200 flex items-center gap-3">
                                        <input required type="checkbox" className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                                        <span className="text-xs text-gray-600 font-medium">Ben robot değilim</span>
                                        <ShieldCheck className="w-5 h-5 text-gray-300 ml-auto" />
                                    </div>

                                    <button disabled={loading} className="w-full bg-green-600 text-white py-3 rounded font-bold transition-all hover:bg-green-700 flex items-center justify-center gap-2">
                                        {loading && <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />}
                                        BAŞVURU YAP
                                    </button>
                                </form>
                            )}
                        </>
                    )}

                </div>

                {/* Footer of Card */}
                <div className="bg-gray-50 p-4 border-t border-gray-100 text-center">
                    {activeTab === 'login' && <p className="text-xs text-gray-500">Hesabınız yok mu? <button onClick={() => setActiveTab("subscribe")} className="text-hc-blue font-bold hover:underline">Hemen Katılın</button></p>}
                    {activeTab === 'subscribe' && <p className="text-xs text-gray-500">Zaten üye misiniz? <button onClick={() => setActiveTab("login")} className="text-hc-orange font-bold hover:underline">Giriş Yapın</button></p>}
                    {activeTab === 'doctor' && <p className="text-xs text-gray-500">Admin paneli için <Link href="/admin/settings" className="text-green-600 font-bold hover:underline">buraya tıklayın</Link></p>}
                </div>

            </div>

            <p className="text-xs text-gray-400 mt-8">© 2026 CocuklaraSaglik.com Güvenli Giriş Sistemi ver. 2.1</p>
        </div>
    );
}
