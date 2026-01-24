"use client";

import React, { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import Link from "next/link";

const defaultNavLinks = [
    { name: "Yaş ve Gelişim", href: "/yas-ve-gelisim" },
    { name: "Sağlıklı Yaşam", href: "/saglikli-yasam" },
    { name: "Haberler", href: "/haberler" },
];

interface NavbarProps {
    menuItems?: { name: string; href: string }[];
}

export function Navbar({ menuItems }: NavbarProps) {
    const links = (menuItems && menuItems.length > 0) ? menuItems : defaultNavLinks;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex flex-col w-full font-sans relative">
            {/* Top Bar (Sponsors / Login / Lang) */}
            <div className="bg-[#f2f2f2] h-10 border-b border-gray-200">
                <div className="max-w-[1100px] mx-auto h-full flex items-center justify-between px-4 text-xs font-bold text-gray-500 uppercase tracking-wide relative">
                    <Link href="/sponsors" className="bg-[#dcdcdc] h-full flex items-center px-6 text-gray-600 truncate hover:bg-gray-300 transition-colors cursor-pointer">
                        SPONSORLARIMIZ
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-hc-red cursor-pointer hover:underline hidden sm:inline">GİRİŞ YAP | KAYIT OL</Link>
                        {/* Circle Language or Feature Badge */}
                        <div className="absolute top-0 right-0 h-16 w-32 bg-hc-orange rounded-b-full shadow-md flex flex-col items-center justify-center text-white cursor-pointer z-20 hover:bg-orange-600 transition-colors transform translate-x-4 hidden md:flex">
                            <span className="text-[10px] italic font-serif lowercase opacity-90">uzman</span>
                            <span className="text-lg font-bold leading-none">GÖRÜŞÜ</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Header Area */}
            <div className="max-w-[1100px] mx-auto w-full py-4 md:py-8 px-4 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">

                {/* Mobile Header Row: Logo + Hamburger */}
                <div className="w-full flex items-center justify-between md:w-auto md:justify-start">
                    {/* Logo Section */}
                    <Link href="/" className="flex flex-col items-start cursor-pointer hover:opacity-90">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-10 md:w-10 md:h-14 bg-hc-orange rounded-tl-2xl rounded-br-2xl md:rounded-tl-3xl md:rounded-br-3xl flex items-center justify-center text-white shrink-0">
                                {/* Abstract Mother/Child Icon */}
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 md:w-6 md:h-6">
                                    <circle cx="12" cy="8" r="4" />
                                    <path d="M6 20v-2a6 6 0 0 1 12 0v2" />
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl md:text-3xl text-hc-orange font-normal leading-none font-sans tracking-tight">cocuklara<span className="font-bold">saglik.com</span></span>
                                <span className="text-[8px] md:text-[10px] text-gray-500 mt-1">Pediatristler Destekli. Ebeveynler Tarafından Güvenilen.</span>
                            </div>
                        </div>
                    </Link>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-3 text-gray-600"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Search & Donate (Hidden on very small screens or moved) */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="flex h-10 w-full md:w-80 border border-gray-300 rounded-sm overflow-hidden">
                        <input
                            type="text"
                            placeholder="Hastalık, aşı, belirti arayın..."
                            className="flex-1 px-3 text-sm outline-none text-gray-600 placeholder:text-gray-400 font-sans"
                        />
                        <button className="bg-hc-orange/70 w-10 flex items-center justify-center hover:bg-hc-orange text-white">
                            <Search className="w-4 h-4" />
                        </button>
                    </div>
                    <button className="h-10 px-6 bg-hc-blue text-white font-bold text-sm uppercase tracking-wider hover:bg-blue-800 transition-colors hidden md:block whitespace-nowrap rounded-sm">
                        BAĞIŞ YAP
                    </button>
                </div>
            </div>

            {/* Navigation Links (Desktop) */}
            <nav className="border-t border-b border-gray-200 py-3 bg-white sticky top-0 z-40 shadow-sm hidden md:block">
                <div className="max-w-[1100px] mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-bold text-[#555555] px-4">
                    {links.map((link) => (
                        <Link key={link.href} href={link.href} className="hover:text-hc-orange hover:underline decoration-2 underline-offset-4 transition-colors uppercase">
                            {link.name}
                        </Link>
                    ))}
                </div>
            </nav>

            {/* Mobile Navigation Drawer */}
            {isMobileMenuOpen && (
                <div className="bg-white border-b border-gray-200 py-4 px-4 md:hidden absolute w-full z-50 shadow-xl top-full animate-in slide-in-from-top-5">
                    <div className="flex flex-col gap-2">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="py-3 px-4 text-gray-700 font-bold hover:bg-gray-50 rounded uppercase text-sm border-b border-gray-50 last:border-0"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            href="/login"
                            className="py-3 px-4 text-hc-red font-bold hover:bg-red-50 rounded uppercase text-sm mt-2 flex items-center gap-2"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            GİRİŞ YAP | KAYIT OL
                        </Link>
                        <button className="w-full mt-4 h-12 bg-hc-blue text-white font-bold text-sm uppercase tracking-wider rounded">
                            BAĞIŞ YAP
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
