import { prisma } from './src/lib/prisma';

async function check() {
    const settings = await prisma.systemSettings.findUnique({
        where: { id: 'default' }
    });
    console.log('VALUE_IN_DB:', settings?.googleSearchConsole);
    await prisma.$disconnect();
}
check();
