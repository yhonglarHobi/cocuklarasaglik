
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function restoreSettings() {
    console.log('🔄 Ayarlar ve Analitik verileri geri yükleniyor...');

    // 1. Gemini API (İçerik Üretimi İçin)
    const GEMINI_KEY = process.env.GEMINI_API_KEY || "AIzaSyCI2xKBECH8v1n9aXQWxrQLKGdZRp4dQq0";

    // 2. AdSense (Reklamlar İçin)
    // ads.txt dosyasından alınan ID
    const ADSENSE_PUB_ID = "pub-9020300486683881";

    // 3. System Prompt (AI Davranışı)
    const SYSTEM_PROMPT = `ADIM 1: ROL VE KİMLİK
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
- Önemli yerleri **bold** yaparak vurgula.`;

    try {
        const existing = await prisma.systemSettings.findFirst();

        const dataToUpdate = {
            apiKey: GEMINI_KEY,
            systemPrompt: SYSTEM_PROMPT,
            adsensePublisherId: ADSENSE_PUB_ID,
            adsenseEnabled: true, // Reklamları otomatik aktif et
            adsenseInArticleSlotId: "1234567890", // Örnek Slot ID (Panelden değiştirilmeli)
            adsenseSidebarSlotId: "0987654321",   // Örnek Slot ID
            updatedAt: new Date(),
        };

        if (existing) {
            await prisma.systemSettings.update({
                where: { id: existing.id },
                data: dataToUpdate,
            });
            console.log('✅ Mevcut ayarlar güncellendi: Gemini API + AdSense + Prompt');
        } else {
            await prisma.systemSettings.create({
                data: {
                    id: "default",
                    ...dataToUpdate,
                    googleAnalyticsId: "", // Boş bırakıldı (Panelden eklenebilir)
                    googleSearchConsole: "", // Boş bırakıldı
                },
            });
            console.log('✅ Yeni ayarlar oluşturuldu: Gemini API + AdSense + Prompt');
        }

        console.log('🎉 İŞLEM BAŞARILI! Sitede yenileme yapabilirsiniz.');
        console.log('👉 Not: Search Console ve Analytics ID lerini panelden manuel girebilirsiniz veya iletirseniz hemen ekleyeyim.');

    } catch (error) {
        console.error('❌ Hata oluştu:', error);
    } finally {
        await prisma.$disconnect();
    }
}

restoreSettings();
