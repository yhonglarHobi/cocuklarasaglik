"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Key, Save, AlertCircle, Database, Activity, DollarSign } from "lucide-react";

import { toast } from "sonner";
import { getSystemSettings, updateSystemSettings } from "./actions";
import { DEFAULT_MASTER_PROMPT } from "./constants";

export default function SettingsPage() {
    const [apiKey, setApiKey] = useState("");
    const [systemPrompt, setSystemPrompt] = useState(DEFAULT_MASTER_PROMPT);
    const [loading, setLoading] = useState(true);

    // --- Analytics States ---
    const [gaId, setGaId] = useState("");
    const [gscCode, setGscCode] = useState("");
    const [fbPixel, setFbPixel] = useState("");

    // --- AdSense States ---
    const [adsPubId, setAdsPubId] = useState("");
    const [adsSidebar, setAdsSidebar] = useState("");
    const [adsInArticle, setAdsInArticle] = useState("");
    const [adsEnabled, setAdsEnabled] = useState(false);

    useEffect(() => {
        // Sayfa açılınca veritabanından ayarları çek
        async function loadSettings() {
            const settings = await getSystemSettings();
            if (settings) {
                setApiKey(settings.apiKey || "");
                setSystemPrompt(settings.systemPrompt || DEFAULT_MASTER_PROMPT);
                setGaId(settings.googleAnalyticsId || "");
                setGscCode(settings.googleSearchConsole || "");
                setFbPixel(settings.facebookPixelId || "");

                // AdSense Load
                setAdsPubId(settings.adsensePublisherId || "");
                setAdsSidebar(settings.adsenseSidebarSlotId || "");
                setAdsInArticle(settings.adsenseInArticleSlotId || "");
                setAdsEnabled(settings.adsenseEnabled || false);
            }
            setLoading(false);
        }
        loadSettings();
    }, []);

    const handleSave = async () => {
        const result = await updateSystemSettings({
            apiKey,
            systemPrompt,
            googleAnalyticsId: gaId,
            googleSearchConsole: gscCode,
            facebookPixelId: fbPixel,
            // AdSense Save
            adsensePublisherId: adsPubId,
            adsenseSidebarSlotId: adsSidebar,
            adsenseInArticleSlotId: adsInArticle,
            adsenseEnabled: adsEnabled
        });
        if (result.success) {
            toast.success("Ayarlar başarıyla veritabanına kaydedildi! ✅");
        } else {
            toast.error("Hata: Ayarlar kaydedilemedi.");
        }
    };

    if (loading) return <div className="p-8 flex items-center gap-3"><div className="w-5 h-5 border-2 border-gray-300 border-t-hc-blue rounded-full animate-spin"></div> Ayarlar yükleniyor...</div>;

    return (
        <div className="min-h-screen bg-[#f8f9fa] font-sans p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Sistem Ayarları</h1>
                <p className="text-sm text-gray-500 mb-8">Yapay zeka yapılandırması, SEO araçları, reklamlar ve veritabanı ayarları.</p>

                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Key className="w-5 h-5 text-hc-blue" />
                        <h2 className="font-bold text-gray-700">Gemini API Yapılandırması</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Gemini API Anahtarı (API Key)</label>
                            <input
                                type="password"
                                placeholder="AIzaSy..."
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded text-sm outline-none focus:border-hc-blue font-mono"
                            />
                            <p className="text-[10px] text-gray-400 mt-1">Google AI Studio'dan aldığınız anahtarı buraya girin.</p>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Master System Prompt (v3.0)</label>
                            <textarea
                                rows={8}
                                value={systemPrompt}
                                onChange={(e) => setSystemPrompt(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded text-sm outline-none focus:border-hc-blue font-mono text-xs leading-relaxed"
                            />
                        </div>
                    </div>
                </div>

                {/* --- ANALYTICS & SEO PANEL --- */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Activity className="w-5 h-5 text-green-600" />
                        <h2 className="font-bold text-gray-700">Analitik ve İzleme Kodları</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Google Analytics ID (G-XXXXX)</label>
                            <input
                                type="text"
                                placeholder="G-123456789"
                                value={gaId}
                                onChange={(e) => setGaId(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded text-sm outline-none focus:border-green-500 font-mono"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Search Console Kodu</label>
                            <input
                                type="text"
                                placeholder="Google site verification code"
                                value={gscCode}
                                onChange={(e) => setGscCode(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded text-sm outline-none focus:border-green-500 font-mono"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Facebook Pixel ID (Opsiyonel)</label>
                            <input
                                type="text"
                                placeholder="123456789012345"
                                value={fbPixel}
                                onChange={(e) => setFbPixel(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded text-sm outline-none focus:border-green-500 font-mono"
                            />
                        </div>
                    </div>
                </div>

                {/* --- ADVANCED ADVERTISING (ADSENSE) --- */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <DollarSign className="w-32 h-32" />
                    </div>

                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-yellow-600" />
                            <h2 className="font-bold text-gray-700">Google AdSense / Reklam Yönetimi</h2>
                        </div>

                        <label className="flex items-center cursor-pointer select-none">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    className="sr-only"
                                    checked={adsEnabled}
                                    onChange={(e) => setAdsEnabled(e.target.checked)}
                                />
                                <div className={`block w-14 h-8 rounded-full transition-colors ${adsEnabled ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${adsEnabled ? 'transform translate-x-6' : ''}`}></div>
                            </div>
                            <div className="ml-3 text-sm font-bold text-gray-600">
                                {adsEnabled ? "Reklamlar AKTİF" : "Reklamlar KAPALI"}
                            </div>
                        </label>
                    </div>

                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-opacity ${adsEnabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-500 mb-1">Yayıncı Kimliği (Publisher ID)</label>
                            <input
                                type="text"
                                placeholder="pub-1234567890123456"
                                value={adsPubId}
                                onChange={(e) => setAdsPubId(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded text-sm outline-none focus:border-yellow-500 font-mono"
                            />
                            <p className="text-[10px] text-gray-400 mt-1">Google AdSense panelinizde bulabileceğiniz `pub-` ile başlayan kimlik.</p>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Sidebar Reklam ID (Slot ID)</label>
                            <input
                                type="text"
                                placeholder="1234567890"
                                value={adsSidebar}
                                onChange={(e) => setAdsSidebar(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded text-sm outline-none focus:border-yellow-500 font-mono"
                            />
                            <p className="text-[10px] text-gray-400 mt-1">Yan menüdeki kare reklam (300x250) için Slot ID.</p>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Yazı İçi Reklam ID (In-Article)</label>
                            <input
                                type="text"
                                placeholder="0987654321"
                                value={adsInArticle}
                                onChange={(e) => setAdsInArticle(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded text-sm outline-none focus:border-yellow-500 font-mono"
                            />
                            <p className="text-[10px] text-gray-400 mt-1">Makale metninin ortasında çıkan yatay reklam ID'si.</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mb-12">
                    <button
                        onClick={handleSave}
                        className="bg-hc-blue text-white px-6 py-3 rounded font-bold text-sm hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md"
                    >
                        <Save className="w-5 h-5" />
                        Tüm Ayarları Kaydet
                    </button>
                </div>

                {/* Database Info Box */}
                <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                    <div className="flex items-start gap-3">
                        <Database className="w-6 h-6 text-yellow-600 mt-1" />
                        <div>
                            <h3 className="font-bold text-yellow-800 mb-1">Veritabanı Durumu</h3>
                            <p className="text-sm text-yellow-700 mb-3 leading-relaxed">
                                Sistemi hosting sunucunuza (VPS, VDS, vb.) yerleştirdiğinizde yazıların, kullanıcıların ve ayarların kaybolmaması için <strong>harici bir veritabanına</strong> ihtiyacınız olacaktır.
                            </p>
                            <div className="space-y-4">
                                <p className="text-xs font-bold text-yellow-800">Önerilen Veritabanları:</p>
                                <div className="flex gap-2 flex-wrap mb-4">
                                    <span className="bg-white/60 text-yellow-900 px-3 py-1 rounded text-xs font-bold border border-yellow-300">PostgreSQL (En Kararlı)</span>
                                    <span className="bg-white/60 text-yellow-900 px-3 py-1 rounded text-xs font-bold border border-yellow-300">MongoDB (Esnek)</span>
                                    <span className="bg-white/60 text-yellow-900 px-3 py-1 rounded text-xs font-bold border border-yellow-300">MySQL / MariaDB</span>
                                </div>

                                <div className="pt-4 border-t border-yellow-200">
                                    <p className="text-xs text-yellow-800 mb-2">Eski verilerinizi mi taşıyacaksınız?</p>
                                    <Link href="/admin/import" className="inline-flex items-center gap-2 text-sm font-bold text-yellow-900 bg-white/50 border border-yellow-300 px-4 py-2 rounded hover:bg-white transition-colors">
                                        <Database className="w-4 h-4" />
                                        WordPress İçe Aktarma Aracını Başlat
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
