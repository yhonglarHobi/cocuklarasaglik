"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSystemSettings() {
    try {
        const settings = await prisma.systemSettings.findUnique({
            where: { id: "default" },
        });

        // HARDCODED FALLBACKS (If DB fails or is empty on Vercel)
        if (!settings) {
            return {
                id: "default",
                apiKey: process.env.GEMINI_API_KEY || "AIzaSyDanOsaPABZx-yRTR4EVrDkZZ3m8uprvH8",
                systemPrompt: "ADIM 1: ROL VE KİMLİK...",
                adsensePublisherId: "pub-2016504597450637",
                adsenseSidebarSlotId: "9667343007",
                adsenseInArticleSlotId: "5728097993",
                adsenseEnabled: true,
                googleAnalyticsId: "",
                googleSearchConsole: "VrIiImxjvRc76ndnLpNP4LtFKQfC3Ka1D43OykKYNKg",
                facebookPixelId: null,
                createdAt: new Date(),
                updatedAt: new Date()
            };
        }

        return settings;
    } catch (error) {
        console.error("Ayarlar getirilemedi (DB Error), Fallback kullanılıyor:", error);
        // Fallback on Error
        return {
            id: "default",
            apiKey: process.env.GEMINI_API_KEY || "AIzaSyDanOsaPABZx-yRTR4EVrDkZZ3m8uprvH8",
            systemPrompt: "ADIM 1: ROL VE KİMLİK...",
            adsensePublisherId: "pub-2016504597450637",
            adsenseSidebarSlotId: "9667343007",
            adsenseInArticleSlotId: "5728097993",
            adsenseEnabled: true,
            googleSearchConsole: "VrIiImxjvRc76ndnLpNP4LtFKQfC3Ka1D43OykKYNKg",
            createdAt: new Date(),
            updatedAt: new Date()
        };
    }
}

interface SettingsUpdateData {
    apiKey: string;
    systemPrompt: string;
    googleAnalyticsId?: string;
    googleSearchConsole?: string;
    facebookPixelId?: string;
    // AdSense Fields
    adsensePublisherId?: string;
    adsenseSidebarSlotId?: string;
    adsenseInArticleSlotId?: string;
    adsenseEnabled?: boolean;
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
                facebookPixelId: data.facebookPixelId,
                adsensePublisherId: data.adsensePublisherId,
                adsenseSidebarSlotId: data.adsenseSidebarSlotId,
                adsenseInArticleSlotId: data.adsenseInArticleSlotId,
                adsenseEnabled: data.adsenseEnabled
            },
            create: {
                id: "default",
                apiKey: data.apiKey,
                systemPrompt: data.systemPrompt,
                googleAnalyticsId: data.googleAnalyticsId,
                googleSearchConsole: data.googleSearchConsole,
                facebookPixelId: data.facebookPixelId,
                adsensePublisherId: data.adsensePublisherId,
                adsenseSidebarSlotId: data.adsenseSidebarSlotId,
                adsenseInArticleSlotId: data.adsenseInArticleSlotId,
                adsenseEnabled: data.adsenseEnabled || false
            },
        });
        revalidatePath("/admin/settings");
        return { success: true };
    } catch (error) {
        console.error("Ayarlar kaydedilemedi:", error);
        return { success: false, error: "Veritabanı hatası" };
    }
}
