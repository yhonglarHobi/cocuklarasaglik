import { prisma } from "@/lib/prisma";

async function listAvailableModels() {
    try {
        const settings = await prisma.systemSettings.findUnique({
            where: { id: "default" },
        });

        if (!settings?.apiKey) {
            console.log("❌ No API key found");
            return;
        }

        console.log("🔍 Fetching available models from Gemini API...");
        console.log("");

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${settings.apiKey}`
        );

        if (!response.ok) {
            console.log("❌ API Error:", response.status, response.statusText);
            const errorText = await response.text();
            console.log("Error details:", errorText);
            return;
        }

        const data = await response.json();

        console.log("✅ Available models:");
        console.log("");

        if (data.models && Array.isArray(data.models)) {
            data.models.forEach((model: any) => {
                const supportsGenerate = model.supportedGenerationMethods?.includes("generateContent");
                const icon = supportsGenerate ? "✅" : "⚠️ ";
                console.log(`${icon} ${model.name}`);
                if (model.displayName) {
                    console.log(`   Display: ${model.displayName}`);
                }
                if (model.description) {
                    console.log(`   Description: ${model.description.substring(0, 80)}...`);
                }
                console.log("");
            });
        } else {
            console.log("No models found in response");
            console.log("Full response:", JSON.stringify(data, null, 2));
        }

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

listAvailableModels();
