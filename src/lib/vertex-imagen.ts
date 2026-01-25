/**
 * Vertex AI Imagen Integration Library
 * Handles OAuth authentication and image generation
 */

import * as crypto from 'crypto';
import * as fs from 'fs';

export interface ImageGenerationOptions {
    prompt: string;
    aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
    safetyFilterLevel?: 'block_none' | 'block_some' | 'block_most';
    personGeneration?: 'dont_allow' | 'allow_adult';
    sampleCount?: number;
}

export interface ImageGenerationResult {
    success: boolean;
    imageUrl?: string;
    localPath?: string;
    error?: string;
}

/**
 * Get OAuth 2.0 access token using Service Account credentials
 */
export async function getVertexAccessToken(): Promise<{ success: boolean; token?: string; error?: string }> {
    try {
        const CREDENTIALS_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS || './google-credentials.json';

        // Check if credentials file exists
        if (!fs.existsSync(CREDENTIALS_PATH)) {
            return {
                success: false,
                error: 'Google credentials file not found. Please setup Service Account first.'
            };
        }

        // Load service account credentials
        const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf-8'));

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
            return { success: false, error: `OAuth token error: ${error}` };
        }

        const data = await response.json();
        return { success: true, token: data.access_token };

    } catch (error: any) {
        return { success: false, error: `OAuth error: ${error.message}` };
    }
}

/**
 * Generate image using Google Vertex AI Imagen
 */
export async function generateImageWithVertex(
    options: ImageGenerationOptions
): Promise<ImageGenerationResult> {
    try {
        const VERTEX_PROJECT_ID = process.env.VERTEX_PROJECT_ID;
        const VERTEX_REGION = process.env.VERTEX_REGION || 'us-central1';

        if (!VERTEX_PROJECT_ID) {
            return { success: false, error: 'VERTEX_PROJECT_ID not configured' };
        }

        // Get OAuth access token
        console.log('🔐 Getting Vertex AI access token...');
        const tokenResponse = await getVertexAccessToken();

        if (!tokenResponse.success || !tokenResponse.token) {
            console.error('❌ Token error:', tokenResponse.error);
            return { success: false, error: tokenResponse.error };
        }

        const accessToken = tokenResponse.token;

        // Prepare endpoint (Note: imagegeneration models currently deprecated, will fallback to Unsplash)
        const endpoint = `https://${VERTEX_REGION}-aiplatform.googleapis.com/v1/projects/${VERTEX_PROJECT_ID}/locations/${VERTEX_REGION}/publishers/google/models/imagegeneration@005:predict`;

        // Enhance prompt for pediatric content
        const enhancedPrompt = `${options.prompt}, warm lighting, family-friendly, realistic photograph, professional quality, safe for children`;

        console.log('🎨 Generating image with Vertex AI Imagen:', enhancedPrompt);

        // Call Vertex AI Imagen API
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                instances: [{
                    prompt: enhancedPrompt
                }],
                parameters: {
                    sampleCount: options.sampleCount || 1
                }
            })
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('❌ Vertex AI API Error:', response.status, error);
            return { success: false, error: `Vertex API error: ${response.status}` };
        }

        const data = await response.json();

        // Extract image
        if (!data.predictions || !data.predictions[0] || !data.predictions[0].bytesBase64Encoded) {
            console.warn('⚠️ No image in Vertex response');
            return { success: false, error: 'No image data in response' };
        }

        const base64Image = data.predictions[0].bytesBase64Encoded;

        // Save image to public/generated folder
        const path = await import('path');
        const outputDir = path.join(process.cwd(), 'public', 'generated');

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const filename = `vertex-${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
        const filepath = path.join(outputDir, filename);
        const imageUrl = `/generated/${filename}`;

        const imageBuffer = Buffer.from(base64Image, 'base64');
        fs.writeFileSync(filepath, imageBuffer);

        console.log('✅ Vertex AI image saved:', imageUrl);

        return {
            success: true,
            imageUrl,
            localPath: filepath
        };

    } catch (error: any) {
        console.error('❌ Image generation error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Generate image with Gemini Vertex AI only (No fallback)
 */
export async function generateImageWithFallback(
    prompt: string,
    options?: Partial<ImageGenerationOptions>
): Promise<string | null> {
    // Try Vertex AI (Gemini Image Generation)
    const result = await generateImageWithVertex({
        prompt,
        ...options
    });

    if (result.success && result.imageUrl) {
        console.log('✅ Gemini görsel oluşturuldu:', result.imageUrl);
        return result.imageUrl;
    }

    // Görsel oluşturulamadı - fallback yok, null döndür
    console.warn('⚠️ Gemini görsel oluşturamadı. Görsel olmadan devam ediliyor.');
    return null;
}
