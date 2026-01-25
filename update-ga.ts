import { prisma } from './src/lib/prisma';

async function updateGA() {
    const gaId = 'G-MJE2FRE8G4';
    try {
        await prisma.systemSettings.upsert({
            where: { id: 'default' },
            update: { googleAnalyticsId: gaId },
            create: {
                id: 'default',
                googleAnalyticsId: gaId,
                apiKey: '',
                systemPrompt: ''
            },
        });
        console.log('✅ Google Analytics ID updated in DB:', gaId);
    } catch (error) {
        console.error('❌ Error updating GA ID:', error);
    } finally {
        await prisma.$disconnect();
    }
}
updateGA();
