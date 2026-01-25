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

interface SettingsUpdateData {
    apiKey: string;
    systemPrompt: string;
    googleAnalyticsId?: string;
    googleSearchConsole?: string;
    facebookPixelId?: string;
}

export async function updateSystemSettings(data: SettingsUpdateData) {
    try {
        await prisma.systemSettings.upsert({
            where: { id: "default" },
            update: {
                apiKey: data.apiKey,
                systemPrompt: data.systemPrompt,
                googleAnalyticsId: data.googleAnalyticsId,
                googleSearchConsole: data.googleSearchConsole,
                facebookPixelId: data.facebookPixelId
            },
            create: {
                id: "default",
                apiKey: data.apiKey,
                systemPrompt: data.systemPrompt,
                googleAnalyticsId: data.googleAnalyticsId,
                googleSearchConsole: data.googleSearchConsole,
                facebookPixelId: data.facebookPixelId
            },
        });
        revalidatePath("/admin/settings");
        return { success: true };
    } catch (error) {
        console.error("Ayarlar kaydedilemedi:", error);
        return { success: false, error: "Veritabanı hatası" };
    }
}
