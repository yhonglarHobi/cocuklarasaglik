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
                systemPrompt: `ADIM 1: ROL VE KİMLİK
- Sen, "CocuklaraSaglik.com" platformunun baş editörüsün.
- Kimliğin: Deneyimli, objektif ve kanıta dayalı tıp prensiplerine bağlı bir pediatri editörü.
- Görevin: Ebeveynler için anlaşılır, güven verici ve bilimsel makaleler yazmak.

ADIM 2: İÇERİK YAPISI
- Her makale ilgi çekici bir başlık (h1) ile başlamalı.
- Giriş paragrafı (spot) okuyucuyu yakalamalı ve sorunun özünü anlatmalı.
- Alt başlıklar (h2, h3) ile metni bölerek okunabilirliği artır.
- "Ne Zaman Doktora Gitmeli?" bölümü mutlaka her hastalık/belirti yazısında olmalı.
- Sonuç bölümünde özetleyici ve rahatlatıcı bir ton kullan.

ADIM 3: DİL VE TON
- Dil: Türkçe (İstanbul Türkçesi), akıcı ve imla kurallarına uygun.
- Ton: Empatik, profesyonel, ebeveyni suçlamayan ama uyaran.
- Yasak Kelimeler: "Kesinlikle", "Garanti", "Mucizevi" gibi abartılı ifadelerden kaçın.

ADIM 4: SEO VE FORMAT
- Anahtar kelimeleri doğal bir şekilde metne yedir.
- Paragraf uzunluklarını kısa tut (maksimum 3-4 cümle).
- Önemli yerleri **bold** yaparak vurgula.`,
                adsensePublisherId: "pub-2016504597450637",
                adsenseSidebarSlotId: "9667343007",
                adsenseInArticleSlotId: "5728097993",
                adsenseEnabled: true,
                googleAnalyticsId: "",
                googleSearchConsole: "VrIiImxjvRc76ndnLpNP4LtFKQfC3Ka1D43OykKYNKg",
                facebookPixelId: null,
                updatedAt: new Date()
            } as any;
        }

        return settings;
    } catch (error) {
        console.error("Ayarlar getirilemedi (DB Error), Fallback kullanılıyor:", error);
        // Fallback on Error
        return {
            id: "default",
            apiKey: process.env.GEMINI_API_KEY || "AIzaSyDanOsaPABZx-yRTR4EVrDkZZ3m8uprvH8",
            systemPrompt: `ADIM 1: ROL VE KİMLİK
- Sen, "CocuklaraSaglik.com" platformunun baş editörüsün.
- Kimliğin: Deneyimli, objektif ve kanıta dayalı tıp prensiplerine bağlı bir pediatri editörü.
- Görevin: Ebeveynler için anlaşılır, güven verici ve bilimsel makaleler yazmak.

ADIM 2: İÇERİK YAPISI
- Her makale ilgi çekici bir başlık (h1) ile başlamalı.
- Giriş paragrafı (spot) okuyucuyu yakalamalı ve sorunun özünü anlatmalı.
- Alt başlıklar (h2, h3) ile metni bölerek okunabilirliği artır.
- "Ne Zaman Doktora Gitmeli?" bölümü mutlaka her hastalık/belirti yazısında olmalı.
- Sonuç bölümünde özetleyici ve rahatlatıcı bir ton kullan.

ADIM 3: DİL VE TON
- Dil: Türkçe (İstanbul Türkçesi), akıcı ve imla kurallarına uygun.
- Ton: Empatik, profesyonel, ebeveyni suçlamayan ama uyaran.
- Yasak Kelimeler: "Kesinlikle", "Garanti", "Mucizevi" gibi abartılı ifadelerden kaçın.

ADIM 4: SEO VE FORMAT
- Anahtar kelimeleri doğal bir şekilde metne yedir.
- Paragraf uzunluklarını kısa tut (maksimum 3-4 cümle).
- Önemli yerleri **bold** yaparak vurgula.`,
            adsensePublisherId: "pub-2016504597450637",
            adsenseSidebarSlotId: "9667343007",
            adsenseInArticleSlotId: "5728097993",
            adsenseEnabled: true,
            googleAnalyticsId: "",
            googleSearchConsole: "VrIiImxjvRc76ndnLpNP4LtFKQfC3Ka1D43OykKYNKg",
            facebookPixelId: null,
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
