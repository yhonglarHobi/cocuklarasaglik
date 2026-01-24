"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        // Kullanıcının belirlediği sabit şifreler
        if (username === "Dradmin" && password === "Yasar101..") {
            // Basit güvenlik: Cookie ayarla
            document.cookie = "admin_session=true; path=/; max-age=86400"; // 1 gün geçerli
            router.push("/admin/wizard");
        } else {
            setError("Hatalı kullanıcı adı veya şifre!");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5]">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
                <div className="flex justify-center mb-6">
                    <div className="bg-hc-blue/10 p-4 rounded-full">
                        <ShieldCheck className="w-10 h-10 text-hc-blue" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Yönetici Girişi</h1>
                <p className="text-center text-gray-500 text-sm mb-8">Pediatri Portalı Yönetim Paneli</p>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">Kullanıcı Adı</label>
                        <div className="relative">
                            <User className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:border-hc-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                placeholder="..."
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">Şifre</label>
                        <div className="relative">
                            <Lock className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:border-hc-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {error && <div className="text-red-500 text-sm text-center font-bold bg-red-50 p-2 rounded">{error}</div>}

                    <button
                        type="submit"
                        className="w-full bg-hc-blue text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                    >
                        Giriş Yap
                    </button>
                </form>
            </div>
        </div>
    );
}
