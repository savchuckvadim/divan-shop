import { getSiteSettings, getStorefrontContent, resolveContacts } from "@/modules/entities";
import { getCachedGlobal } from "@/modules/shared/api";
import type { Locale } from "@/modules/shared/config";

import { HeaderClient } from "./header-client";

export const Header = async ({ locale }: { locale: Locale }) => {
    const [header, settings, storefront] = await Promise.all([
        getCachedGlobal("header", locale, 1)(),
        getSiteSettings(locale),
        getStorefrontContent(locale),
    ]);

    return (
        <HeaderClient
            navItems={header.navItems ?? []}
            siteName={settings.siteName}
            phone={resolveContacts(settings, storefront).phone}
        />
    );
};
