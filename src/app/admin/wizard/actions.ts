"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";
import { getSystemSettings } from "@/app/admin/settings/actions";
import { revalidatePath } from "next/cache";

// --- YENİ EKLENEN İYİLEŞTİRME AKSİYONU ---
export async function reviseArticleAction(articleId: string, rating: number, notes: string) {
    try {
        const settings = await getSystemSettings();
        // Fallback to environment variable if DB setting is missing
        const apiKey = settings?.apiKey || process.env.GEMINI_API_KEY;

        if (!apiKey) return { success: false, error: "API Anahtarı eksik. (Env veya DB)" };

        const article = await prisma.article.findUnique({ where: { id: articleId } });
        if (!article) return { success: false, error: "Makale bulunamadı." };

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const refinementPrompt = `
        SİSTEM ROLÜ: Sen, uzman bir tıbbi editör ve içerik stratejistisin. Görevin, bir çocuk sağlığı uzmanı tarafından hazırlanan taslağı gelen geri bildirimlere göre mükemmelleştirmektir.

        GİRDİLER:
        Taslak Metin: ${article.content}
        Mevcut Başlık: ${article.title}
        Doktorun Puanı: ${rating} / 100
        Doktorun Notları: "${notes}"

        TALİMATLAR:
        1. Puan < 80 ise: Yazının tonunu ve yapısını kökten gözden geçir. Eksik bilgileri tamamla.
        2. Puan > 80 ise: Mevcut yapıyı koru, sadece spesifik geri bildirimleri (örn: "daha samimi ol") uygula.
        3. Görsel Talebi: Eğer notlarda "görsel" kelimesi geçiyorsa veya görsel eksikse, JSON çıktısında "image_prompt" alanına SADECE İNGİLİZCE anahtar kelimeler yaz (örn: "baby crawling floor motor development"). Türkçe kelime KULLANMA. Maksimum 4-5 kelime.
        4. Tıbbi Dil: Yazıyı cocuklarasaglik.com standartlarına uygun, hem güvenilir hem de ebeveynlerin anlayabileceği bir dille revize et.
        5. Kaynakça Listesi: Metin sonuna ASLA kaynakça listesi ekleme.

        ÇIKTI FORMATI (SADECE JSON):
        {
            "title": "Revize Edilmiş Başlık",
            "excerpt": "Revize edilmiş kısa özet",
            "content": "Revize edilmiş HTML içeriği...",
            "image_prompt": "Geliştirilmiş görsel promptu (Eğer görsel yenilenmesi isteniyorsa, yoksa boş bırak)"
        }
        `;

        const result = await model.generateContent(refinementPrompt);
        const response = await result.response;
        const text = response.text();

        let CleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
        let revisedData;
        try {
            revisedData = JSON.parse(CleanJson);
        } catch (e) {
            // Fallback: try to extract JSON if mixed with text
            const jsonMatch = CleanJson.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                try { revisedData = JSON.parse(jsonMatch[0]); } catch (e2) { return { success: false, error: "AI yanıtı işlenemedi." }; }
            } else {
                return { success: false, error: "AI yanıt formatı hatalı." };
            }
        }

        // Update Data Construction
        const updateData: any = {
            title: revisedData.title,
            excerpt: revisedData.excerpt,
            content: revisedData.content,
        };

        // --- VERTEX AI IMAGEN INTEGRATION ---
        if (revisedData.image_prompt) {
            try {
                const VERTEX_API_KEY = process.env.VERTEX_API_KEY;
                const VERTEX_PROJECT_ID = process.env.VERTEX_PROJECT_ID;
                const VERTEX_REGION = process.env.VERTEX_REGION || 'us-central1';

                if (VERTEX_API_KEY && VERTEX_PROJECT_ID) {
                    // Google Vertex AI Imagen endpoint
                    const endpoint = `https://${VERTEX_REGION}-aiplatform.googleapis.com/v1/projects/${VERTEX_PROJECT_ID}/locations/${VERTEX_REGION}/publishers/google/models/imagegeneration@006:predict`;

                    // Prepare enhanced prompt for pediatric context
                    const enhancedPrompt = `${revisedData.image_prompt}, warm lighting, family-friendly, realistic photograph, professional quality, safe for children`;

                    console.log('🎨 Generating image with Vertex AI Imagen:', enhancedPrompt);

                    const response = await fetch(endpoint, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${VERTEX_API_KEY}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            instances: [{
                                prompt: enhancedPrompt
                            }],
                            parameters: {
                                sampleCount: 1,
                                aspectRatio: "16:9",
                                safetyFilterLevel: "block_some",
                                personGeneration: "allow_adult"
                            }
                        })
                    });

                    if (response.ok) {
                        const data = await response.json();

                        if (data.predictions && data.predictions[0]) {
                            const base64Image = data.predictions[0].bytesBase64Encoded;

                            // Save image to public/generated folder
                            const fs = await import('fs');
                            const path = await import('path');

                            const outputDir = path.join(process.cwd(), 'public', 'generated');
                            if (!fs.existsSync(outputDir)) {
                                fs.mkdirSync(outputDir, { recursive: true });
                            }

                            const filename = `article-${articleId}-${Date.now()}.png`;
                            const filepath = path.join(outputDir, filename);

                            const imageBuffer = Buffer.from(base64Image, 'base64');
                            fs.writeFileSync(filepath, imageBuffer);

                            updateData.imageUrl = `/generated/${filename}`;
                            console.log('✅ Vertex AI image saved:', updateData.imageUrl);
                        } else {
                            console.warn('⚠️ No image in Vertex response, falling back to Unsplash');
                            // Fallback to Unsplash
                            const keywords = revisedData.image_prompt.split(' ').slice(0, 4).join(',');
                            updateData.imageUrl = `https://source.unsplash.com/1200x630/?${keywords}&sig=${Date.now()}`;
                        }
                    } else {
                        const error = await response.text();
                        console.error('❌ Vertex AI Error:', response.status, error);
                        // Fallback to Unsplash
                        const keywords = revisedData.image_prompt.split(' ').slice(0, 4).join(',');
                        updateData.imageUrl = `https://source.unsplash.com/1200x630/?${keywords}&sig=${Date.now()}`;
                    }
                } else {
                    console.warn('⚠️ Vertex AI credentials missing, using Unsplash');
                    // Fallback to Unsplash
                    const keywords = revisedData.image_prompt.split(' ').slice(0, 4).join(',');
                    updateData.imageUrl = `https://source.unsplash.com/1200x630/?${keywords}&sig=${Date.now()}`;
                }
            } catch (error) {
                console.error('❌ Image generation error:', error);
                // Fallback to Unsplash on any error
                const keywords = revisedData.image_prompt.split(' ').slice(0, 4).join(',');
                updateData.imageUrl = `https://source.unsplash.com/1200x630/?${keywords}&sig=${Date.now()}`;
            }
        }

        // --- SAVE FEEDBACK TO DB FOR TRAINING ---
        // @ts-ignore
        await prisma.articleFeedback.create({
            data: {
                articleId: articleId,
                rating: rating,
                notes: notes,
            }
        });

        await prisma.article.update({
            where: { id: articleId },
            data: updateData
        });

        revalidatePath("/admin/wizard");
        return { success: true };

    } catch (error: any) {
        console.error("Revise Error:", error);
        return { success: false, error: error.message };
    }
}

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
        
        --- İÇERİK OLUŞTURMA KURALLARI ---
        - Makale sonuna "Kaynaklar", "Referanslar" veya "Destek Kaynakları" gibi bir liste ASLA EKLEME. Kaynakları sadece metin içinde dolaylı olarak (örn: "Amerikan Pediatri Akademisi'ne göre...") kullan.

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

            // Image Generation Logic (Google Imagen API Placeholder)
            // Pollinations AI removed per user request.
            // TODO: Implement Google Imagen API integration here.
            const basePrompt = article.image_prompt || `${article.title} realistic photography, medical style`;

            // For now, no image or placeholder.
            const finalImage = null; // System will show "Görsel Yok" placeholder.

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
                    imageUrl: finalImage
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
        console.error("Publishing Error:", error);
        return { success: false, error: String(error) };
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
