import { prisma } from './src/lib/prisma';

async function checkAds() {
    const settings = await prisma.systemSettings.findUnique({
        where: { id: 'default' }
    });
    console.log('--- REKLAM AYARLARI KONTROLÜ ---');
    console.log('Reklamlar Aktif mi:', settings?.adsenseEnabled);
    console.log('Publisher ID:', settings?.adsensePublisherId);
    console.log('Sidebar Slot:', settings?.adsenseSidebarSlotId);
    console.log('Makale Slot:', settings?.adsenseInArticleSlotId);
    console.log('-------------------------------');
    await prisma.$disconnect();
}
checkAds();
