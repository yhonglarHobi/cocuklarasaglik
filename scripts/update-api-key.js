const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateApiKey() {
    try {
        await prisma.systemSettings.upsert({
            where: { id: 'default' },
            update: {
                apiKey: 'AIzaSyC5mcHr1SzHYN_yn0PIHjRhVTxREd-Ilnc'
            },
            create: {
                id: 'default',
                apiKey: 'AIzaSyC5mcHr1SzHYN_yn0PIHjRhVTxREd-Ilnc'
            }
        });
        console.log('✅ API Key veritabanına kaydedildi!');
    } catch (error) {
        console.error('❌ Hata:', error);
    } finally {
        await prisma.$disconnect();
    }
}

updateApiKey();
