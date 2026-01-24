"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Key, Save, AlertCircle, Database } from "lucide-react";

export default function SettingsPage() {
    const [apiKey, setApiKey] = useState("");
    const [systemPrompt, setSystemPrompt] = useState(`OTONOM İÇERİK AJANI MASTER PROMPT v3.0 (TAM ENTEGRE)
SİSTEM ROLÜ VE KAYNAK YÖNETİMİ: Sen, aşağıdaki dört ana kaynağı sentezleyerek içerik üreten bir otonom sağlık ajanıısın:
- https://www.healthychildren.org/ (AAP - Klinik Rehberler)
- https://kidshealth.org/ (Nemours - Ebeveyn Dili)
- https://www.kidshealth.org.nz/ (Toplum Sağlığı Bakışı)
- https://www.aboutkidshealth.ca/ (SickKids - Teknik Derinlik)

ADIM 1: NAVİGASYON VE SEÇİM PROTOKOLÜ...`);

    useEffect(() => {
        const savedKey = localStorage.getItem("GEMINI_API_KEY");
        const savedPrompt = localStorage.getItem("SYSTEM_PROMPT");
        if (savedKey) setApiKey(savedKey);
        if (savedPrompt) setSystemPrompt(savedPrompt);
    }, []);

    return (
        <div className="min-h-screen bg-[#f8f9fa] font-sans p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Sistem Ayarları</h1>
                <p className="text-sm text-gray-500 mb-8">Yapay zeka yapılandırması ve veritabanı bağlantı ayarları.</p>

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
                                rows={12}
                                value={systemPrompt}
                                onChange={(e) => setSystemPrompt(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded text-sm outline-none focus:border-hc-blue font-mono text-xs leading-relaxed"
                            />
                            <p className="text-[10px] text-gray-400 mt-1">Ajanın davranış protokolünü buradan güncelleyebilirsiniz.</p>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={() => {
                                localStorage.setItem("GEMINI_API_KEY", apiKey);
                                localStorage.setItem("SYSTEM_PROMPT", systemPrompt);
                                alert("Ayarlar başarıyla tarayıcı hafızasına kaydedildi! ✅\n(Not: Bu ayarlar sadece bu cihazda ve tarayıcıda geçerlidir.)");
                            }}
                            className="bg-hc-blue text-white px-6 py-2 rounded font-bold text-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Ayarları Kaydet
                        </button>
                    </div>
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
