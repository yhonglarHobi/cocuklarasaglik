"use client";

import React from "react";
import Link from "next/link";
import { ArticleCard, Article } from "@/components/blog/ArticleCard";

// Mock Data (Shared with Homepage ideally, but duplicated here for simplicity)
const articles: Article[] = [
    {
        id: "1",
        title: "Yenidoğan Sarılığı: Ne Zaman Endişelenmeli?",
        summary: "Bebeklerde sık görülen fizyolojik sarılık ile patolojik sarılık arasındaki farklar ve tedavi yöntemleri.",
        category: "urgent",
        readTime: "4 dk",
        ageGroup: "Yaş ve Gelişim: Bebek",
        isDoctorApproved: true,
    },
    {
        id: "3",
        title: "Ateşli Çocuğa Yaklaşım: Evde İlk Yardım",
        summary: "38 derece ve üzeri ateş durumunda yapılması gerekenler ve ilaç kullanımı.",
        category: "health",
        readTime: "5 dk",
        ageGroup: "Sağlık Sorunları",
        isDoctorApproved: true,
    },
    {
        id: "2",
        title: "Ek Gıdaya Geçiş Rehberi",
        summary: "Katı gıdalarla tanışma süreci, 3 gün kuralı ve güvenli ilk besinler.",
        category: "nutrition",
        readTime: "7 dk",
        ageGroup: "Sağlıklı Yaşam",
        isDoctorApproved: true,
    },
    {
        id: "4",
        title: "Bebeklerde Uyku Eğitimi: Ferber Yöntemi",
        summary: "Uyku eğitimi yöntemleri arasında popüler olan Ferber metodunun uygulanışı.",
        category: "growth",
        readTime: "6 dk",
        ageGroup: "Aile Hayatı",
        isDoctorApproved: true,
    },
    {
        id: "5",
        title: "Çocuklarda Ekran Süresi Yönetimi",
        summary: "Amerikan Pediatri Akademisi'nin yaş gruplerine göre ekran süresi önerileri.",
        category: "health",
        readTime: "5 dk",
        ageGroup: "Okul Öncesi",
        isDoctorApproved: true,
    }
];

export default function ArticlesPage() {
    return (
        <div className="font-sans text-[#333333] px-4 md:px-0 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-gray-200 pb-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-[#5c4a3d] mb-2">Makale Kütüphanesi</h1>
                    <p className="text-gray-500 text-sm">Uzman doktorlar tarafından hazırlanan güncel çocuk sağlığı rehberleri.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map(article => (
                    <ArticleCard key={article.id} article={article} />
                ))}
            </div>
        </div>
    );
}
