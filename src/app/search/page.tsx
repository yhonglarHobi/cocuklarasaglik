import React from "react";
import { prisma } from "@/lib/prisma";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { Search, FileQuestion } from "lucide-react";
import Link from "next/link";

interface SearchPageProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    // Await params first to satisfy Next.js 15+ async requirement
    const resolvedParams = await searchParams;
    const q = typeof resolvedParams?.q === "string" ? resolvedParams.q : "";

    if (!q) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-gray-50">
                <Search className="w-16 h-16 text-gray-300 mb-4" />
                <h1 className="text-2xl font-bold text-gray-700 mb-2">Arama yapmak için bir kelime girin</h1>
                <p className="text-gray-500 mb-6">Hastalık, belirti veya aşı adı arayabilirsiniz.</p>
                <Link href="/" className="bg-hc-blue text-white px-6 py-2 rounded font-bold hover:bg-blue-700">
                    Anasayfaya Dön
                </Link>
            </div>
        );
    }

    // Perform Search
    const articles = await prisma.article.findMany({
        where: {
            OR: [
                { title: { contains: q, mode: "insensitive" } },
                { content: { contains: q, mode: "insensitive" } },
                { excerpt: { contains: q, mode: "insensitive" } },
            ],
            published: true,
        },
        include: {
            category: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div className="max-w-[1100px] mx-auto py-12 px-4">
            <div className="mb-8 border-b border-gray-200 pb-4">
                <h1 className="text-2xl font-serif font-bold text-[#5c4a3d] flex items-center gap-2">
                    <Search className="w-6 h-6 text-hc-orange" />
                    Arama Sonuçları: <span className="text-hc-blue">"{q}"</span>
                </h1>
                <p className="text-gray-500 mt-2 text-sm">{articles.length} sonuç bulundu.</p>
            </div>

            {articles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map((article) => {
                        // Map DB Article to UI Article
                        const uiArticle = {
                            id: article.id,
                            title: article.title,
                            summary: article.excerpt || article.content.substring(0, 150) + "...",
                            category: "health" as const, // Default or map from article.category.slug
                            readTime: "5 dk", // Placeholder logic
                            ageGroup: article.category?.name || "Genel Sağlık",
                            isDoctorApproved: true,
                            image: article.imageUrl || undefined,
                            slug: article.slug || article.id
                        };
                        return <ArticleCard key={article.id} article={uiArticle} />;
                    })}
                </div>
            ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-12 text-center">
                    <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileQuestion className="w-8 h-8 text-yellow-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Sonuç Bulunamadı</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        "<strong>{q}</strong>" ile ilgili herhangi bir makale bulamadık. Lütfen farklı anahtar kelimeler deneyin veya kategorilere göz atın.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link href="/" className="text-hc-blue font-bold hover:underline">
                            Anasayfa
                        </Link>
                        <Link href="/makaleler" className="text-hc-orange font-bold hover:underline">
                            Tüm Makaleler
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
