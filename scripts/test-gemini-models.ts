import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";

async function testGeminiApi() {
    try {
        const settings = await prisma.systemSettings.findUnique({
            where: { id: "default" },
        });

        if (!settings?.apiKey) {
            console.log("❌ No API key found");
            return;
        }

        console.log("🔍 Testing Gemini API with key:", settings.apiKey.substring(0, 15) + "...");
        console.log("");

        const genAI = new GoogleGenerativeAI(settings.apiKey);

        // Test different models
        const modelsToTest = [
            "gemini-pro",
            "gemini-1.5-pro",
            "gemini-1.5-flash",
            "gemini-1.5-flash-001"
        ];

        for (const modelName of modelsToTest) {
            try {
                console.log(`Testing model: ${modelName}...`);
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Say hello");
                const response = await result.response;
                const text = response.text();
                console.log(`✅ ${modelName} WORKS! Response: ${text.substring(0, 50)}...`);
            } catch (error: any) {
                console.log(`❌ ${modelName} FAILED:`, error.message);
            }
            console.log("");
        }

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

testGeminiApi();
