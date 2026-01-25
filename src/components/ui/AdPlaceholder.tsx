"use client";

import React, { useEffect, useState } from "react";
import { getSystemSettings } from "@/app/admin/settings/actions";

interface AdPlaceholderProps {
    slotId?: string; // Manuel slot ID (Varsa settings'i ezer)
    width?: string;
    height?: string;
    className?: string;
    label?: string;
    variant?: "sidebar" | "in-article" | "custom";
}

export function AdPlaceholder({
    slotId: manualSlotId,
    width = "100%",
    height = "250px",
    className = "",
    label = "Sponsorlu Alan",
    variant = "sidebar"
}: AdPlaceholderProps) {
    const [adConfig, setAdConfig] = useState<{
        enabled: boolean;
        pubId: string;
        slotId: string;
    } | null>(null);

    const [isDev, setIsDev] = useState(false);

    useEffect(() => {
        // Build ortamında olup olmadığımızı kontrol et (opsiyonel)
        setIsDev(process.env.NODE_ENV === "development");

        async function initAd() {
            try {
                const settings = await getSystemSettings();

                if (settings && settings.adsenseEnabled) {
                    let targetSlotId = manualSlotId;

                    // Eğer manuel ID yoksa, ayarlardan otomatik seç
                    if (!targetSlotId) {
                        if (variant === "sidebar") targetSlotId = settings.adsenseSidebarSlotId || "";
                        else if (variant === "in-article") targetSlotId = settings.adsenseInArticleSlotId || "";
                    }

                    if (settings.adsensePublisherId && targetSlotId) {
                        setAdConfig({
                            enabled: true,
                            pubId: settings.adsensePublisherId,
                            slotId: targetSlotId
                        });

                        // AdSense scriptini yükle (Push)
                        setTimeout(() => {
                            try {
                                // @ts-ignore
                                (window.adsbygoogle = window.adsbygoogle || []).push({});
                            } catch (e) {
                                console.error("AdSense Push Error:", e);
                            }
                        }, 500);
                    }
                }
            } catch (err) {
                console.error("Ad Config Error:", err);
            }
        }

        initAd();
    }, [manualSlotId, variant]);

    // Eğer reklam aktifse ve konfigürasyon yüklendiyse, Reklamı Göster
    if (adConfig?.enabled) {
        return (
            <div className={`overflow-hidden ${className}`} style={{ width, minHeight: height }}>
                {/* Google AdSense Unit */}
                <ins className="adsbygoogle"
                    style={{ display: "block", width: "100%" }}
                    data-ad-client={adConfig.pubId}
                    data-ad-slot={adConfig.slotId}
                    data-ad-format={variant === "in-article" ? "fluid" : "auto"}
                    data-full-width-responsive="true"
                    data-ad-layout={variant === "in-article" ? "in-article" : undefined}
                >
                </ins>
                <script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adConfig.pubId}`} crossOrigin="anonymous"></script>
            </div>
        );
    }

    // --- Placeholder Modu (Reklamlar kapalıysa veya yüklenemediyse) ---
    return (
        <div
            className={`bg-gray-50 border border-gray-100 flex flex-col items-center justify-center text-gray-400 text-sm p-4 overflow-hidden rounded-lg shadow-sm ${className}`}
            style={{ width, height }}
        >
            <span className="font-bold uppercase tracking-widest text-[10px] text-gray-300 mb-1">{label}</span>
            <span className="text-xs text-gray-300">Google Adsense</span>
        </div>
    );
}
