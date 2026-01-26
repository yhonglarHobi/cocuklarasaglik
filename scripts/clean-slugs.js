const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanSlugs() {
    try {
        console.log('🔍 Mevcut makaleler kontrol ediliyor...\n');

        // Tüm makaleleri getir
        const articles = await prisma.article.findMany({
            orderBy: { createdAt: 'asc' }
        });

        console.log(`📊 Toplam ${articles.length} makale bulundu.\n`);

        let updatedCount = 0;
        let skippedCount = 0;
        let wordpressCount = 0;

        for (const article of articles) {
            // WordPress'ten gelenleri atla
            if (article.source === 'WORDPRESS_IMPORT') {
                console.log(`⏭️  ATLANDI (WordPress): ${article.slug}`);
                wordpressCount++;
                continue;
            }

            // Slug'da timestamp var mı kontrol et (uzun sayı dizisi)
            const hasTimestamp = /-\d{13,}/.test(article.slug);

            if (!hasTimestamp) {
                console.log(`✅ ZATEN TEMİZ: ${article.slug}`);
                skippedCount++;
                continue;
            }

            // Timestamp'i kaldır
            let cleanSlug = article.slug.replace(/-\d{13,}\d*$/, '');

            // Özel karakterleri temizle
            cleanSlug = cleanSlug
                .toLowerCase()
                .replace(/[^a-z0-9-]/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '');

            // Duplicate kontrolü
            let uniqueSlug = cleanSlug;
            let counter = 1;

            while (true) {
                const existing = await prisma.article.findFirst({
                    where: {
                        slug: uniqueSlug,
                        id: { not: article.id } // Kendisi hariç
                    }
                });

                if (!existing) break;

                counter++;
                uniqueSlug = `${cleanSlug}-${counter}`;
            }

            // Güncelle
            await prisma.article.update({
                where: { id: article.id },
                data: { slug: uniqueSlug }
            });

            console.log(`🔧 GÜNCELLENDİ: ${article.slug} → ${uniqueSlug}`);
            updatedCount++;
        }

        console.log('\n' + '='.repeat(60));
        console.log('📈 ÖZET:');
        console.log(`   ✅ Güncellenen: ${updatedCount}`);
        console.log(`   ⏭️  WordPress (atlandı): ${wordpressCount}`);
        console.log(`   ✓  Zaten temiz: ${skippedCount}`);
        console.log(`   📊 Toplam: ${articles.length}`);
        console.log('='.repeat(60));

    } catch (error) {
        console.error('❌ Hata:', error);
    } finally {
        await prisma.$disconnect();
    }
}

cleanSlugs();
