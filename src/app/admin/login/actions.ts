"use server";

import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

// Fallback credentials if env variables are missing
const FALLBACK_USER = "Dradmin";
const FALLBACK_HASH = "$2b$10$39x/GlWSRrV1JwHbJUVlh.fLXOWX/P3VnJxSYdiVU9t3P6SMDKI3K"; // password: admin

export async function loginAdmin(username: string, password: string) {
    try {
        // Use env vars if available, otherwise use fallback defaults
        const adminUsername = process.env.ADMIN_USERNAME || FALLBACK_USER;
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH || FALLBACK_HASH;

        // Double check just in case, though fallbacks should prevent this
        if (!adminUsername || !adminPasswordHash) {
            return { success: false, error: 'Sistem yapılandırma hatası (Eksik Credential)' };
        }

        // Username kontrolü
        if (username !== adminUsername) {
            return { success: false, error: 'Hatalı kullanıcı adı veya şifre' };
        }

        // Şifre kontrolü (bcrypt ile hash karşılaştırma)
        const isPasswordValid = await bcrypt.compare(password, adminPasswordHash);

        if (!isPasswordValid) {
            return { success: false, error: 'Hatalı kullanıcı adı veya şifre' };
        }

        // Başarılı giriş - Güvenli cookie oluştur
        const cookieStore = await cookies();
        cookieStore.set('admin_session', 'authenticated', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // 24 saat
            path: '/',
        });

        return { success: true };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: 'Giriş sırasında bir hata oluştu' };
    }
}

export async function logoutAdmin() {
    const cookieStore = await cookies();
    cookieStore.delete('admin_session');
    return { success: true };
}
