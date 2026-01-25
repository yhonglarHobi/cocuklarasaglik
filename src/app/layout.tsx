import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google"; // Keeping fonts
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { getMenuItems } from "@/app/admin/menu/actions";
import { getSystemSettings } from "@/app/admin/settings/actions";
import Script from "next/script";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getSystemSettings();
    return {
      title: "CocuklaraSaglik.com - Türkiye'nin Pediatri Portalı",
      description: "Pediatristler tarafından doğrulanan güvenilir çocuk sağlığı bilgileri.",
      verification: {
        google: settings?.googleSearchConsole || undefined,
      },
    };
  } catch (error) {
    console.error("Metadata error:", error);
    return {
      title: "CocuklaraSaglik.com - Türkiye'nin Pediatri Portalı",
      description: "Pediatristler tarafından doğrulanan güvenilir çocuk sağlığı bilgileri.",
    };
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let menuItems = [];
  let settings = null;

  try {
    [menuItems, settings] = await Promise.all([
      getMenuItems(),
      getSystemSettings()
    ]);
  } catch (error) {
    console.error("Layout data fetching error:", error);
  }

  const gaId = settings?.googleAnalyticsId;

  return (
    <html lang="tr">
      <body className="antialiased min-h-screen flex flex-col bg-white">
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
        <Navbar menuItems={menuItems} />
        <main className="flex-1 w-full max-w-[1100px] mx-auto bg-white shadow-sm my-4 min-h-[500px] px-0 md:px-0">
          {children}
        </main>

        <footer className="w-full bg-white border-t border-gray-200 mt-auto py-8 text-sm font-sans">
          <div className="max-w-[1100px] mx-auto px-4 text-center">
            <div className="flex flex-wrap justify-center gap-6 mb-6 text-gray-600 font-bold tracking-tight">
              <a href="/hakkimizda" className="py-2 px-3 hover:text-hc-orange hover:underline inline-block">Hakkımızda</a>
              <a href="/iletisim" className="py-2 px-3 hover:text-hc-orange hover:underline inline-block">İletişim</a>
              <a href="/gizlilik" className="py-2 px-3 hover:text-hc-orange hover:underline inline-block">Gizlilik Politikası</a>
              <a href="/kullanim-sartlari" className="py-2 px-3 hover:text-hc-orange hover:underline inline-block">Kullanım Şartları</a>
              <a href="/editorial" className="py-2 px-3 hover:text-hc-orange hover:underline inline-block">Editoryal İlkeler</a>
            </div>
            <div className="w-24 h-px bg-gray-300 mx-auto mb-6"></div>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
              <span>© 2026 CocuklaraSaglik.com. Tüm hakları saklıdır.</span>
              <div className="flex items-center gap-2 opacity-80 filter grayscale hover:grayscale-0 transition-all">
                <span className="font-serif italic text-gray-400">Powered by</span>
                <span className="font-bold text-hc-blue">Pediatristler Platformu</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
