import { prisma } from "@/lib/prisma";
import { ArticleCard } from "@/components/blog/ArticleCard";

// Force dynamic to ensures we see latest articles
export const dynamic = "force-dynamic";

export default async function ArticlesPage() {
    const dbArticles = await prisma.article.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
        include: { category: true }
    });

    return (
        <div className="font-sans text-[#333333] px-4 md:px-0 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-gray-200 pb-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-[#5c4a3d] mb-2">Makale Kütüphanesi</h1>
                    <p className="text-gray-500 text-sm">Uzman doktorlar tarafından hazırlanan güncel çocuk sağlığı rehberleri.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {dbArticles.length > 0 ? (
                    dbArticles.map((article) => {
                        const uiArticle = {
                            id: article.id,
                            title: article.title,
                            summary: article.excerpt || (article.content ? article.content.substring(0, 150) + "..." : ""),
                            category: "health" as const,
                            readTime: "5 dk",
                            ageGroup: article.category?.name || "Genel Sağlık",
                            isDoctorApproved: true,
                            image: article.imageUrl || undefined,
                            slug: article.slug || article.id
                        };
                        return <ArticleCard key={article.id} article={uiArticle} />;
                    })
                ) : (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        Henüz yayınlanmış makale bulunmamaktadır.
                    </div>
                )}
            </div>
        </div>
    );
}
