"use client";

import React, { useState } from "react";
import {
    UserPlus,
    Search,
    Filter,
    MoreHorizontal,
    Briefcase
} from "lucide-react";

export default function UserManagementPage() {
    const [showModal, setShowModal] = useState(false);
    const [newTitle, setNewTitle] = useState("");

    // Mock List of Specialized Roles
    const authorTitles = [
        "Pediatrist",
        "Çocuk Cerrahı",
        "Emzirme Danışmanı",
        "Ebe / Hemşire",
        "Ergoterapist",
        "Çocuk Psikoloğu",
        "Beslenme Uzmanı (Diyetisyen)",
        "Fizyoterapist",
        "Dil ve Konuşma Terapisti"
    ];

    const users = [
        { name: "Dr. Ayşe Yılmaz", email: "ayse@example.com", role: "Yazar", title: "Pediatrist", status: "Aktif" },
        { name: "Selin Kaya", email: "selin@example.com", role: "Yazar", title: "Emzirme Danışmanı", status: "Aktif" },
        { name: "Burak Demir", email: "burak@example.com", role: "Yazar", title: "Ergoterapist", status: "Beklemede" },
    ];

    return (
        <div className="min-h-screen bg-[#f8f9fa] font-sans p-8">

            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Kullanıcı Yönetimi</h1>
                        <p className="text-sm text-gray-500">Yazar, doktor ve uzman profillerini yönetin.</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-hc-blue text-white px-4 py-2 rounded-md font-bold text-sm flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        <UserPlus className="w-4 h-4" />
                        Yeni Uzman Ekle
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                        <input placeholder="İsim veya e-posta ara..." className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded text-sm outline-none focus:border-hc-blue" />
                    </div>
                    <button className="px-4 py-2 border border-gray-200 rounded text-sm font-medium text-gray-600 flex items-center gap-2 hover:bg-gray-50">
                        <Filter className="w-4 h-4" />
                        Filtrele
                    </button>
                </div>

                {/* Pending Approvals Section */}
                <div className="mb-8">
                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Onay Bekleyen Başvurular (2)</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 font-bold">DR</div>
                                <div>
                                    <h3 className="font-bold text-gray-800 text-sm">Dr. Kerem Yılmaz</h3>
                                    <p className="text-xs text-gray-500">Çocuk Psikiyatristi • kerem.dr@mail.com</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 bg-white border border-gray-300 rounded text-xs font-bold text-gray-500 hover:text-red-600 hover:border-red-200">Reddet</button>
                                <button className="px-3 py-1 bg-green-500 text-white rounded text-xs font-bold hover:bg-green-600 shadow-sm">Onayla</button>
                            </div>
                        </div>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 font-bold">UZ</div>
                                <div>
                                    <h3 className="font-bold text-gray-800 text-sm">Elif Şahin</h3>
                                    <p className="text-xs text-gray-500">Diyetisyen • elif.dyt@mail.com</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 bg-white border border-gray-300 rounded text-xs font-bold text-gray-500 hover:text-red-600 hover:border-red-200">Reddet</button>
                                <button className="px-3 py-1 bg-green-500 text-white rounded text-xs font-bold hover:bg-green-600 shadow-sm">Onayla</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-xs">
                            <tr>
                                <th className="p-4">İsim / E-posta</th>
                                <th className="p-4">Rol</th>
                                <th className="p-4">Uzmanlık Alanı</th>
                                <th className="p-4">Durum</th>
                                <th className="p-4 text-right">İşlem</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map((user, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-gray-800">{user.name}</div>
                                        <div className="text-xs text-gray-500">{user.email}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold">{user.role}</span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2 text-gray-700 font-medium">
                                            <Briefcase className="w-3 h-3 text-gray-400" />
                                            {user.title}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${user.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>

            {/* Add User Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Yeni Uzman Ekle</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Ad Soyad</label>
                                <input className="w-full p-2 border border-gray-300 rounded text-sm outline-none focus:border-hc-blue" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">E-posta</label>
                                <input type="email" className="w-full p-2 border border-gray-300 rounded text-sm outline-none focus:border-hc-blue" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Uzmanlık Alanı / Ünvan</label>
                                <select
                                    className="w-full p-2 border border-gray-300 rounded text-sm bg-white outline-none focus:border-hc-blue"
                                    onChange={(e) => setNewTitle(e.target.value)}
                                >
                                    <option value="">Seçiniz...</option>
                                    {authorTitles.map((title, i) => (
                                        <option key={i} value={title}>{title}</option>
                                    ))}
                                    <option value="other">Diğer (Belirtiniz)</option>
                                </select>
                            </div>

                            {newTitle === "other" && (
                                <div>
                                    <input placeholder="Özel Ünvan Giriniz" className="w-full p-2 border border-blue-300 bg-blue-50 rounded text-sm outline-none text-blue-900 placeholder-blue-300" />
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 mt-8">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-gray-600 font-bold text-sm hover:bg-gray-100 rounded"
                            >
                                İptal
                            </button>
                            <button className="px-4 py-2 bg-hc-blue text-white font-bold text-sm rounded hover:bg-blue-700 shadow-sm">
                                Kaydet
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
