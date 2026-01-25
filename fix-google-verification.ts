import { prisma } from './src/lib/prisma';

async function fixGoogleVerification() {
    try {
        // Mevcut ayarları kontrol et
        const current = await prisma.systemSettings.findUnique({
            where: { id: 'default' }
        });

        console.log('Mevcut Google Search Console:', current?.googleSearchConsole);

        // Düzelt: gooqle -> google
        if (current?.googleSearchConsole?.includes('gooqle')) {
            const fixed = current.googleSearchConsole.replace('gooqle', 'google');

            await prisma.systemSettings.update({
                where: { id: 'default' },
                data: {
                    googleSearchConsole: fixed
                }
            });

            console.log('✅ Düzeltildi:', fixed);
        } else {
            console.log('✅ Zaten doğru veya ayar yok');
        }

    } catch (error) {
        console.error('❌ Hata:', error);
    } finally {
        await prisma.$disconnect();
    }
}

fixGoogleVerification();
