/**
 * Test Script: Vertex AI Imagen Integration
 * Tests whether the API key and project configuration work correctly
 */

import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

/**
 * Get OAuth 2.0 access token using Service Account credentials
 */
async function getAccessToken(credentials: any): Promise<{ success: boolean; token?: string; error?: string }> {
    try {
        // Create JWT
        const now = Math.floor(Date.now() / 1000);
        const jwtHeader = Buffer.from(JSON.stringify({
            alg: 'RS256',
            typ: 'JWT'
        })).toString('base64url');

        const jwtClaim = Buffer.from(JSON.stringify({
            iss: credentials.client_email,
            scope: 'https://www.googleapis.com/auth/cloud-platform',
            aud: 'https://oauth2.googleapis.com/token',
            exp: now + 3600,
            iat: now
        })).toString('base64url');

        const jwtData = `${jwtHeader}.${jwtClaim}`;

        // Sign JWT with private key
        const sign = crypto.createSign('RSA-SHA256');
        sign.update(jwtData);
        const signature = sign.sign(credentials.private_key, 'base64url');

        const jwt = `${jwtData}.${signature}`;

        // Exchange JWT for access token
        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                assertion: jwt
            })
        });

        if (!response.ok) {
            const error = await response.text();
            return { success: false, error: `OAuth error: ${error}` };
        }

        const data = await response.json();
        return { success: true, token: data.access_token };

    } catch (error: any) {
        return { success: false, error: error.message };
    }
}



async function testVertexImagen() {
    const VERTEX_PROJECT_ID = process.env.VERTEX_PROJECT_ID;
    const VERTEX_REGION = process.env.VERTEX_REGION || 'us-central1';
    const CREDENTIALS_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS || './google-credentials.json';

    if (!VERTEX_PROJECT_ID) {
        console.error('❌ Missing VERTEX_PROJECT_ID in .env');
        process.exit(1);
    }

    // Check if credentials file exists
    if (!fs.existsSync(CREDENTIALS_PATH)) {
        console.error('❌ Google credentials file not found at:', CREDENTIALS_PATH);
        console.error('📖 Please follow the setup guide in GOOGLE_IMAGEN_SETUP.md');
        process.exit(1);
    }

    console.log('📝 Using Project ID:', VERTEX_PROJECT_ID);
    console.log('🌍 Using Region:', VERTEX_REGION);
    console.log('🔑 Using Credentials:', CREDENTIALS_PATH);

    // Load service account credentials
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf-8'));

    // Get OAuth 2.0 access token
    console.log('🔐 Getting OAuth access token...');
    const tokenResponse = await getAccessToken(credentials);

    if (!tokenResponse.success) {
        console.error('❌ Failed to get access token:', tokenResponse.error);
        process.exit(1);
    }

    const accessToken = tokenResponse.token;
    console.log('✅ Access token obtained successfully');

    // Use imagegeneration@005 (latest stable version before 006)
    const endpoint = `https://${VERTEX_REGION}-aiplatform.googleapis.com/v1/projects/${VERTEX_PROJECT_ID}/locations/${VERTEX_REGION}/publishers/google/models/imagegeneration@005:predict`;

    const prompt = "a happy baby playing with colorful toys, realistic photograph, high quality";

    console.log('🎨 Testing prompt:', prompt);
    console.log('🔗 Endpoint:', endpoint);

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                instances: [{
                    prompt: prompt
                }],
                parameters: {
                    sampleCount: 1
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
        console.log('📦 Full Response:', JSON.stringify(data, null, 2));


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
