"use server";

import { getSystemSettings } from "@/app/admin/settings/actions";

export async function getAdSenseConfig() {
    const settings = await getSystemSettings();

    return {
        enabled: settings?.adsenseEnabled || false,
        publisherId: settings?.adsensePublisherId || '',
        sidebarSlot: settings?.adsenseSidebarSlotId || '',
        articleSlot: settings?.adsenseInArticleSlotId || '',
    };
}
