import { prisma } from "@/lib/prisma";

async function checkApiKey() {
    try {
        const settings = await prisma.systemSettings.findUnique({
            where: { id: "default" },
        });

        if (!settings) {
            console.log("❌ No settings found in database");
            return;
        }

        if (!settings.apiKey || settings.apiKey.trim() === "") {
            console.log("❌ API Key is EMPTY or NULL");
            console.log("Please add your Gemini API key at: http://localhost:3001/admin/settings");
        } else {
            console.log("✅ API Key exists in database");
            console.log("Key preview:", settings.apiKey.substring(0, 10) + "...");
        }

        if (!settings.systemPrompt || settings.systemPrompt.trim() === "") {
            console.log("⚠️  System Prompt is EMPTY");
        } else {
            console.log("✅ System Prompt exists");
        }
    } catch (error) {
        console.error("Error checking settings:", error);
    } finally {
        await prisma.$disconnect();
    }
}

checkApiKey();
