"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink, Star } from "lucide-react";

export default function SponsorsPage() {
    const sponsors = [
        {
            name: "Pediatri Derneği",
            logo: "https://via.placeholder.com/150?text=Dernek+Logo",
            description: "Türkiye'nin önde gelen çocuk sağlığı derneği, içeriklerimizin bilimsel doğruluğunu denetler.",
            website: "#"
        },
        {
            name: "Sağlıklı Nesiller Vakfı",
            logo: "https://via.placeholder.com/150?text=Vakif+Logo",
            description: "Çocukların daha sağlıklı büyümesi için projeler üreten sivil toplum kuruluşu.",
            website: "#"
        },
        {
            name: "Global Pharma",
            logo: "https://via.placeholder.com/150?text=Pharma+Logo",
            description: "Aşı ve ilaç çalışmalarıyla çocuk sağlığına destek veren global partnerimiz.",
            website: "#"
        },
        {
            name: "Eğitim Gönüllüleri",
            logo: "https://via.placeholder.com/150?text=Egitim+Logo",
            description: "Okul öncesi eğitim materyalleri sponsorumuz.",
            website: "#"
        }
    ];

    return (
        <div className="min-h-screen bg-white font-sans">

            {/* Header */}
            <div className="bg-[#f0f2f5] py-12 px-4 border-b border-gray-200">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#5c4a3d] mb-4">Sponsorlarımız ve Partnerlerimiz</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        CocuklaraSaglik.com'un güvenilir ve ücretsiz kalmasını sağlayan değerli destekçilerimize teşekkür ederiz.
                    </p>
                </div>
            </div>

            {/* Content Directory */}
            <div className="max-w-4xl mx-auto px-4 py-16">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {sponsors.map((sponsor, idx) => (
                        <div key={idx} className="border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow flex flex-col items-center text-center group">
                            <div className="w-32 h-32 mb-6 grayscale group-hover:grayscale-0 transition-all duration-500 opacity-80 group-hover:opacity-100">
                                {/* Placeholder for Logo */}
                                <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-gray-400 font-bold border-4 border-white shadow-sm">
                                    LOGO
                                </div>
                            </div>

                            <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                                {sponsor.name}
                                <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                            </h2>
                            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                                {sponsor.description}
                            </p>

                            <a href={sponsor.website} className="mt-auto inline-flex items-center gap-2 text-hc-blue font-bold text-sm hover:underline">
                                Web Sitesini Ziyaret Et
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                    ))}
                </div>

                <div className="mt-16 bg-blue-50 border border-blue-100 rounded-xl p-8 text-center">
                    <h3 className="text-2xl font-serif font-bold text-[#5c4a3d] mb-4">Sponsor Olmak İster misiniz?</h3>
                    <p className="text-gray-600 mb-6">
                        Çocuk sağlığına katkıda bulunmak ve binlerce ebeveyne ulaşmak için bizimle iletişime geçin.
                    </p>
                    <Link href="/iletisim" className="bg-hc-blue text-white px-8 py-3 rounded font-bold hover:bg-blue-700 transition-colors inline-block">
                        İletişime Geçin
                    </Link>
                </div>

            </div>
        </div>
    );
}
