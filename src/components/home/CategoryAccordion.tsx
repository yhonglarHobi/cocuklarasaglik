"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown } from "lucide-react";
import { AdPlaceholder } from "@/components/ui/AdPlaceholder";

interface Category {
    name: string;
    slug: string;
}

interface CategoryAccordionProps {
    categories: Category[];
}

export function CategoryAccordion({ categories }: CategoryAccordionProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex flex-col gap-4 lg:col-span-1">
            {/* Accordion Header - Only clickable on mobile */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between text-lg font-bold text-hc-blue uppercase border-b-2 border-hc-green pb-1 mb-2 lg:cursor-default"
            >
                <span>Yaş ve Gelişim</span>
                <ChevronDown
                    className={`w-5 h-5 transition-transform lg:hidden ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Accordion Content - Always open on desktop, toggleable on mobile */}
            <div className={`${isOpen ? 'block' : 'hidden'} lg:block space-y-0`}>
                {categories.map((cat, i) => (
                    <Link key={i} href={`/category/${cat.slug}`}>
                        <div className="flex justify-between items-center text-gray-600 hover:text-hc-orange cursor-pointer border-b border-gray-100 py-3 transition-colors group">
                            <span className="group-hover:translate-x-1 transition-transform">{cat.name}</span>
                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-hc-orange" />
                        </div>
                    </Link>
                ))}
            </div>

            {/* Ad Placeholder (Sidebar) */}
            <div className="mt-8 hidden lg:block">
                <AdPlaceholder height="250px" label="Sponsorlu Alan" />
            </div>
        </div>
    );
}
