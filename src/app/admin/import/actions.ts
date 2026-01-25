"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { parseStringPromise } from "xml2js";

interface ImportResult {
    success: boolean;
    importedCount?: number;
    error?: string;
    details?: string[];
}

export async function importWordpressXmlAction(xmlContent: string): Promise<ImportResult> {
    try {
        const result = await parseStringPromise(xmlContent);

        // RSS yapısını kontrol et
        const channel = result?.rss?.channel?.[0];
        if (!channel) {
            return { success: false, error: "Geçersiz WordPress XML formatı." };
        }

        const items = channel.item || [];
        let importedCount = 0;
        const logs: string[] = [];

        // Varsayılan bir yazar bul veya oluştur (Admin)
        let author = await prisma.user.findFirst({ where: { role: "ADMIN" } });
        if (!author) {
            // Fallback: İlk kullanıcıyı al
            author = await prisma.user.findFirst();
        }

        if (!author) {
            return { success: false, error: "Sistemde hiç kullanıcı yok. Önce bir admin oluşturun." };
        }

        for (const item of items) {
            try {
                // Sadece yayınlanmış yazıları (post) al, sayfaları (page) ve ekleri (attachment) atla
                const postType = item["wp:post_type"]?.[0];
                const status = item["wp:status"]?.[0];

                if (postType !== "post" || status !== "publish") continue;

                const title = item.title?.[0];
                const content = item["content:encoded"]?.[0];
                const excerpt = item["excerpt:encoded"]?.[0] || "";
                const slug = item["wp:post_name"]?.[0];
                const pubDate = item.pubDate?.[0] ? new Date(item.pubDate[0]) : new Date();

                // Kategori (birden fazla olabilir, ilkini alalım)
                // Kategori yapısı XML'de: <category domain="category" nicename="bebek">Bebek</category>
                let categoryId = null;
                const categories = item.category || [];
                for (const cat of categories) {
                    if (cat.$?.domain === "category") {
                        const catName = cat._;
                        const catSlug = cat.$?.nicename;

                        // Kategoriyi bul veya oluştur
                        if (catSlug && catName) {
                            const existingCat = await prisma.category.findUnique({ where: { slug: catSlug } });
                            if (existingCat) {
                                categoryId = existingCat.id;
                            } else {
                                // Yeni kategori oluştur
                                const newCat = await prisma.category.create({
                                    data: { name: catName, slug: catSlug }
                                });
                                categoryId = newCat.id;
                            }
                            break; // İlk kategoriyi aldık
                        }
                    }
                }

                if (!title || !slug) {
                    logs.push(`Atlandı (Başlık/Slug yok): ${title || 'Bilinmiyor'}`);
                    continue;
                }

                // Makale zaten var mı kontrol et (Slug'a göre)
                const existingArticle = await prisma.article.findUnique({ where: { slug } });

                if (existingArticle) {
                    logs.push(`Atlandı (Zaten var): ${slug}`);
                    continue;
                }

                // --- GÖRSEL İŞLEME (Zor kısım) ---
                // WordPress görseli XML'de attachment olarak ayrı durur veya postmeta içinde _thumbnail_id ile referans verilir.
                // Basit çözüm: İçerikten ilk görseli çekmeye çalışabiliriz veya XML'deki thumbnail URL'sini bulabilirsek.
                // Şimdilik görseli boş geçelim veya içerikten regex ile bulalım.
                let imageUrl = null;
                // Regex ile içerikteki ilk img src'yi bulma denemesi
                const imgMatch = content.match(/src="([^"]+)"/);
                if (imgMatch && imgMatch[1]) {
                    imageUrl = imgMatch[1];
                }

                // Veritabanına kaydet (TASLAK OLARAK)
                await prisma.article.create({
                    data: {
                        title: title,
                        slug: slug, // URL AYNEN KORUNDU
                        content: content,
                        excerpt: excerpt.substring(0, 300),
                        published: false, // Kontrol edilmek üzere TASLAK yapıldı
                        source: "WORDPRESS_IMPORT", // Kaynak belirtildi
                        authorId: author.id,
                        categoryId: categoryId,
                        imageUrl: imageUrl,
                        createdAt: pubDate,
                        viewCount: 0
                    }
                });

                logs.push(`Eklendi (Taslak - WORDPRESS_IMPORT): ${title}`);
                importedCount++;

            } catch (err: any) {
                logs.push(`Hata (${item.title?.[0]}): ${err.message}`);
            }
        }

        revalidatePath("/");
        revalidatePath("/admin/wizard-v2");
        revalidatePath("/makaleler");

        return {
            success: true,
            importedCount,
            details: logs
        };

    } catch (error: any) {
        console.error("Import XML Error:", error);
        return { success: false, error: "Dosya işlenirken sunucu hatası: " + error.message };
    }
}
