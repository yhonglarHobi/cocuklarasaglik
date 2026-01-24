
import React from "react";

interface AdPlaceholderProps {
    slotId?: string;
    width?: string;
    height?: string;
    className?: string;
    label?: string;
}

export function AdPlaceholder({
    slotId = "1234567890",
    width = "100%",
    height = "250px",
    className = "",
    label = "Reklam Alanı"
}: AdPlaceholderProps) {
    return (
        <div
            className={`bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 text-sm p-4 overflow-hidden rounded-sm ${className}`}
            style={{ width, height }}
        >
            <span className="font-bold uppercase tracking-widest text-xs mb-1">{label}</span>
            <span className="text-[10px] text-gray-400">Google Adsense</span>
            {/* 
                Gerçek uygulamada buraya Google Adsense scripti gelecektir.
                Örnek:
                <ins className="adsbygoogle"
                     style={{ display: 'block' }}
                     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                     data-ad-slot={slotId}
                     data-ad-format="auto"
                     data-full-width-responsive="true"></ins>
                <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
            */}
        </div>
    );
}
