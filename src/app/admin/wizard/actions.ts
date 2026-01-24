"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";
import { getSystemSettings } from "@/app/admin/settings/actions";
import { revalidatePath } from "next/cache";

export async function generateArticlesAction(targetCategory: string, count: number) {
    try {
        // 1. Veritabanından Ayarları Çek
        const settings = await getSystemSettings();

        if (!settings?.apiKey) {
            return { success: false, error: "API Anahtarı bulunamadı! Lütfen Ayarlar sayfasından ekleyin." };
        }
        if (!settings?.systemPrompt) {
            return { success: false, error: "Master Prompt bulunamadı! Lütfen Ayarlar sayfasından ekleyin." };
        }

        // 2. Gemini Başlat
        const genAI = new GoogleGenerativeAI(settings.apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // Hızlı ve ekonomik model

        // 3. Dinamik Prompt Hazırla
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
                "category_suggestion": "Önerilen Kategori İsmi",
                "source": "Ana referans kaynağı (örn: AAP, Nemours)"
            }
        ]
        `;

        // 4. Üretimi Başlat
        console.log("Gemini'ye istek gönderiliyor...");
        const result = await model.generateContent(dynamicPrompt);
        const response = await result.response;
        const text = response.text();
        console.log("Gemini yanıtı alındı.");

        // 5. JSON Temizleme
        let cleanJson = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        // JSON'u parse et
        let articlesData;
        try {
            articlesData = JSON.parse(cleanJson);
        } catch (e) {
            console.error("JSON Parse Hatası. Gelen veri:", cleanJson);
            // Bazen AI tek obje döner, onu array yapmayı deneyelim mi? Hayır, promptta array istedik.
            // Ama yine de basit bir kurtarma deneyebiliriz.
            if (cleanJson.startsWith("{")) {
                cleanJson = "[" + cleanJson + "]";
                try {
                    articlesData = JSON.parse(cleanJson);
                } catch (e2) {
                    return { success: false, error: "Yapay zeka yanıtı okunamadı (JSON Format Hatası)." };
                }
            } else {
                return { success: false, error: "Yapay zeka yanıtı okunamadı." };
            }
        }

        // Dizi değilse diziye çevir
        const articlesArray = Array.isArray(articlesData) ? articlesData : [articlesData];

        // 6. Veritabanına Yazar Kontrolü
        // Sistemin çalışması için en az bir User (Author) lazım.
        let author = await prisma.user.findFirst({ where: { role: "ADMIN" } });

        // Eğer hiç admin yoksa, geçici bir "AI Editor" kullanıcısı oluşturalım
        if (!author) {
            // Önce herhangi bir user var mı?
            author = await prisma.user.findFirst();
            if (!author) {
                // Hiç kullanıcı yok, oluşturalım
                try {
                    author = await prisma.user.create({
                        data: {
                            email: "ai-editor@cocuklarasaglik.com",
                            password: "system-generated-secure-pass",
                            name: "AI Editör",
                            role: "ADMIN"
                        }
                    });
                } catch (err) {
                    console.error("Kullanıcı oluşturma hatası:", err);
                    return { success: false, error: "Sistem yazarı oluşturulamadı." };
                }
            }
        }

        // 7. Makaleleri Kaydet
        let savedCount = 0;
        for (const article of articlesArray) {
            // Başlık ve İçerik dolu mu?
            if (!article.title || !article.content) continue;

            // Kategori Bulma veya Oluşturma
            // category_suggestion veritabanında var mı?
            let categoryId = null;
            if (article.category_suggestion) {
                // Slug yap: "Çocuk Sağlığı" -> "cocuk-sagligi"
                const catSlug = article.category_suggestion
                    .toLowerCase()
                    .replace(/ /g, "-")
                    .replace(/[ğüşıöç]/g, (c: string) => ({ 'ğ': 'g', 'ü': 'u', 'ş': 's', 'ı': 'i', 'ö': 'o', 'ç': 'c' }[c] || c));

                // Var mı diye bak
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
                    // Yoksa oluştur (Opsiyonel: İstemiyorsan null bırak)
                    // Şimdilik "Genel" kategorisi yoksa null kalsın veya oluştursun.
                    // Kullanıcı "Kategoriyi onayla" dediğinde wizard sayfasında kategori manuel ekleniyor.
                    // Burada otomatik eklemek riskli olabilir category kirliliği yaratır.
                    // O yüzden: Kategori varsa bağla, yoksa bağlama (null).
                }
            }

            // Slug unique olmalı
            const uniqueSlug = (article.slug || "yazi") + "-" + Date.now() + Math.floor(Math.random() * 1000);

            await prisma.article.create({
                data: {
                    title: article.title,
                    slug: uniqueSlug,
                    excerpt: article.excerpt || "",
                    content: article.content, // HTML
                    published: false,
                    viewCount: 0,
                    authorId: author.id,
                    categoryId: categoryId,
                    // source alanı şemada yok, içeriğe ekleyebiliriz veya şemaya eklemeliyiz. Şimdilik içeriğin sonuna ekleyelim.
                }
            });
            savedCount++;
        }

        revalidatePath("/admin/wizard");
        return { success: true, count: savedCount };

    } catch (error: any) {
        console.error("Generate Action Hatası:", error);
        return { success: false, error: error.message || "İşlem başarısız." };
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
        console.error("Taslaklar çekilemedi:", error);
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
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

export async function deleteArticleAction(id: string) {
    try {
        await prisma.article.delete({
            where: { id }
        });
        revalidatePath("/admin/wizard");
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}
