"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getMenuItems() {
    try {
        const items = await prisma.menuItem.findMany({
            orderBy: {
                order: 'asc',
            },
        });
        return items;
    } catch (error) {
        console.error("Menü getirilemedi:", error);
        return [];
    }
}

export async function updateMenuItems(items: { name: string; href: string; order: number }[]) {
    try {
        // Transaction: Clear all and re-insert to ensure sync
        await prisma.$transaction([
            prisma.menuItem.deleteMany(),
            prisma.menuItem.createMany({
                data: items.map((item) => ({
                    name: item.name,
                    href: item.href,
                    order: item.order,
                })),
            }),
        ]);

        revalidatePath("/"); // Revalidate home/layout
        revalidatePath("/admin/menu");
        return { success: true };
    } catch (error) {
        console.error("Menü kaydedilemedi:", error);
        return { success: false, error: "Veritabanı hatası" };
    }
}
