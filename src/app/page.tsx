import React from "react";
import { prisma } from "@/lib/prisma";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { ChevronRight, Clock } from "lucide-react";
import Link from "next/link";
import { AdPlaceholder } from "@/components/ui/AdPlaceholder";
import { HeroWebinar } from "@/components/home/HeroWebinar";

const DEFAULT_CATEGORIES = [
    "Hamilelik",
    "Bebek",
    "Yürümeye Başlayan (Toddler)",
    "Okul Öncesi",
    "İlkokul Çağı",
    "Ergenlik",
    "Genç Yetişkin"
];

// ... (Articles mock data remains if you want, or remove if unused)

export default async function Homepage() {
    // 1. Fetch Real Articles from DB
    const dbArticles = await prisma.article.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { category: true }
    });

    // 2. Fetch Categories from DB (Sync with Wizard)
    const dbCategories = await prisma.category.findMany({
        orderBy: { name: 'asc' }
    });

    // Use DB categories if exists, otherwise fallback
    const displayCategories = dbCategories.length > 0 ? dbCategories : DEFAULT_CATEGORIES.map(name => ({
        name,
        slug: name.toLowerCase()
            .replace(/ /g, "-")
            .replace(/[ğüşıöç]/g, (c: string) => ({ 'ğ': 'g', 'ü': 'u', 'ş': 's', 'ı': 'i', 'ö': 'o', 'ç': 'c' }[c] || c))
            .replace(/[()]/g, "")
    }));

    // 2. Map DB articles to UI format
    const realArticles = dbArticles.map(article => ({
        id: article.id,
        title: article.title,
        summary: article.excerpt || article.content.substring(0, 150) + "...",
        category: "health" as const, // You might want dynamic mapping here
        readTime: "5 dk",
        ageGroup: article.category?.name || "Genel",
        isDoctorApproved: true,
        image: article.imageUrl || undefined
    }));

    // Use Mock if DB is empty, otherwise use Real
    const headlines = realArticles.length > 0 ? realArticles.slice(0, 4) : mockArticles;
    const recentArticles = realArticles.length > 4 ? realArticles.slice(4) : [];

    return (
        <div className="font-sans">
            {/* Hero Heading */}
            <div className="text-center py-6">
                <h1 className="text-2xl md:text-5xl text-[#5c4a3d] font-serif tracking-tight px-4">Türkiye'nin En Kapsamlı Çocuk Sağlığı Portalı</h1>
            </div>

            {/* Hero Banner Section (Client Component) */}
            <HeroWebinar />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 px-4 pb-12">

                {/* Column 1: Ages & Stages (Left Sidebar) */}
                <div className="flex flex-col gap-4 lg:col-span-1">
                    <h3 className="text-lg font-bold text-hc-blue uppercase border-b-2 border-hc-green pb-1 mb-2">Yaş ve Gelişim</h3>
                    {displayCategories.map((cat: any, i: number) => (
                        <Link key={i} href={`/category/${cat.slug}`}>
                            <div className="flex justify-between items-center text-gray-600 hover:text-hc-orange cursor-pointer border-b border-gray-100 py-3 transition-colors group">
                                <span className="group-hover:translate-x-1 transition-transform">{cat.name}</span>
                                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-hc-orange" />
                            </div>
                        </Link>
                    ))}

                    {/* Ad Placeholder (Sidebar) */}
                    <div className="mt-8">
                        <AdPlaceholder height="250px" label="Sponsorlu Alan" />
                    </div>
                </div>

                {/* Column 2: Latest Articles (Center/Right Content) */}
                <div className="lg:col-span-3">
                    <div className="flex items-center justify-between border-b-2 border-hc-orange mb-6 pb-1">
                        <h3 className="text-xl font-bold text-hc-blue uppercase">Öne Çıkan Makaleler</h3>
                        <Link href="/makaleler" className="text-xs font-bold text-hc-orange cursor-pointer hover:underline">TÜMÜNÜ GÖR &rarr;</Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {headlines.slice(0, 2).map((article: any) => (
                            <ArticleCard key={article.id} article={article} />
                        ))}
                    </div>

                    {/* Middle Banner: Seasonal Guide */}
                    <div className="my-8 relative rounded-xl overflow-hidden bg-gradient-to-r from-[#9ec446] to-[#7a9c32] text-white shadow-lg">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
                        <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="text-center md:text-left">
                                <span className="bg-white/20 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded mb-3 inline-block text-white">Mevsimsel Rehber</span>
                                <h3 className="text-2xl md:text-3xl font-serif font-bold mb-2 text-white">Kış Hastalıklarından Korunma</h3>
                                <p className="text-green-50 text-sm max-w-md">Influenza, RSV ve soğuk algınlığı... Çocuğunuzu kış aylarında nasıl korursunuz? Bağışıklık güçlendiren tarifler ve uzman önerileri.</p>
                            </div>
                            <button className="bg-white text-[#5c8a00] px-6 py-3 rounded font-bold text-sm shadow-sm hover:bg-green-50 transition-colors shrink-0">
                                Rehberi İncele
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {headlines.slice(2, 4).map((article: any) => (
                            <ArticleCard key={article.id} article={article} />
                        ))}

                        {/* More Articles Placeholder */}
                        <div className="col-span-1 md:col-span-2 mt-4 p-4 bg-gray-50 border border-gray-200 text-center rounded-sm">
                            <p className="text-gray-500 text-sm mb-2">Daha fazla içeriğe mi ihtiyacınız var?</p>
                            <Link href="/makaleler" className="text-hc-blue font-bold text-sm hover:underline">Kütüphaneye Git</Link>
                        </div>
                    </div>
                </div>

            </div>

            {/* GÜNCEL İÇERİKLER SECTION (New Request) */}
            <div className="bg-gray-50 border-t border-gray-200 py-12">
                <div className="max-w-[1100px] mx-auto px-4">
                    <div className="flex items-center gap-2 mb-6">
                        <Clock className="w-5 h-5 text-hc-orange" />
                        <h2 className="text-2xl font-serif font-bold text-[#5c4a3d]">Güncel İçerikler</h2>
                    </div>

                    {recentArticles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {recentArticles.map((article: any) => (
                                <ArticleCard key={article.id} article={article} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm">Henüz yeni eklenen güncel içerik yok.</p>
                    )}
                </div>
            </div>

        </div>
    );
}
