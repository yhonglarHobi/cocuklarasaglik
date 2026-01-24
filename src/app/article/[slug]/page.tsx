import React from "react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ArticleViewer } from "@/components/blog/ArticleViewer";

export default async function ArticlePage({ params }: { params: { slug: string } }) {
    // Await params first to satisfy Next.js 15+ async requirement
    const resolvedParams = await params;
    const { slug } = resolvedParams;

    // Fetch Article
    const article = await prisma.article.findFirst({
        where: {
            OR: [
                { id: slug }, // Try finding by ID first (since our links might use ID)
                { slug: slug } // Or finding by slug
            ]
        },
        include: { category: true }
    });

    if (!article) {
        notFound();
    }

    // Format for Viewer
    const formattedArticle = {
        title: article.title,
        content: article.content,
        image: article.imageUrl,
        authorName: "Çocuklara Sağlık Yayın Kurulu", // Or fetch author details
        date: article.updatedAt.toLocaleDateString("tr-TR", { year: 'numeric', month: 'long', day: 'numeric' }),
        categoryName: article.category?.name || "Genel Sağlık",
        categorySlug: article.category?.slug || "genel",
    };

    // Fetch related articles (same category)
    const relatedArticlesDB = await prisma.article.findMany({
        where: {
            categoryId: article.categoryId,
            id: { not: article.id },
            published: true
        },
        take: 4
    });

    const relatedArticles = relatedArticlesDB.map(a => ({
        title: a.title,
        link: `/article/${a.id}` // Using ID based routing for consistency with our previous setup
    }));

    return <ArticleViewer article={formattedArticle} relatedArticles={relatedArticles} />;
}
