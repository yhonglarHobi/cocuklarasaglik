"use client";

import React, { useState } from "react";
import {
    Menu,
    Move,
    Plus,
    Trash2,
    Edit2,
    Save,
    X,
    ExternalLink
} from "lucide-react";

export default function MenuManagementPage() {
    const [menuItems, setMenuItems] = useState([
        { id: 1, name: "Yaş ve Gelişim", href: "/yas-ve-gelisim", order: 1 },
        { id: 2, name: "Sağlıklı Yaşam", href: "/saglikli-yasam", order: 2 },
        { id: 3, name: "Güvenlik & Önleme", href: "/guvenlik", order: 3 },
        { id: 4, name: "Aile Hayatı", href: "/aile-hayati", order: 4 },
        { id: 5, name: "Sağlık Sorunları", href: "/saglik-sorunlari", order: 5 },
        { id: 6, name: "Haberler", href: "/haberler", order: 6 },
        { id: 7, name: "İpuçları & Araçlar", href: "/ipuclari", order: 7 },
        { id: 8, name: "Hakkımızda", href: "/hakkimizda", order: 8 },
    ]);

    const [isAdding, setIsAdding] = useState(false);
    const [newMenu, setNewMenu] = useState({ name: "", href: "" });
    const [isSaving, setIsSaving] = useState(false);

    // Drag simulation (just swapping logic for UI demo without dnd library)
    const moveItem = (index: number, direction: 'up' | 'down') => {
        const newItems = [...menuItems];
        if (direction === 'up' && index > 0) {
            [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
        } else if (direction === 'down' && index < newItems.length - 1) {
            [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
        }
        setMenuItems(newItems);
    };

    const deleteItem = (id: number) => {
        setMenuItems(menuItems.filter(item => item.id !== id));
    };

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 1000);
    };

    const addNewItem = () => {
        if (newMenu.name && newMenu.href) {
            setMenuItems([...menuItems, { id: Date.now(), name: newMenu.name, href: newMenu.href, order: menuItems.length + 1 }]);
            setNewMenu({ name: "", href: "" });
            setIsAdding(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] font-sans p-8">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-[#5c4a3d] flex items-center gap-3">
                            <Menu className="w-8 h-8 text-hc-orange" />
                            Menü Yönetimi
                        </h1>
                        <p className="text-gray-500 mt-2 ml-1">Site üst menüsünü düzenleyin, sıralayın veya yeni linkler ekleyin.</p>
                    </div>
                    <button
                        onClick={handleSave}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold shadow-sm hover:bg-green-700 flex items-center gap-2 transition-colors"
                    >
                        {isSaving ? "Kaydediliyor..." : (
                            <>
                                <Save className="w-4 h-4" />
                                Değişiklikleri Kaydet
                            </>
                        )}
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

                    {/* List Header */}
                    <div className="bg-gray-50 p-4 border-b border-gray-200 flex items-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                        <span className="w-12 text-center">Sıra</span>
                        <span className="flex-1">Görünecek İsim</span>
                        <span className="flex-1">Bağlantı (URL)</span>
                        <span className="w-24 text-right">İşlemler</span>
                    </div>

                    {/* Menu Items */}
                    <div className="divide-y divide-gray-100">
                        {menuItems.map((item, index) => (
                            <div key={item.id} className="p-4 flex items-center hover:bg-blue-50/10 transition-colors group">

                                {/* Drag Handle / Order */}
                                <div className="w-12 flex flex-col items-center gap-1 text-gray-400">
                                    <button onClick={() => moveItem(index, 'up')} disabled={index === 0} className="hover:text-hc-blue disabled:opacity-30">▲</button>
                                    <button onClick={() => moveItem(index, 'down')} disabled={index === menuItems.length - 1} className="hover:text-hc-blue disabled:opacity-30">▼</button>
                                </div>

                                {/* Name Input */}
                                <div className="flex-1 pr-4">
                                    <div className="font-bold text-gray-700 flex items-center gap-2">
                                        {item.name}
                                        <Edit2 className="w-3 h-3 text-gray-300 cursor-pointer hover:text-hc-blue opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </div>

                                {/* Href Input */}
                                <div className="flex-1 pr-4">
                                    <div className="text-sm text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded border border-gray-200 inline-flex items-center gap-2">
                                        {item.href}
                                        <ExternalLink className="w-3 h-3 text-gray-400" />
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="w-24 flex justify-end">
                                    <button
                                        onClick={() => deleteItem(item.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add New Item Row */}
                    {isAdding ? (
                        <div className="p-4 bg-blue-50 border-t border-blue-100 animate-in slide-in-from-top-2">
                            <div className="flex gap-4 items-center">
                                <span className="w-12"></span>
                                <input
                                    placeholder="Menü Adı (örn: Özel Dosyalar)"
                                    className="flex-1 p-2 border border-blue-200 rounded text-sm outline-none focus:ring-2 focus:ring-blue-200"
                                    value={newMenu.name}
                                    onChange={(e) => setNewMenu({ ...newMenu, name: e.target.value })}
                                />
                                <input
                                    placeholder="/ozel-dosyalar"
                                    className="flex-1 p-2 border border-blue-200 rounded text-sm outline-none focus:ring-2 focus:ring-blue-200"
                                    value={newMenu.href}
                                    onChange={(e) => setNewMenu({ ...newMenu, href: e.target.value })}
                                />
                                <div className="w-24 flex justify-end gap-2">
                                    <button onClick={() => setIsAdding(false)} className="p-2 text-gray-500 hover:bg-gray-200 rounded"><X className="w-4 h-4" /></button>
                                    <button onClick={addNewItem} className="p-2 bg-hc-blue text-white rounded hover:bg-blue-700"><Save className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 bg-gray-50 border-t border-gray-200 text-center">
                            <button
                                onClick={() => setIsAdding(true)}
                                className="text-hc-blue font-bold text-sm flex items-center justify-center gap-2 hover:underline"
                            >
                                <Plus className="w-4 h-4" />
                                Yeni Menü Öğesi Ekle
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
