import { getSiteSettings } from "@/modules/entities";
import { getCachedGlobal } from "@/modules/shared/api";
import type { Locale } from "@/modules/shared/config";

import { HeaderClient } from "./header-client";

export const Header = async ({ locale }: { locale: Locale }) => {
    const [header, settings] = await Promise.all([
        getCachedGlobal("header", locale, 1)(),
        getSiteSettings(locale),
    ]);

    return (
        <HeaderClient
            navItems={header.navItems ?? []}
            siteName={settings.siteName}
            phone={settings.contacts?.phone}
        />
    );
};
