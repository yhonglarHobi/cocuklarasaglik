/**
 * Test Script: Vertex AI Imagen Integration (v2)
 * Tests connection with detailed error logging
 */

import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

/**
 * Get OAuth 2.0 access token
 */
async function getAccessToken(credentials: any): Promise<{ success: boolean; token?: string; error?: string }> {
    try {
        const now = Math.floor(Date.now() / 1000);
        const jwtHeader = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');

        const jwtClaim = Buffer.from(JSON.stringify({
            iss: credentials.client_email,
            scope: 'https://www.googleapis.com/auth/cloud-platform',
            aud: 'https://oauth2.googleapis.com/token',
            exp: now + 3600,
            iat: now
        })).toString('base64url');

        const sign = crypto.createSign('RSA-SHA256');
        sign.update(`${jwtHeader}.${jwtClaim}`);
        const signature = sign.sign(credentials.private_key, 'base64url');
        const jwt = `${jwtHeader}.${jwtClaim}.${signature}`;

        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
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
    process.env.VERTEX_PROJECT_ID = 'craniowell-sales'; // Force set for test
    const VERTEX_PROJECT_ID = process.env.VERTEX_PROJECT_ID;
    const VERTEX_REGION = 'us-central1';

    // Credentials dosyasının doğru yolunu bul
    const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || './google-credentials.json';
    const CREDENTIALS_PATH = path.resolve(process.cwd(), credPath);

    console.log('📝 Config:');
    console.log('   Project ID:', VERTEX_PROJECT_ID);
    console.log('   Region:', VERTEX_REGION);
    console.log('   Cred Path:', CREDENTIALS_PATH);

    if (!fs.existsSync(CREDENTIALS_PATH)) {
        console.error('❌ Credentials file not found!');
        process.exit(1);
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf-8'));
    console.log('📧 Service Account:', credentials.client_email);

    console.log('🔐 Getting Token...');
    const tokenResponse = await getAccessToken(credentials);

    if (!tokenResponse.success || !tokenResponse.token) {
        console.error('❌ Token Error:', tokenResponse.error);
        process.exit(1);
    }
    console.log('✅ Token OK');

    // Endpoint: imagen-3.0-generate-001 (Imagen 3)
    const endpoint = `https://${VERTEX_REGION}-aiplatform.googleapis.com/v1/projects/${VERTEX_PROJECT_ID}/locations/${VERTEX_REGION}/publishers/google/models/imagen-3.0-generate-001:predict`;
    const prompt = "a cute cartoon baby lion, vector art, white background";

    console.log('🎨 Generating Image...');
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${tokenResponse.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                instances: [{ prompt: prompt }],
                parameters: { sampleCount: 1, aspectRatio: "1:1" }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            // Dosyaya yaz ki kesilmesin
            fs.writeFileSync('vertex-error-log.txt', `Status: ${response.status}\nBody: ${errorText}`);
            console.error('❌ API Hatası! Detaylar "vertex-error-log.txt" dosyasına kaydedildi.');
            process.exit(1);
        }

        const data = await response.json();
        console.log('✅ SUCCESS!');

        if (data.predictions && data.predictions[0]?.bytesBase64Encoded) {
            console.log('🖼️  Image Data received (Base64 length):', data.predictions[0].bytesBase64Encoded.length);
        }

    } catch (error) {
        console.error('❌ Network Error:', error);
    }
}

testVertexImagen();
