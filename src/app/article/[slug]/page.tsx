import React from "react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ArticleViewer } from "@/components/blog/ArticleViewer";
import { getAdSenseConfig } from "@/components/ads/actions";
import { Metadata } from "next";

// Generate Metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    try {
        const { slug } = await params;
        const article = await prisma.article.findFirst({
            where: {
                OR: [
                    { id: slug },
                    { slug: slug }
                ]
            },
            select: { title: true, excerpt: true }
        });

        if (!article) {
            return {
                title: 'Makale Bulunamadı - CocuklaraSaglik.com',
                description: 'Aradığınız makale bulunamadı.'
            };
        }

        return {
            title: `${article.title} - CocuklaraSaglik.com`,
            description: article.excerpt || `${article.title} hakkında detaylı bilgiler.`,
            openGraph: {
                title: article.title,
                description: article.excerpt || undefined,
            }
        };
    } catch (error) {
        console.error("Metadata error:", error);
        return {
            title: 'CocuklaraSaglik.com',
            description: 'Türkiye\'nin En Kapsamlı Çocuk Sağlığı Portalı'
        };
    }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    // Await params first to satisfy Next.js 15+ async requirement
    const resolvedParams = await params;
    const { slug } = resolvedParams;


    let article;
    let relatedArticlesDB: any[] = [];
    let adsConfig;

    try {
        // Fetch Article safely
        article = await prisma.article.findFirst({
            where: {
                OR: [
                    { id: slug }, // Try finding by ID first (since our links might use ID)
                    { slug: slug } // Or finding by slug
                ]
            },
            include: { category: true }
        });

        if (!article) {
            // Smart Redirect Check:
            // If article not found, maybe it's an old timestamped URL?
            // Try to find the cleaned version.
            const hasTimestamp = /-\d{13,}/.test(slug);
            if (hasTimestamp) {
                const cleanSlug = slug.replace(/-\d{13,}\d*$/, '')
                    .toLowerCase()
                    .replace(/[^a-z0-9-]/g, '-')
                    .replace(/-+/g, '-')
                    .replace(/^-|-$/g, '');

                const foundRedirect = await prisma.article.findUnique({
                    where: { slug: cleanSlug }
                });

                if (foundRedirect) {
                    const { redirect } = await import('next/navigation');
                    redirect(`/article/${foundRedirect.slug}`);
                }
            }

            notFound();
        }

        // Fetch related articles (same category)
        relatedArticlesDB = await prisma.article.findMany({
            where: {
                categoryId: article.categoryId,
                id: { not: article.id },
                published: true
            },
            take: 4,
            select: { id: true, title: true } // Performance optimization
        });

        // Get AdSense config safely
        try {
            adsConfig = await getAdSenseConfig();
        } catch (e) {
            console.error("AdSense Config Error:", e);
            adsConfig = { enabled: false, publisherId: '', articleSlot: '' };
        }

    } catch (error) {
        console.error("Article Page Error:", error);
        notFound();
    }

    // Safely format date
    let formattedDate = "";
    try {
        formattedDate = article.updatedAt.toLocaleDateString("tr-TR", { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
        formattedDate = new Date(article.updatedAt).toISOString().split('T')[0];
    }

    // Format for Viewer
    const formattedArticle = {
        title: article.title,
        content: article.content,
        image: article.imageUrl,
        authorName: "Çocuklara Sağlık Yayın Kurulu",
        date: formattedDate,
        categoryName: article.category?.name || "Genel Sağlık",
        categorySlug: article.category?.slug || "genel",
    };

    const relatedArticles = relatedArticlesDB.map(a => ({
        title: a.title,
        link: `/article/${a.id}`
    }));

    return (
        <ArticleViewer
            article={formattedArticle}
            relatedArticles={relatedArticles}
            adsConfig={{
                enabled: adsConfig.enabled,
                publisherId: adsConfig.publisherId,
                articleSlot: adsConfig.articleSlot
            }}
        />
    );
}
