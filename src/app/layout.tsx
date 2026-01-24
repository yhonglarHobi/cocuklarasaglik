import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google"; // Keeping fonts
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "CocuklaraSaglik.com - Türkiye'nin Pediatri Portalı",
  description: "Pediatristler tarafından doğrulanan güvenilir çocuk sağlığı bilgileri.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="antialiased min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1 w-full max-w-[1100px] mx-auto bg-white shadow-sm my-4 min-h-[500px] px-0 md:px-0">
          {children}
        </main>

        {/* Footer Replica - Translated */}
        {/* Footer Refined */}
        <footer className="w-full bg-white border-t border-gray-200 mt-auto py-8 text-sm font-sans">
          <div className="max-w-[1100px] mx-auto px-4 text-center">

            {/* Footer Links */}
            <div className="flex flex-wrap justify-center gap-6 mb-6 text-gray-600 font-bold tracking-tight">
              <a href="/hakkimizda" className="hover:text-hc-orange hover:underline">Hakkımızda</a>
              <a href="/iletisim" className="hover:text-hc-orange hover:underline">İletişim</a>
              <a href="/gizlilik" className="hover:text-hc-orange hover:underline">Gizlilik Politikası</a>
              <a href="/kullanim-sartlari" className="hover:text-hc-orange hover:underline">Kullanım Şartları</a>
              <a href="/editorial" className="hover:text-hc-orange hover:underline">Editoryal İlkeler</a>
            </div>

            <div className="w-24 h-px bg-gray-300 mx-auto mb-6"></div>

            {/* Copyright & Branding */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
              <span>© 2026 CocuklaraSaglik.com. Tüm hakları saklıdır.</span>
              <div className="flex items-center gap-2 opacity-80 filter grayscale hover:grayscale-0 transition-all">
                <span className="font-serif italic text-gray-400">Powered by</span>
                <span className="font-bold text-hc-blue">Pediatristler Platformu</span>
              </div>
            </div>

          </div>
        </footer>

        {/* Floating Social Sidebar */}
        <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col shadow-lg bg-white rounded-l-lg overflow-hidden border border-gray-100">
          <div className="bg-[#f0f0f0] p-2 text-[10px] font-bold text-gray-500 text-center border-b border-gray-200 uppercase tracking-widest writing-vertical-lr py-4">
            Takip Et
          </div>
          <a href="#" className="p-3 hover:bg-red-50 text-red-600 transition-colors flex justify-center"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.5 6h-6.8c-.6 0-1.1.5-1.1 1.1v3.4h2.3c.4 0 .8.4.8.9v2.2c0 .5-.4.9-.9.9h-2.3v8.4c0 .6-.5 1.1-1.1 1.1H10c-.6 0-1.1-.5-1.1-1.1v-8.4H7.1c-.5 0-.9-.4-.9-.9v-2.2c0-.5.4-.9.9-.9h1.8V7.1C9 3.2 12.1 0 16.1 0h6.4c.5 0 .9.5.9 1V5c0 .6-.4 1.1-.9 1.1z" /></svg></a>
          <a href="#" className="p-3 hover:bg-pink-50 text-pink-600 transition-colors flex justify-center"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8 0 3.2 0 3.6-.1 4.9-.1 3.3-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.8.1-3.2 0-3.6 0-4.9-.1-3.3-.1-4.8-1.7-4.9-4.9-.1-1.3-.1-1.6-.1-4.8 0-3.2 0-3.6.1-4.9.1-3.3 1.7-4.8 4.9-4.9 1.3-.1 1.6-.1 4.8-.1zm0-2.2C8.7 0 8.3 0 7.1.1 2.8.3.3 2.8.1 7.1 0 8.3 0 8.7 0 12s0 3.7.1 4.9c.2 4.4 2.7 6.8 7.1 7.1 1.2.1 1.6.1 4.9.1s3.7 0 4.9-.1c4.4-.2 6.8-2.7 7.1-7.1.1-1.2.1-1.6.1-4.9s0-3.7-.1-4.9c-.2-4.4-2.7-6.8-7.1-7.1C15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4zm0 10.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.5-10.8a1.4 1.4 0 1 1 0 2.9 1.4 1.4 0 0 1 0-2.9z" /></svg></a>
          <a href="#" className="p-3 hover:bg-blue-50 text-blue-500 transition-colors flex justify-center"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.6c-.9.4-1.8.7-2.8.8 1-.6 1.8-1.6 2.2-2.7-1 .6-2 1-3.1 1.2-1-.1-1.9-.3-2.8-.5-.9-.2-1.8-.4-2.8-.4-1.4 0-2.7.5-3.7 1.5-1 1-1.6 2.3-1.6 3.8 0 .4 0 .8.1 1.2C3.9 9.3 1.9 6.8.8 3.5c-.3.6-.5 1.3-.5 2 0 1.9 1 3.6 2.4 4.5-.9 0-1.7-.3-2.4-.7 0 2.6 1.9 4.8 4.3 5.3-.5.1-.9.2-1.4.2-.3 0-.7 0-1-.1.7 2.2 2.7 3.8 5.1 3.9-2 1.5-4.4 2.4-7 2.4-.5 0-.9 0-1.4-.1 2.5 1.6 5.5 2.5 8.7 2.5 10.4 0 16.1-8.6 16.1-16.1 0-.2 0-.5 0-.7.9-.9 1.8-1.9 2.5-3z" /></svg></a>
          <a href="#" className="p-3 hover:bg-red-50 text-red-600 transition-colors flex justify-center"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.5 6.2c-.3 0-2.4-.2-4.8-.2-1.6 0-2.4.4-3.5 1.7-.8 1-1.2 2.4-1.2 4.3v1.8H9.3v3.8h4.7v10.3h4.4v-10.3h3.5l.5-3.8h-4v-1.4c0-1 .2-1.4.6-1.6.3-.1 1-.2 2.3-.2h2.2V6.2z" /></svg></a>
        </div>
      </body>
    </html>
  );
}
