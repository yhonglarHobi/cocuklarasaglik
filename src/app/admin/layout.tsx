"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Zap,
    LayoutDashboard,
    Menu,
    Users,
    Mail,
    Settings,
    Database,
    LogOut,
    Home
} from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    // Login sayfasında sidebar gösterme
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    const menuItems = [
        { name: "Sihirbaz & İçerik", icon: Zap, href: "/admin/wizard" },
        { name: "Menü Yönetimi", icon: Menu, href: "/admin/menu" },
        { name: "Kullanıcılar", icon: Users, href: "/admin/users" },
        { name: "E-Bülten", icon: Mail, href: "/admin/newsletter" },
        { name: "Veri İçe Aktar", icon: Database, href: "/admin/import" },
        { name: "Sistem Ayarları", icon: Settings, href: "/admin/settings" },
    ];

    return (
        <div className="flex min-h-screen bg-[#f8f9fa]">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 fixed h-full z-10 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                    <div className="bg-hc-blue text-white p-2 rounded-lg">
                        <LayoutDashboard className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="font-bold text-gray-800 text-lg">Yönetim</h1>
                        <p className="text-xs text-gray-500">Çocuklara Sağlık</p>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <div className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider px-3 mt-2">Menü</div>
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? "bg-blue-50 text-hc-blue font-bold"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? "text-hc-blue" : "text-gray-400"}`} />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100 space-y-1">
                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                    >
                        <div className="w-5 h-5 flex items-center justify-center">
                            <Home className="w-4 h-4" />
                        </div>
                        Siteyi Görüntüle
                    </Link>
                    <button
                        onClick={() => {
                            document.cookie = "admin_session=; path=/; max-age=0";
                            window.location.href = "/admin/login";
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 text-left"
                    >
                        <div className="w-5 h-5 flex items-center justify-center">
                            <LogOut className="w-4 h-4" />
                        </div>
                        Çıkış Yap
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 md:ml-64 min-h-screen">
                {children}
            </main>
        </div>
    );
}
