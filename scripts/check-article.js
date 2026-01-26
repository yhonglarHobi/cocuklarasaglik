
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkArticle() {
    try {
        const slug = 'hafta-hafta-hamilelik-rehberi';
        console.log(`Searching for slug: ${slug}`);

        const article = await prisma.article.findUnique({
            where: { slug: slug },
            include: { category: true }
        });

        if (article) {
            console.log('✅ Article FOUND:');
            console.log(`- ID: ${article.id}`);
            console.log(`- Title: ${article.title}`);
            console.log(`- Slug: ${article.slug}`);
            console.log(`- CategoryId: ${article.categoryId}`);
            console.log(`- Category: ${article.category ? article.category.name : 'NULL'}`);
        } else {
            console.log('❌ Article NOT FOUND via findUnique(slug)');

            // Try findFirst like in the page logic
            const articleFirst = await prisma.article.findFirst({
                where: {
                    OR: [
                        { id: slug },
                        { slug: slug }
                    ]
                }
            });

            if (articleFirst) {
                console.log('⚠️ Article FOUND via findFirst OR logic (Page Logic):');
                console.log(`- ID: ${articleFirst.id}`);
                console.log(`- Slug: ${articleFirst.slug}`);
            } else {
                console.log('❌ Article strictly NOT FOUND in DB.');
            }
        }

    } catch (error) {
        console.error('❌ Error querying DB:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkArticle();
