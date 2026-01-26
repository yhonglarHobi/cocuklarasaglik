"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";
import { getSystemSettings } from "@/app/admin/settings/actions";
import { revalidatePath } from "next/cache";


// --- GÖRSEL YÜKLEME AKSİYONU (Base64 Fallback for Serverless) ---
export async function uploadImageAction(formData: FormData) {
    try {
        const file = formData.get("file") as File;
        if (!file) {
            return { success: false, error: "Dosya bulunamadı." };
        }

        // Convert file to Buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Convert to Base64 String
        const base64String = buffer.toString('base64');
        const mimeType = file.type || 'image/jpeg'; // Default to jpeg if unknown
        const dataUrl = `data:${mimeType};base64,${base64String}`;

        // Return Base64 URL directly (No file system write)
        return { success: true, url: dataUrl };

    } catch (error: any) {
        console.error("Upload Error:", error);
        return { success: false, error: "Dosya işlenemedi: " + error.message };
    }
}

// --- YENİ EKLENEN İYİLEŞTİRME AKSİYONU ---
export async function reviseArticleAction(articleId: string, rating: number, notes: string) {
    try {
        const settings = await getSystemSettings();
        // Fallback to environment variable if DB setting is missing
        const apiKey = settings?.apiKey || process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return { success: false, error: 'API Anahtarı eksik. Lütfen Admin Ayarlar sayfasından Gemini API Key ekleyin.' };
        }

        const article = await prisma.article.findUnique({ where: { id: articleId } });
        if (!article) return { success: false, error: "Makale bulunamadı." };

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

        const refinementPrompt = `
        SİSTEM ROLÜ: Sen, uzman bir tıbbi editör ve içerik stratejistisin.

        GİRDİLER:
        Taslak Metin: ${article.content}
        Mevcut Başlık: ${article.title}
        Doktorun Puanı: ${rating} / 100
        Doktorun Notları: "${notes}"

        TALİMATLAR:
        1. Puan < 80 ise: Yazının tonunu ve yapısını kökten gözden geçir.
        2. Puan > 80 ise: Mevcut yapıyı koru, sadece spesifik geri bildirimleri uygula.
        3. Görsel Talebi: Eğer notlarda "görsel" kelimesi geçiyorsa, "image_prompt" alanına İNGİLİZCE prompt yaz.
        4. Kaynakça Listesi: Metin sonuna ASLA kaynakça listesi ekleme.

        ÖNEMLİ: Yanıtın SADECE aşağıdaki JSON formatında olmalı. Başka hiçbir metin yazma!

        {
            "title": "Revize Edilmiş Başlık",
            "excerpt": "Revize edilmiş kısa özet (max 160 karakter)",
            "content": "Revize edilmiş HTML içeriği...",
            "image_prompt": ""
        }
        `;

        const result = await model.generateContent(refinementPrompt);
        const response = await result.response;
        const text = response.text();

        console.log('🔍 AI Raw Response:', text.substring(0, 200)); // Debug log

        let CleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
        let revisedData;
        try {
            revisedData = JSON.parse(CleanJson);
        } catch (e) {
            // Fallback: try to extract JSON if mixed with text
            const jsonMatch = CleanJson.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                try {
                    revisedData = JSON.parse(jsonMatch[0]);
                } catch (e2) {
                    console.error('JSON Parse Error:', e2);
                    console.error('Failed JSON:', jsonMatch[0].substring(0, 500));
                    return { success: false, error: "AI yanıtı işlenemedi. Lütfen tekrar deneyin." };
                }
            } else {
                console.error('No JSON found in response:', CleanJson.substring(0, 500));
                return { success: false, error: "AI yanıt formatı hatalı. Lütfen tekrar deneyin." };
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
                const { generateImageWithFallback } = await import('@/lib/vertex-imagen');
                const imageUrl = await generateImageWithFallback(revisedData.image_prompt, {
                    aspectRatio: '16:9',
                    safetyFilterLevel: 'block_some',
                    personGeneration: 'allow_adult'
                });

                if (imageUrl) {
                    updateData.imageUrl = imageUrl;
                    console.log('✅ Image generated:', imageUrl);
                }
            } catch (error: any) {
                console.error('❌ Image generation error:', error);
                // Continue without image on error
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

        revalidatePath("/admin/wizard-v2");
        return { success: true };

    } catch (error: any) {
        console.error("Revise Error:", error);
        return { success: false, error: error.message };
    }
}

// --- MANUEL DÜZENLEME AKSİYONU ---
export async function updateArticleContentAction(articleId: string, title: string, content: string, excerpt: string, imageUrl?: string) {
    try {
        await prisma.article.update({
            where: { id: articleId },
            data: { title, content, excerpt, imageUrl }
        });
        revalidatePath("/admin/wizard-v2");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// --- GÖRSEL YENİLEME AKSİYONU ---
export async function regenerateImageAction(articleId: string) {
    try {
        const article = await prisma.article.findUnique({ where: { id: articleId } });
        if (!article) return { success: false, error: "Makale bulunamadı." };

        const settings = await getSystemSettings();
        const apiKey = settings?.apiKey || process.env.GEMINI_API_KEY;
        if (!apiKey) return { success: false, error: "API Anahtarı eksik. Lütfen ayarlardan ekleyin." };

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

        // 1. Prompt Oluştur
        const promptParams = `
        GÖREV: Aşağıdaki makale için fotogerçekçi, sinematik ve etkileyici bir görsel oluşturma promptu (İngilizce) yaz.
        Makale Başlığı: ${article.title}
        Makale Özeti: ${article.content.substring(0, 300)}
        
        KURALLAR:
        - Prompt SADECE İngilizce olsun.
        - "Cinematic lighting, high resolution, photorealistic, 8k" gibi stil kelimeleri ekle.
        - İnsanlar varsa (bebek, anne vb.) yüzleri net ve mutlu olsun.
        - Sadece prompt metnini döndür.
        `;

        const result = await model.generateContent(promptParams);
        const imagePrompt = result.response.text().trim();

        // 2. Görseli Üret (Vertex Imagen)
        const { generateImageWithFallback } = await import('@/lib/vertex-imagen');
        const imageUrl = await generateImageWithFallback(imagePrompt, {
            aspectRatio: '16:9',
            safetyFilterLevel: 'block_some',
            personGeneration: 'allow_adult'
        });

        if (!imageUrl) return { success: false, error: "Görsel servisi yanıt vermedi." };

        // 3. Veritabanını Güncelle
        await prisma.article.update({
            where: { id: articleId },
            data: { imageUrl: imageUrl }
        });

        revalidatePath("/admin/wizard-v2");
        return { success: true, imageUrl };

    } catch (error: any) {
        console.error("Image Gen Error:", error);
        return { success: false, error: error.message };
    }
}


// --- SEO İYİLEŞTİRME AKSİYONU (YENİ) ---
export async function improveSEOAction(articleId: string, improvementType: 'meta' | 'length' | 'keyword', focusKeyword: string) {
    try {
        const settings = await getSystemSettings();
        const apiKey = settings?.apiKey || process.env.GEMINI_API_KEY;
        if (!apiKey) return { success: false, error: "API Anahtarı eksik. Lütfen ayarlardan ekleyin." };

        const article = await prisma.article.findUnique({ where: { id: articleId } });
        if (!article) return { success: false, error: "Makale bulunamadı." };

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

        let prompt = "";

        switch (improvementType) {
            case 'meta':
                prompt = `
                GÖREV: Aşağıdaki makale için harika bir SEO Meta Açıklaması (Excerpt) yaz.
                Odak Anahtar Kelime: "${focusKeyword}"
                Makale Başlığı: "${article.title}"
                Makale Özeti: "${article.content.substring(0, 500)}..."
                
                KURALLAR:
                1. Uzunluk 145-160 karakter arasında olsun.
                2. Odak anahtar kelimeyi mutlaka geçir.
                3. Tıklamaya teşvik edici, merak uyandırıcı olsun.
                4. Sadece meta açıklama metnini döndür. Başka bir şey yazma.
                `;
                break;

            case 'length':
                prompt = `
                GÖREV: Aşağıdaki makale içeriğini genişlet ve detaylandır.
                Mevcut İçerik: "${article.content}"
                
                KURALLAR:
                1. Mevcut içeriği koru ama her başlığın altına daha fazla detay, örnek ve açıklama ekle.
                2. Toplam kelime sayısını en az 200 kelime artır.
                3. Bilimsel ve güvenilir bir ton kullan.
                4. Sadece genişletilmiş HTML içeriğini döndür. Markdown değil, HTML formatında olsun.
                `;
                break;

            case 'keyword':
                prompt = `
                GÖREV: Aşağıdaki makale içeriğine "${focusKeyword}" anahtar kelimesini doğal bir şekilde yerleştir.
                Mevcut İçerik: "${article.content}"
                
                KURALLAR:
                1. Anahtar kelimeyi metnin akışını bozmadan, mantıklı yerlere ekle.
                2. Anahtar kelime yoğunluğunu %2 civarına çıkar.
                3. Kesinlikle <strong> veya <b> etiketi kullanma. Kelimeler normal metin olarak kalsın.
                4. Sadece revize edilmiş HTML içeriğini döndür.
                `;
                break;
        }

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const outputText = response.text().trim(); // Temiz çıktı

        // Veritabanını güncelle
        const updateData: any = {};
        if (improvementType === 'meta') {
            updateData.excerpt = outputText;
        } else {
            updateData.content = outputText.replace(/```html/g, "").replace(/```/g, "").trim();
        }

        await prisma.article.update({
            where: { id: articleId },
            data: updateData
        });

        // Güncel veriyi döndür ki frontend anında yenilensin
        return { success: true, updatedField: improvementType === 'meta' ? 'excerpt' : 'content', newValue: updateData[improvementType === 'meta' ? 'excerpt' : 'content'] };

    } catch (error: any) {
        console.error("SEO Improve Error:", error);
        return { success: false, error: error.message };
    }
}

export async function generateArticlesAction(targetCategory: string, count: number) {
    try {
        const settings = await getSystemSettings();
        const safeSettings = settings || { apiKey: null, systemPrompt: null };

        const apiKey = safeSettings.apiKey || process.env.GEMINI_API_KEY;
        const systemPrompt = safeSettings.systemPrompt || `Sen, "CocuklaraSaglik.com" platformunun baş editörüsün. Deneyimli, objektif ve kanıta dayalı tıp prensiplerine bağlı bir pediatri editörüsün.`;

        if (!apiKey) return { success: false, error: "API Anahtarı bulunamadı! Lütfen Admin > Ayarlar sayfasından Gemini API Key ekleyin." };

        const genAI = new GoogleGenerativeAI(apiKey);
        // Downgrade to 1.5-flash to check compatibilty
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

        const dynamicPrompt = `
        ${systemPrompt}

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


            // Smart slug generation: Clean slug, check for duplicates, append number if needed
            let baseSlug = (article.slug || "yazi")
                .toLowerCase()
                .replace(/[^a-z0-9-]/g, '-') // Remove special chars
                .replace(/-+/g, '-') // Remove multiple dashes
                .replace(/^-|-$/g, ''); // Trim dashes

            let uniqueSlug = baseSlug;
            let counter = 1;

            // Check if slug exists, if yes, append -2, -3, etc.
            while (true) {
                const existing = await prisma.article.findUnique({
                    where: { slug: uniqueSlug }
                });

                if (!existing) break; // Slug is unique, use it

                counter++;
                uniqueSlug = `${baseSlug}-${counter}`;
            }

            // Image Generation with Vertex AI (Gemini) - No Fallback
            const basePrompt = article.image_prompt || `${article.title} realistic photography, medical style`;

            let finalImage: string | null = null;

            try {
                const { generateImageWithFallback } = await import('@/lib/vertex-imagen');
                finalImage = await generateImageWithFallback(basePrompt, {
                    aspectRatio: '16:9',
                    safetyFilterLevel: 'block_some',
                    personGeneration: 'allow_adult'
                });

                if (finalImage) {
                    console.log('✅ Gemini görsel oluşturuldu:', article.title, '→', finalImage);
                } else {
                    console.log('⚠️ Görsel oluşturulamadı, makale görselsiz kaydedilecek:', article.title);
                }
            } catch (error: any) {
                console.error('❌ Görsel oluşturma hatası:', error);
                // Görsel olmadan devam et
            }

            let altText: string | null = null;
            if (finalImage) {
                try {
                    const altPrompt = `
                     SİSTEM: Sen bir SEO uzmanısın.
                     GÖREV: Aşağıdaki makale başlığı ve görsel promptu için Türkçe, SEO uyumlu, 5-10 kelimelik bir "Görsel Alt Metni" (Alt Text) yaz.
                     Başlık: ${article.title}
                     Görsel Tanımı: ${basePrompt}
                     SADECE ALT METNİ YAZ. Başka hiçbir şey yazma.
                     `;
                    const altRes = await model.generateContent(altPrompt);
                    altText = altRes.response.text().trim();
                    console.log('✅ Alt text üretildi:', altText);
                } catch (e) {
                    console.error('⚠️ Alt text üretilemedi:', e);
                }
            }

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

        revalidatePath("/admin/wizard-v2");
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
        revalidatePath("/admin/wizard-v2");
        revalidatePath("/", "layout"); // Tüm siteyi yenile (Layout dahil)
        revalidatePath("/makaleler");
        return { success: true };
    } catch (error) {
        console.error("Publishing Error:", error);
        return { success: false, error: String(error) };
    }
}

export async function deleteArticleAction(id: string) {
    try {
        await prisma.article.delete({ where: { id } });
        revalidatePath("/admin/wizard-v2");
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
