
import React from 'react';
import { notFound } from 'next/navigation';
import { categoriesDB, corporateContent } from '@/lib/content-data';
import CategoryView from '@/components/views/CategoryView';
import CorporateView from '@/components/views/CorporateView';
import { prisma } from "@/lib/prisma";
import { ArticleViewer } from "@/components/blog/ArticleViewer";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // 1. Statik Kategori Sayfaları
    if (categoriesDB[slug]) {
        return <CategoryView slug={slug} />;
    }

    // 2. Statik Kurumsal Sayfalar (Hakkımızda vs.)
    if (corporateContent[slug]) {
        return <CorporateView slug={slug} />;
    }

    // 3. Veritabanı Makaleleri (WordPress Migrated & New)
    try {
        // findFirst kullanılmalı çünkü findUnique AND koşuluyla çalışmaz
        const article = await prisma.article.findFirst({
            where: {
                slug: slug,
                published: true
            },
            include: {
                author: true,
                category: true // Kategori ismini almak için
            }
        });

        if (article) {
            // Tarih formatla
            const formattedDate = new Date(article.createdAt).toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });

            return (
                <div className="container mx-auto py-8">
                    <ArticleViewer
                        article={{
                            title: article.title,
                            content: article.content,
                            image: article.imageUrl,
                            authorName: article.author?.name || "Editör",
                            date: formattedDate,
                            categoryName: article.category?.name || "Genel",
                            categorySlug: article.category?.slug || "genel"
                        }}
                        relatedArticles={[]} // İleride benzer yazılar eklenebilir
                    />
                </div>
            );
        }
    } catch (error) {
        console.error("Makale getirme hatası:", error);
    }

    return notFound();
}
