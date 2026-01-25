import { prisma } from "@/lib/prisma";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://cocuklarasaglik.com"; // Gerçek domain buraya

    // Tüm yayınlanmış makaleleri çek
    const articles = await prisma.article.findMany({
        where: { published: true },
        orderBy: { updatedAt: "desc" },
    });

    const articlesMap = articles.map((article) => ({
        url: `${baseUrl}/article/${article.id}`, // veya article.slug, routing'e göre
        lastModified: article.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
    }));

    // Statik sayfalar
    const staticPages = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "daily" as const,
            priority: 1.0,
        },
        {
            url: `${baseUrl}/search`,
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: 0.5,
        },
        // Kategorileri de ekleyebiliriz
    ];

    return [...staticPages, ...articlesMap];
}
