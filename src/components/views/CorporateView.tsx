
import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { corporateContent } from "@/lib/content-data";

export default function CorporateView({ slug }: { slug: string }) {
    const data = corporateContent[slug];

    if (!data) {
        return null;
    }

    return (
        <div className="min-h-screen bg-white font-sans text-[#333]">
            {/* Container */}
            <div className="max-w-[1100px] mx-auto px-4 py-8 flex flex-col md:flex-row gap-12">

                {/* Left Sidebar Menu (Reused for consistency) */}
                <div className="w-full md:w-1/4 shrink-0 hidden md:block">
                    <h2 className="text-[#9ec446] font-serif text-2xl mb-4 border-b border-[#efefef] pb-2">Kurumsal</h2>
                    <ul className="space-y-3 text-sm font-bold text-[#555]">
                        <li><Link href="/hakkimizda" className={`block py-1 hover:text-hc-orange ${slug === 'hakkimizda' ? 'text-hc-orange border-l-4 border-hc-orange pl-2' : ''}`}>Hakkımızda</Link></li>
                        <li><Link href="/iletisim" className={`block py-1 hover:text-hc-orange ${slug === 'iletisim' ? 'text-hc-orange border-l-4 border-hc-orange pl-2' : ''}`}>İletişim</Link></li>
                        <li><Link href="/editorial" className={`block py-1 hover:text-hc-orange ${slug === 'editorial' ? 'text-hc-orange border-l-4 border-hc-orange pl-2' : ''}`}>Editoryal İlkeler</Link></li>
                        <li><Link href="/sponsors" className="block py-1 hover:text-hc-orange">Sponsorlarımız</Link></li>
                    </ul>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    {/* Breadcrumb */}
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-6 flex items-center gap-1 font-sans">
                        <Link href="/" className="hover:text-hc-orange">Anasayfa</Link>
                        <ChevronRight className="w-3 h-3" />
                        <span>Kurumsal</span>
                        <ChevronRight className="w-3 h-3" />
                        <span className="font-bold text-gray-700">{data.title}</span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-serif text-[#333] mb-8 pb-4 border-b border-gray-100">{data.title}</h1>

                    <div className="prose prose-sm md:prose-base max-w-none text-gray-600 leading-relaxed">
                        {data.content}
                    </div>
                </div>
            </div>
        </div>
    );
}
