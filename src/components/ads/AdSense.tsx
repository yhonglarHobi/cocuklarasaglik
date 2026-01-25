"use client";

import { useEffect, useState } from 'react';

interface AdSenseProps {
    publisherId: string;
    slotId: string;
    format?: 'auto' | 'rectangle' | 'horizontal';
    responsive?: boolean;
    enabled?: boolean;
}

export function AdSenseUnit({
    publisherId,
    slotId,
    format = 'auto',
    responsive = true,
    enabled = true
}: AdSenseProps) {
    const [adLoaded, setAdLoaded] = useState(false);

    useEffect(() => {
        if (!enabled || !publisherId || !slotId) return;

        try {
            // Load AdSense script if not already loaded
            if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
                const script = document.createElement('script');
                script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
                script.async = true;
                script.crossOrigin = 'anonymous';
                script.setAttribute('data-ad-client', publisherId);
                document.head.appendChild(script);
            }

            // Push ad
            setTimeout(() => {
                try {
                    // @ts-ignore
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                    setAdLoaded(true);
                } catch (err) {
                    console.error('AdSense push error:', err);
                }
            }, 100);
        } catch (err) {
            console.error('AdSense load error:', err);
        }
    }, [publisherId, slotId, enabled]);

    // AdSense kapalı veya ayarlar eksikse placeholder göster
    if (!enabled || !publisherId || !slotId) {
        return (
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                <p className="text-sm text-gray-400 font-bold mb-1">📢 Reklam Alanı</p>
                <p className="text-xs text-gray-300">
                    {!enabled ? 'Reklamlar kapalı' : 'AdSense ayarları yapılmamış'}
                </p>
            </div>
        );
    }

    return (
        <div className="adsense-wrapper my-4">
            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client={publisherId}
                data-ad-slot={slotId}
                data-ad-format={format}
                data-full-width-responsive={responsive ? 'true' : 'false'}
            />
        </div>
    );
}
