"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";
import { getSystemSettings } from "@/app/admin/settings/actions";
import { revalidatePath } from "next/cache";

export async function generateArticlesAction(targetCategory: string, count: number) {
    try {
        const settings = await getSystemSettings();

        if (!settings?.apiKey) return { success: false, error: "API Anahtarı bulunamadı! [Ayarlar] sayfasından ekleyin." };
        if (!settings?.systemPrompt) return { success: false, error: "Master Prompt bulunamadı! [Ayarlar] sayfasından ekleyin." };

        const genAI = new GoogleGenerativeAI(settings.apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const dynamicPrompt = `
        ${settings.systemPrompt}

        --- ÇALIŞMA EMRİ ---
        GÖREV: Lütfen "${targetCategory === 'all' ? 'popüler ve ihtiyaç duyulan' : targetCategory}" konusuyla ilgili toplam ${count} adet, ebeveynler için SEO uyumlu ve bilimsel blog makalesi üret.
        
        ÖNEMLİ ÇIKTI KURALLARI:
        1. Yanıtın SADECE geçerli bir JSON dizisi (Array of Objects) olsun.
        2. Markdown formatı (\`\`\`json ...) veya başka bir açıklama metni EKLEME. Sadece ham JSON ver.
        3. Her makale objesi şu yapıda olmalı:
        [
            {
                "title": "Dikkat Çekici Başlık",
                "slug": "url-dostu-kisa-baslik",
                "excerpt": "Meta açıklama tadında kısa özet (max 160 karakter)",
                "content": "<p>Giriş paragrafı...</p><h2>Alt Başlık</h2><ul><li>Liste maddesi</li></ul><p>Sonuç paragrafı...</p> (Tamamen HTML formatında, zengin içerik)",
                "category_suggestion": "Önerilen Kategori İsmi (Türkçe)",
                "source": "Ana referans kaynağı (örn: AAP)"
            }
        ]
        `;

        const result = await model.generateContent(dynamicPrompt);
        const response = await result.response;
        const text = response.text();

        let cleanJson = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        let articlesData;
        try {
            articlesData = JSON.parse(cleanJson);
        } catch (e) {
            console.error("JSON Parse Hatası:", cleanJson);
            if (cleanJson.startsWith("{")) {
                cleanJson = "[" + cleanJson + "]";
                try { articlesData = JSON.parse(cleanJson); } catch (e2) { return { success: false, error: "AI yanıtı bozuk geldi." }; }
            } else {
                return { success: false, error: "AI yanıtı formatı hatalı." };
            }
        }

        const articlesArray = Array.isArray(articlesData) ? articlesData : [articlesData];

        let author = await prisma.user.findFirst({ where: { role: "ADMIN" } });
        if (!author) {
            author = await prisma.user.findFirst();
            if (!author) {
                // Fallback user create logic if needed, or error
                return { success: false, error: "Sistemde kayıtlı yazar (Admin) bulunamadı." };
            }
        }

        let savedCount = 0;
        let aiCategoryProposal = null; // AI'ın önerdiği kategori varsa buraya alacağız

        for (const article of articlesArray) {
            if (!article.title || !article.content) continue;

            let categoryId = null;
            if (article.category_suggestion) {
                const catSlug = article.category_suggestion
                    .toLowerCase()
                    .replace(/ /g, "-")
                    .replace(/[ğüşıöç]/g, (c: string) => ({ 'ğ': 'g', 'ü': 'u', 'ş': 's', 'ı': 'i', 'ö': 'o', 'ç': 'c' }[c] || c));

                const existingCat = await prisma.category.findFirst({
                    where: {
                        OR: [
                            { name: { equals: article.category_suggestion, mode: "insensitive" } },
                            { slug: catSlug }
                        ]
                    }
                });

                if (existingCat) {
                    categoryId = existingCat.id;
                } else {
                    // Kategori bulunamadı, bunu frontend'e "AI Önerisi" olarak dönebiliriz
                    aiCategoryProposal = {
                        originalName: article.category_suggestion, // Örn: Adolescent Mental Wellness
                        suggestedName: article.category_suggestion, // Örn: Ergen Ruh Sağlığı (Prompt tr istediği için tr gelir)
                        reason: "Bu kategori veritabanında henüz yok."
                    };
                    // Şimdilik null bırakıyoruz, kullanıcı elle ekleyecek
                }
            }

            const uniqueSlug = (article.slug || "yazi") + "-" + Date.now() + Math.floor(Math.random() * 1000);

            await prisma.article.create({
                data: {
                    title: article.title,
                    slug: uniqueSlug,
                    excerpt: article.excerpt || "",
                    content: article.content, // HTML format
                    published: false,
                    viewCount: 0,
                    authorId: author.id,
                    categoryId: categoryId,
                }
            });
            savedCount++;
        }

        revalidatePath("/admin/wizard");
        return { success: true, count: savedCount, aiProposal: aiCategoryProposal };

    } catch (error: any) {
        console.error("AI Error:", error);
        return { success: false, error: error.message || "Bilinmeyen hata." };
    }
}

export async function getDraftArticlesAction() {
    try {
        const drafts = await prisma.article.findMany({
            where: { published: false },
            orderBy: { createdAt: "desc" },
            include: { category: true }
        });
        return drafts;
    } catch (error) {
        return [];
    }
}

export async function publishArticleAction(id: string) {
    try {
        await prisma.article.update({
            where: { id },
            data: { published: true }
        });
        revalidatePath("/admin/wizard");
        revalidatePath("/"); // Ana sayfayı da güncelle
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

export async function deleteArticleAction(id: string) {
    try {
        await prisma.article.delete({ where: { id } });
        revalidatePath("/admin/wizard");
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

export async function createCategoryAction(name: string) {
    try {
        const slug = name.toLowerCase()
            .replace(/ /g, "-")
            .replace(/[ğüşıöç]/g, (c: string) => ({ 'ğ': 'g', 'ü': 'u', 'ş': 's', 'ı': 'i', 'ö': 'o', 'ç': 'c' }[c] || c));

        // Check exist
        const exist = await prisma.category.findUnique({ where: { slug } });
        if (exist) return { success: false, error: "Bu kategori zaten var." };

        await prisma.category.create({
            data: { name, slug }
        });

        revalidatePath("/admin/wizard");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Kategori oluşturulamadı." };
    }
}

export async function getCategoriesAction() {
    try {
        return await prisma.category.findMany({ orderBy: { name: 'asc' } });
    } catch (err) {
        return [];
    }
}
