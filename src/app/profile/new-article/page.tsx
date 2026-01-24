"use client";

import React, { useState } from "react";
import {
    ArrowLeft,
    Save,
    Send,
    Image as ImageIcon,
    Bold,
    Italic,
    List,
    Link as LinkIcon,
    MoreVertical,
    X
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function NewArticlePage() {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("saglikli-yasam");
    const [content, setContent] = useState("");
    const [coverImage, setCoverImage] = useState<string | null>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Mock upload - just reading file as URL for preview
        if (e.target.files && e.target.files[0]) {
            const url = URL.createObjectURL(e.target.files[0]);
            setCoverImage(url);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] font-sans">

            {/* Top Navigation Bar */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/profile" className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block">Yazar Paneli</span>
                        <span className="text-sm font-bold text-gray-800">Yeni Yazı Oluştur</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 font-medium hidden sm:inline">Son kayıt: Az önce</span>
                    <button className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md font-medium text-sm transition-colors">
                        <Save className="w-4 h-4" />
                        Taslak Kaydet
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-white bg-hc-blue hover:bg-blue-700 rounded-md font-bold text-sm transition-colors shadow-sm">
                        <Send className="w-4 h-4" />
                        Yayınla
                    </button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto py-8 px-4 grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Main Editor Area */}
                <div className="lg:col-span-3 space-y-6">

                    {/* Cover Image Upload Area */}
                    <div className="group relative w-full h-[200px] bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-hc-blue hover:text-hc-blue hover:bg-blue-50/10 transition-all cursor-pointer overflow-hidden">
                        {coverImage ? (
                            <>
                                <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                                <button
                                    onClick={() => setCoverImage(null)}
                                    className="absolute top-2 right-2 bg-white/80 p-1 rounded-full text-red-500 hover:bg-white"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </>
                        ) : (
                            <>
                                <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                                <span className="text-sm font-medium">Kapak Görseli Yükle</span>
                                <span className="text-xs opacity-60 mt-1">Sürükle bırak veya tıkla (Max 5MB)</span>
                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />
                            </>
                        )}
                    </div>

                    {/* Title Input */}
                    <textarea
                        placeholder="Yazı Başlığı..."
                        className="w-full text-4xl font-serif font-bold text-gray-800 placeholder-gray-300 outline-none bg-transparent resize-none overflow-hidden leading-tight"
                        rows={2}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    {/* Editor Toolbar (Mock) */}
                    <div className="sticky top-[70px] z-30 bg-white border border-gray-200 rounded-md shadow-sm flex items-center gap-1 p-1">
                        <ToolButton icon={<Bold className="w-4 h-4" />} />
                        <ToolButton icon={<Italic className="w-4 h-4" />} />
                        <div className="w-px h-6 bg-gray-200 mx-1"></div>
                        <ToolButton icon={<List className="w-4 h-4" />} />
                        <ToolButton icon={<LinkIcon className="w-4 h-4" />} />
                        <div className="w-px h-6 bg-gray-200 mx-1"></div>
                        <select className="text-sm border-none outline-none text-gray-600 font-medium bg-transparent cursor-pointer hover:bg-gray-50 rounded px-2 h-8">
                            <option>Normal Metin</option>
                            <option>Başlık 2</option>
                            <option>Başlık 3</option>
                        </select>
                    </div>

                    {/* Content Area */}
                    <textarea
                        className="w-full min-h-[500px] text-lg text-gray-600 leading-relaxed outline-none resize-none font-serif placeholder-gray-300"
                        placeholder="Hikayenizi anlatmaya başlayın..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />

                </div>

                {/* Sidebar Settings */}
                <div className="lg:col-span-1 space-y-6">

                    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wide">Yazı Ayarları</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Kategori</label>
                                <select
                                    className="w-full p-2 border border-gray-300 rounded text-sm bg-white text-gray-700 outline-none focus:border-hc-blue"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <option value="saglikli-yasam">Sağlıklı Yaşam</option>
                                    <option value="yas-ve-gelisim">Yaş ve Gelişim</option>
                                    <option value="guvenlik">Güvenlik & Önleme</option>
                                    <option value="aile-hayati">Aile Hayatı</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Etiketler</label>
                                <input
                                    type="text"
                                    placeholder="Örn: bebek, aşı, ateş"
                                    className="w-full p-2 border border-gray-300 rounded text-sm outline-none focus:border-hc-blue"
                                />
                                <p className="text-[10px] text-gray-400 mt-1">Virgül ile ayırın.</p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Okuma Süresi</label>
                                <div className="flex items-center gap-2">
                                    <input type="number" defaultValue={5} className="w-16 p-2 border border-gray-300 rounded text-sm outline-none" />
                                    <span className="text-sm text-gray-500">dakika</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50/50 p-5 rounded-lg border border-blue-100">
                        <h3 className="font-bold text-hc-blue mb-2 text-sm">İpuçları</h3>
                        <ul className="text-xs text-gray-600 space-y-2 list-disc list-inside">
                            <li>Kısa ve ilgi çekici başlıklar kullanın.</li>
                            <li>Önemli bilgileri vurgu kutuları ile belirtin.</li>
                            <li>Uzun paragraflardan kaçının.</li>
                            <li>Görsel kullanımına özen gösterin.</li>
                        </ul>
                    </div>

                </div>

            </div>
        </div>
    );
}

function ToolButton({ icon }: { icon: React.ReactNode }) {
    return (
        <button className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors">
            {icon}
        </button>
    )
}
