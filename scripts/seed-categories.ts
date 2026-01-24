
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const agesStages = [
    "Hamilelik",
    "Bebek",
    "Yürümeye Başlayan (Toddler)",
    "Okul Öncesi",
    "İlkokul Çağı",
    "Ergenlik",
    "Genç Yetişkin"
];

async function main() {
    console.log("Seeding categories...");

    for (const name of agesStages) {
        const slug = name.toLowerCase()
            .replace(/ /g, "-")
            .replace(/[ğüşıöç]/g, (c) => ({ 'ğ': 'g', 'ü': 'u', 'ş': 's', 'ı': 'i', 'ö': 'o', 'ç': 'c' }[c] || c))
            .replace(/[()]/g, "") // Remove parentheses for nicer slug
            .replace(/--/g, "-"); // Fix double hyphens

        const existing = await prisma.category.findFirst({
            where: {
                OR: [
                    { name: name },
                    { slug: slug }
                ]
            }
        });

        if (!existing) {
            await prisma.category.create({
                data: {
                    name,
                    slug
                }
            });
            console.log(`Created: ${name}`);
        } else {
            console.log(`Exists: ${name}`);
        }
    }

    console.log("Done.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
