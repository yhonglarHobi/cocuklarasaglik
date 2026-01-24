"use client";

import React, { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
    onSearch: (query: string) => void;
}

export function Header({ onSearch }: HeaderProps) {
    const [query, setQuery] = useState("");

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQuery(val);
        onSearch(val);
    };

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40 shadow-sm">
            {/* Left: Breadcrumbs or Title (Placeholder) */}
            <div className="flex items-center text-gray-800 font-semibold text-lg">
                Kütüphane
            </div>

            {/* Center: Smart Search Bar (Monday Style) */}
            <div className="flex-1 max-w-xl mx-4 relative group">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Search className="w-4 h-4 text-gray-400 group-focus-within:text-monday-blue transition-colors" />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={handleSearch}
                    placeholder="Makale, semptom veya ilaç ara..."
                    className="w-full bg-monday-light-grey border border-transparent focus:border-monday-blue focus:bg-white rounded-full py-2 pl-10 pr-4 text-sm transition-all outline-none"
                />
                {query && (
                    <button onClick={() => { setQuery(""); onSearch(""); }} className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600">
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Right: User / Settings */}
            <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                    <Filter className="w-4 h-4" />
                    <span>Filtrele</span>
                </button>
                <div className="w-8 h-8 rounded-full bg-monday-blue text-white flex items-center justify-center text-xs font-bold ring-2 ring-offset-2 ring-transparent hover:ring-monday-blue/20 cursor-pointer transition-all">
                    DR
                </div>
            </div>
        </header>
    );
}
