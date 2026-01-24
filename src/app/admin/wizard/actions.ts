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
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const dynamicPrompt = `
        ${settings.systemPrompt}

        --- ÇALIŞMA EMRİ (v3.2) ---
        SİSTEM ROLÜ: Sen, küresel çapta kabul görmüş dört ana pediatri kaynağını (healthychildren.org, kidshealth.org, kidshealth.org.nz, aboutkidshealth.ca) tarayan ve sentezleyen otonom bir yayın sistemisin.
        
        GÖREV: "${targetCategory === 'all' ? 'popüler ve ihtiyaç duyulan' : targetCategory}" konusuyla ilgili toplam ${count} adet, ebeveynler için SEO uyumlu ve bilimsel blog makalesi üret.

        ADIM 1: GENİŞLETİLMİŞ KATEGORİ HAVUZU
        Aşağıdaki konulardan veya ilgili niş alanlardan seçim yap:
        - Temel: Beslenme, Gelişim, Güvenlik, Hastalıklar
        - Ruhsal: Kaygı, özgüven, yas, davranış
        - Okul: Öğrenme, zorbalık, sosyal beceriler
        - Ergen: Ergenlik, bağımlılık, sosyal medya
        - Ağız/Diş: İlk diş hekimi, hijyen
        - Çevresel: Kirlilik, mevsimsel etkiler
        - Özel Gereksinim: Otizm, DEHB, aile desteği
        
        ADIM 2: İÇERİK PROTOKOLÜ
        - Persona: Çocuklara Sağlık Platformu Yayın Kurulu (Objektif/Bilimsel)
        - Klinik/Doktor atıfı yapma.
        - Görsel: Her yazı için "generate_image" tetikleyicili İngilizce prompt hazırla.

        ADIM 3: ÇIKTI FORMATI (JSON)
        Yanıtın SADECE şu formatta geçerli bir JSON dizisi olmalı:
        [
            {
                "title": "Çarpıcı, SEO Uyumlu Başlık",
                "slug": "url-dostu-kisa-baslik",
                "excerpt": "Meta açıklama (max 160 karakter)",
                "content": "<p>Giriş...</p><h2>Alt Başlık</h2><ul><li>Madde</li></ul>... (Zengin HTML)",
                "category_suggestion": "Önerilen Kategori İsmi",
                "image_prompt": "Ingilizce gorsel olusturma promputu (minimalist, modern vector art style)",
                "reading_time": "Tahmini okuma süresi (dk)"
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
                return { success: false, error: "Sistemde kayıtlı yazar (Admin) bulunamadı." };
            }
        }

        let savedCount = 0;
        let aiCategoryProposal = null;

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
                    aiCategoryProposal = {
                        originalName: article.category_suggestion,
                        suggestedName: article.category_suggestion,
                        reason: "Bu kategori veritabanında henüz yok."
                    };
                }
            }

            const uniqueSlug = (article.slug || "yazi") + "-" + Date.now() + Math.floor(Math.random() * 1000);

            // Image Generation Logic (Mock/Fallback)
            // Since we don't have DALL-E connected, we use the prompt keywords to fetch a relevant image from Unsplash source
            // Extract key nouns from image_prompt or title for better accuracy
            const keywords = article.image_prompt
                ? article.image_prompt.replace(/ /g, ",").split(",").slice(0, 3).join(",") // Use first 3 words of prompt
                : "pediatrics,child,health";

            // Using placeholder for demo, or Unsplash source if permitted
            const imageUrl = `https://images.unsplash.com/photo-1505685296765-3a27959b8be3?auto=format&fit=crop&w=800&q=80`;
            // Better: Let's try to generate a somewhat random image based on category or topic if possible, 
            // but static URL is safer for 404s. 
            // Let's use a functional Unsplash search URL instead:
            // const dynamicImageUrl = `https://source.unsplash.com/1600x900/?${encodeURIComponent(keywords)}`;
            // Note: source.unsplash.com is deprecated. We will use a random placeholder or leave it empty for manual update.
            // USER REQUESTED: "görseli de oluştursun". 
            // Real implementation requires an API. I'll use a specific collection or keywords.
            // Let's use a service that still works usually:
            const dynamicImageUrl = `https://placehold.co/1200x630/eef2ff/3730a3?text=${encodeURIComponent(article.title.substring(0, 20) + "...")}\\n(Görsel+Hazırlanıyor)`;

            await prisma.article.create({
                data: {
                    title: article.title,
                    slug: uniqueSlug,
                    excerpt: article.excerpt || "",
                    content: article.content,
                    published: false,
                    viewCount: 0,
                    authorId: author.id,
                    categoryId: categoryId,
                    imageUrl: dynamicImageUrl // Now saving an image URL
                }
            });
            savedCount++;
        }

        revalidatePath("/admin/wizard");
        return { success: true, count: savedCount, aiProposal: aiCategoryProposal };

    } catch (error: any) {
        console.error("AI Error:", error);
        return { success: false, error: `[Model: gemini-2.0-flash] ${error.message || "Bilinmeyen hata."}` };
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
