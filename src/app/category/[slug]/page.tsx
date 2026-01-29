import React from "react";
import { prisma } from "@/lib/prisma";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { Tag, FileQuestion } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface CategoryPageProps {
    params: { slug: string };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    // Await params first to satisfy Next.js 15+ async requirement
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    // 1. Fetch Category
    const category = await prisma.category.findUnique({
        where: { slug: slug },
        include: {
            articles: {
                where: { published: true },
                orderBy: { createdAt: "desc" },
                include: { category: true }
            }
        }
    });

    if (!category) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-gray-50">
                <Tag className="w-16 h-16 text-gray-300 mb-4" />
                <h1 className="text-2xl font-bold text-gray-700 mb-2">Kategori Bulunamadı</h1>
                <p className="text-gray-500 mb-6">Aradığınız "{slug}" kategorisi henüz oluşturulmamış.</p>
                <Link href="/" className="bg-hc-blue text-white px-6 py-2 rounded font-bold hover:bg-blue-700">
                    Anasayfaya Dön
                </Link>
            </div>
        );
    }

    const articles = category.articles;

    return (
        <div className="max-w-[1100px] mx-auto py-12 px-4">
            {/* Header */}
            <div className="mb-8 border-b-2 border-hc-orange pb-4 flex items-baseline justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-[#5c4a3d] capitalize flex items-center gap-3">
                        <span className="bg-hc-orange/10 p-2 rounded-lg"><Tag className="w-6 h-6 text-hc-orange" /></span>
                        {category.name}
                    </h1>
                    <p className="text-gray-500 mt-2 ml-1">Bu kategorideki tüm uzman onaylı makaleler.</p>
                </div>
                <div className="text-sm font-bold text-gray-400 uppercase">
                    {articles.length} MAKALE
                </div>
            </div>

            {/* Content Grid */}
            {articles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map((article) => {
                        // Map DB Article to UI Article
                        const uiArticle = {
                            id: article.id,
                            title: article.title,
                            summary: article.excerpt || article.content.substring(0, 150) + "...",
                            category: "health" as const,
                            readTime: "5 dk",
                            ageGroup: category.name,
                            isDoctorApproved: true,
                            image: article.imageUrl || undefined,
                            slug: article.slug || article.id
                        };
                        return <ArticleCard key={article.id} article={uiArticle} />;
                    })}
                </div>
            ) : (
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-12 text-center">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileQuestion className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Henüz İçerik Yok</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Bu kategoride henüz yayınlanmış bir makale bulunmuyor. Çok yakında eklenecek!
                    </p>
                    <Link href="/" className="text-hc-blue font-bold hover:underline">
                        Diğer Makalelere Göz At
                    </Link>
                </div>
            )}
        </div>
    );
}
