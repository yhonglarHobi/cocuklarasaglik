import { prisma } from "@/lib/prisma";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://cocuklarasaglik.com";

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
    ];

    try {
        // Tüm yayınlanmış makaleleri çek
        // Build sırasında veritabanı hatası alırsak build patlamasın diye try-catch ekledik
        const articles = await prisma.article.findMany({
            where: { published: true },
            select: { slug: true, updatedAt: true }, // Performance optimization
            orderBy: { updatedAt: "desc" },
        });

        const articlesMap = articles.map((article) => ({
            url: `${baseUrl}/article/${article.slug}`, // Slug kullanımı
            lastModified: article.updatedAt,
            changeFrequency: "weekly" as const,
            priority: 0.8,
        }));

        return [...staticPages, ...articlesMap];
    } catch (error) {
        console.error("Sitemap generation error (Database might be unreachable during build):", error);
        // Hata durumunda sadece statik sayfaları döndür, build başarılı olsun
        return staticPages;
    }
}
