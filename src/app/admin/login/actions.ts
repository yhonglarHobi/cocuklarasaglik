"use server";

import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export async function loginAdmin(username: string, password: string) {
    try {
        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        if (!adminUsername || !adminPasswordHash) {
            return { success: false, error: 'Sistem yapılandırma hatası' };
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
