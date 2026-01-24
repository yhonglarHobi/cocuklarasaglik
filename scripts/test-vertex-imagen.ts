/**
 * Test Script: Vertex AI Imagen Integration
 * Tests whether the API key and project configuration work correctly
 */

import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';

async function testVertexImagen() {
    const VERTEX_API_KEY = process.env.VERTEX_API_KEY;
    const VERTEX_PROJECT_ID = process.env.VERTEX_PROJECT_ID;
    const VERTEX_REGION = process.env.VERTEX_REGION || 'us-central1';

    if (!VERTEX_API_KEY || !VERTEX_PROJECT_ID) {
        console.error('❌ Missing VERTEX_API_KEY or VERTEX_PROJECT_ID in .env');
        process.exit(1);
    }

    console.log('📝 Using Project ID:', VERTEX_PROJECT_ID);
    console.log('🌍 Using Region:', VERTEX_REGION);

    const endpoint = `https://${VERTEX_REGION}-aiplatform.googleapis.com/v1/projects/${VERTEX_PROJECT_ID}/locations/${VERTEX_REGION}/publishers/google/models/imagegeneration@006:predict`;

    const prompt = "a happy baby playing with colorful toys, realistic photograph, high quality";

    console.log('🎨 Testing prompt:', prompt);
    console.log('🔗 Endpoint:', endpoint);

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${VERTEX_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                instances: [{
                    prompt: prompt
                }],
                parameters: {
                    sampleCount: 1,
                    aspectRatio: "16:9",
                    safetyFilterLevel: "block_some",
                    personGeneration: "allow_adult"
                }
            })
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('❌ API Error:', response.status, error);
            process.exit(1);
        }

        const data = await response.json();
        console.log('✅ API Response received!');

        if (data.predictions && data.predictions[0]) {
            const base64Image = data.predictions[0].bytesBase64Encoded;

            // Save test image
            const outputDir = path.join(process.cwd(), 'public', 'test-images');
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            const filename = `test-${Date.now()}.png`;
            const filepath = path.join(outputDir, filename);

            const imageBuffer = Buffer.from(base64Image, 'base64');
            fs.writeFileSync(filepath, imageBuffer);

            console.log('✅ Test image saved to:', `/test-images/${filename}`);
            console.log('🎉 Vertex AI Imagen is working correctly!');
        } else {
            console.error('❌ No image data in response:', JSON.stringify(data, null, 2));
        }

    } catch (error) {
        console.error('❌ Request failed:', error);
        process.exit(1);
    }
}

testVertexImagen();
