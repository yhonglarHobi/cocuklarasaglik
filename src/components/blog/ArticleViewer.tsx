"use client";

import React, { useState } from "react";
import { Volume2, Type, Printer, Facebook, Twitter, Linkedin, Mail, User, Calendar } from "lucide-react";
import Link from "next/link";
import { SafeHTML } from "@/components/ui/SafeHTML";
import { AdPlaceholder } from "@/components/ui/AdPlaceholder";

interface ArticleViewerProps {
    article: {
        title: string;
        content: string;
        image?: string | null;
        authorName: string;
        date: string;
        categoryName: string;
        categorySlug: string;
    };
    relatedArticles?: { title: string; link: string }[];
}

export function ArticleViewer({ article, relatedArticles = [] }: ArticleViewerProps) {
    // -- Text Size Control --
    const [textSize, setTextSize] = useState(1); // 1: normal, 1.2: large, 1.4: x-large
    const handleTextSize = () => {
        setTextSize(prev => prev >= 1.4 ? 1 : prev + 0.2);
    };

    // -- Text to Speech --
    const handleSpeak = () => {
        if ('speechSynthesis' in window) {
            if (window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
            } else {
                const utterance = new SpeechSynthesisUtterance(`${article.title}. ${article.content.replace(/<[^>]*>?/gm, '')}`);
                utterance.lang = 'tr-TR';
                window.speechSynthesis.speak(utterance);
            }
        } else {
            alert("Tarayıcınız sesli okuma özelliğini desteklemiyor.");
        }
    };

    return (
        <div className="font-sans text-[#333333] px-4 md:px-0" style={{ fontSize: `${textSize}rem` }}>

            {/* Breadcrumb */}
            <div className="text-[10px] text-hc-orange font-bold uppercase tracking-wide mb-6">
                <Link href="/" className="hover:underline">CocuklaraSaglik</Link>
                <span className="mx-2 text-gray-400">&gt;</span>
                <Link href={`/category/${article.categorySlug}`} className="hover:underline uppercase">{article.categoryName}</Link>
                <span className="mx-2 text-gray-400">&gt;</span>
                <span className="text-gray-600 line-clamp-1">{article.title}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* MAIN CONTENT (Column 9) */}
                <div className="lg:col-span-9">

                    {/* Title */}
                    <h1 className="text-2xl md:text-3xl font-serif text-[#e45d32] font-normal mb-4 leading-tight">
                        {article.title}
                    </h1>

                    {/* Metadata Bar */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-200 pb-4 mb-6 text-xs text-gray-500 gap-4">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1 font-bold text-[#5c4a3d]">
                                <User className="w-3 h-3" />
                                {article.authorName}
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {article.date}
                            </span>
                        </div>

                        {/* Tools */}
                        <div className="flex items-center gap-3 no-print">
                            <button onClick={handleSpeak} className="flex items-center gap-1 hover:text-hc-blue transition-colors" title="Dinle">
                                <Volume2 className="w-4 h-4" />
                                <span className="hidden sm:inline">Dinle/Durdur</span>
                            </button>
                            <button onClick={handleTextSize} className="flex items-center gap-1 hover:text-hc-blue transition-colors" title="Yazı Boyutu">
                                <Type className="w-4 h-4" />
                                <span className="hidden sm:inline">Yazı Boyutu ({textSize === 1 ? 'N' : textSize > 1.3 ? 'XL' : 'L'})</span>
                            </button>
                            <button onClick={() => window.print()} className="flex items-center gap-1 hover:text-hc-blue transition-colors" title="Yazdır">
                                <Printer className="w-4 h-4" />
                                <span className="hidden sm:inline">Yazdır</span>
                            </button>
                        </div>
                    </div>

                    {/* Main Article Image */}
                    {article.image && (
                        <div className="mb-8 rounded-lg overflow-hidden shadow-sm">
                            <img
                                src={article.image}
                                alt={article.title}
                                className="w-full h-auto object-cover max-h-[500px]"
                            />
                            <p className="text-[10px] text-gray-400 mt-2 text-right px-2 pb-2">Görsel: Gemini tarafından makale için özel üretilmiştir.</p>
                        </div>
                    )}

                    {/* Social Share (Top) */}
                    <div className="flex flex-wrap items-center gap-2 mb-8">
                        <span className="text-xs font-bold uppercase text-gray-400 mr-2">Paylaş</span>
                        <button className="w-8 h-8 rounded-full bg-[#3b5998] text-white flex items-center justify-center hover:opacity-90">
                            <Facebook className="w-4 h-4" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-[#1da1f2] text-white flex items-center justify-center hover:opacity-90">
                            <Twitter className="w-4 h-4" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-[#0077b5] text-white flex items-center justify-center hover:opacity-90">
                            <Linkedin className="w-4 h-4" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-gray-500 text-white flex items-center justify-center hover:opacity-90">
                            <Mail className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Article Body */}
                    <article className="prose md:prose-lg max-w-none text-[#333333] prose-headings:font-serif prose-headings:text-[#5c4a3d] prose-a:text-hc-blue prose-strong:text-[#333333]">
                        {/* We are using dangerouslySetInnerHTML for content */}
                        <SafeHTML html={article.content} />

                        {/* In-Article Ad */}
                        <div className="my-8">
                            <AdPlaceholder height="120px" label="İlginizi Çekebilir" />
                        </div>
                    </article>

                    {/* Disclaimer */}
                    <div className="mt-10 p-6 bg-[#fbfbf1] border-l-4 border-hc-orange text-sm text-gray-600 italic">
                        <strong>Yasal Uyarı:</strong> Bu sitedeki bilgiler yalnızca bilgilendirme amaçlıdır ve tıbbi tavsiye yerine geçmez. Çocuğunuzun sağlığı ile ilgili endişeleriniz varsa mutlaka bir doktora danışın.
                    </div>

                </div>

                {/* SIDEBAR (Column 3) */}
                <div className="lg:col-span-3 space-y-8">

                    {/* Author Profile Card */}
                    <div className="bg-white border border-gray-200 p-5 text-center">
                        <div className="w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden border-4 border-[#fbfbf1]">
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png"
                                alt={article.authorName}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h3 className="font-serif text-lg font-bold text-[#5c4a3d] mb-1">
                            {article.authorName}
                        </h3>
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-bold mb-3">
                            Otonom İçerik Ajansı
                        </p>
                        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                            Çocuk sağlığı ve hastalıkları konusunda küresel kaynakları tarayan yapay zeka destekli editör.
                        </p>
                        <Link href="#" className="text-hc-blue text-xs font-bold uppercase hover:underline">
                            Yazarın Profili
                        </Link>
                    </div>
                    {/* Related Articles */}
                    {relatedArticles.length > 0 && (
                        <div className="bg-white border border-gray-200 p-5">
                            <h3 className="text-hc-orange font-bold uppercase text-sm border-b border-gray-200 pb-2 mb-4">
                                İlgili İçerikler
                            </h3>
                            <ul className="space-y-3">
                                {relatedArticles.map((item, idx) => (
                                    <li key={idx}>
                                        <Link href={item.link} className="text-sm text-gray-700 hover:text-hc-blue hover:underline block leading-snug">
                                            {item.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Newsletter Ad */}
                    <div className="bg-[#eef6fc] p-5 border-t-4 border-hc-blue">
                        <h3 className="text-hc-blue font-serif text-lg mb-2">Haftalık Bülten</h3>
                        <p className="text-xs text-gray-600 mb-3">Çocuğunuzun gelişimi için en güncel bilgiler e-postanızda.</p>
                        <input type="email" placeholder="E-posta" className="w-full px-3 py-2 text-sm border border-gray-300 mb-2" />
                        <button className="bg-hc-blue text-white w-full py-1.5 text-xs font-bold uppercase">ABONE OL</button>
                    </div>

                </div>

            </div>

            {/* Styles for Prose Content */}
            <style jsx global>{`
        .lead {
            font-size: 1.25rem;
            line-height: 1.8;
            color: #555;
            margin-bottom: 2rem;
            font-weight: 500;
        }
        .highlight-box {
            background-color: #F1F8E9;
            padding: 1.5rem;
            border-radius: 4px;
            margin: 2rem 0;
            border-left: 5px solid #6cbe45;
        }
        
        .prose h2 {
            font-family: var(--font-serif);
            color: #e45d32;
            font-size: 1.5rem;
            margin-top: 2rem;
            margin-bottom: 1rem;
            font-weight: 700;
        }
        .prose h3 {
            font-family: var(--font-serif);
            color: #5c4a3d;
            font-size: 1.25rem;
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
            font-weight: 600;
        }
        .prose ul {
            list-style-type: none;
            padding-left: 0;
            margin-bottom: 1.5rem;
        }
        .prose ul li {
            position: relative;
            padding-left: 1.5rem;
            margin-bottom: 0.5rem;
            line-height: 1.7;
        }
        .prose ul li::before {
            content: "•";
            color: #e45d32;
            font-weight: bold;
            display: inline-block;
            width: 1rem;
            margin-left: -1rem;
            font-size: 1.2rem;
        }
        .prose p {
            line-height: 1.8;
            margin-bottom: 1.25rem;
            color: #333;
        }
        
        @media print {
            .no-print, header, footer, nav {
                display: none !important;
            }
            body { 
                background: white; 
            }
            .prose {
                font-size: 12pt;
                line-height: 1.4;
            }
        }
      `}</style>
        </div>
    );
}
