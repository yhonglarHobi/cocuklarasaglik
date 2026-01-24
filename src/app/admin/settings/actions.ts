"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSystemSettings() {
    try {
        const settings = await prisma.systemSettings.findUnique({
            where: { id: "default" },
        });
        return settings;
    } catch (error) {
        console.error("Ayarlar getirilemedi:", error);
        return null;
    }
}

export async function updateSystemSettings(apiKey: string, systemPrompt: string) {
    try {
        await prisma.systemSettings.upsert({
            where: { id: "default" },
            update: {
                apiKey,
                systemPrompt,
            },
            create: {
                id: "default",
                apiKey,
                systemPrompt,
            },
        });
        revalidatePath("/admin/settings");
        return { success: true };
    } catch (error) {
        console.error("Ayarlar kaydedilemedi:", error);
        return { success: false, error: "Veritabanı hatası" };
    }
}
