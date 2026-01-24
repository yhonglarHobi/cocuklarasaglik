
import React from "react";
import Link from "next/link";
import { categoriesDB } from "@/lib/content-data";

export default function CategoryView({ slug }: { slug: string }) {
    const category = categoriesDB[slug];

    if (!category) {
        return null;
    }

    return (
        <div className="font-sans text-[#333333]">

            {/* Breadcrumb */}
            <div className="text-[10px] text-hc-orange font-bold uppercase tracking-wide mb-6">
                <Link href="/" className="hover:underline">CocuklaraSaglik</Link>
                <span className="mx-2 text-gray-400">&gt;</span>
                <span>{category.title}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

                {/* LEFT SIDEBAR LINKS */}
                <div className="md:col-span-3">
                    <h2 className="text-[#8cc63f] text-xl font-serif font-normal mb-4">
                        {category.title}
                    </h2>
                    <ul className="flex flex-col gap-3">
                        {category.sidebarLinks.map((link, idx) => (
                            <li key={idx}>
                                <Link href={link.url} className="text-[#5c4a3d] font-bold text-sm hover:text-hc-orange">
                                    {link.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* MAIN CONTENT AREA */}
                <div className="md:col-span-9">

                    {/* Header Image */}
                    <div className="relative w-full h-[250px] mb-8 overflow-hidden">
                        <img
                            src={category.image}
                            alt={category.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Main Title */}
                    <h1 className="text-4xl font-serif text-[#e45d32] font-normal mb-8">
                        {category.title}
                    </h1>

                    {/* Sections Loop */}
                    <div className="space-y-12">
                        {category.sections.map((section, idx) => (
                            <div key={idx} id={section.title.toLowerCase()} className="flex flex-col">

                                {/* Section Title */}
                                <h2 className="text-2xl font-serif text-[#5c4a3d] mb-3">
                                    {section.title}
                                </h2>

                                {/* Description */}
                                <p className="text-gray-700 leading-relaxed text-[15px] mb-6 font-sans">
                                    {section.description}
                                </p>

                                {/* Featured Articles Box */}
                                <div className="bg-[#F1F8E9] p-6 border-l-4 border-hc-blue">
                                    <h3 className="text-xl font-serif text-hc-blue mb-4">
                                        Öne Çıkan Makaleler
                                    </h3>
                                    <ul className="divide-y divide-[#d9e2ec] mb-6">
                                        {section.featuredArticles.map((article, aIdx) => (
                                            <li key={aIdx} className="py-3 first:pt-0">
                                                <Link href={article.url} className="text-[#333333] hover:text-hc-orange hover:underline text-[15px]">
                                                    {article.title}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>

                                    <button className="bg-[#eeb310] text-[#5c4a3d] px-6 py-2 text-sm font-bold uppercase tracking-wide hover:bg-[#dca30e] transition-colors rounded-sm shadow-sm">
                                        Listeyi Gör
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>

                </div>

            </div>
        </div>
    );
}
