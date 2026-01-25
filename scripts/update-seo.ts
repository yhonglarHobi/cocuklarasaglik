
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateSEO() {
    console.log('🔍 SEO Ayarları Güncelleniyor...');

    const GOOGLE_VERIFICATION_CODE = "VrIiImxjvRc76ndnLpNP4LtFKQfC3Ka1D43OykKYNKg";

    try {
        const existing = await prisma.systemSettings.findFirst();

        if (existing) {
            await prisma.systemSettings.update({
                where: { id: existing.id },
                data: {
                    googleSearchConsole: GOOGLE_VERIFICATION_CODE,
                    updatedAt: new Date(),
                },
            });
            console.log('✅ Search Console kodu veritabanına işlendi.');
        } else {
            console.log('⚠️ Sistem ayarları bulunamadı, önce restore-settings.ts çalıştırılmalı.');
        }

    } catch (error) {
        console.error('❌ Hata:', error);
    } finally {
        await prisma.$disconnect();
    }
}

updateSEO();
