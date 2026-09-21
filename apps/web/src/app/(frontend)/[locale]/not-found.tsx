import { headers } from "next/headers";

import { NotFoundPage } from "@/modules/pages";
import { DEFAULT_LOCALE, isLocale, LOCALE_HEADER } from "@/modules/shared/config";

export default async function NotFound() {
    const headerList = await headers();
    const candidate = headerList.get(LOCALE_HEADER);
    const locale = isLocale(candidate) ? candidate : DEFAULT_LOCALE;

    return <NotFoundPage locale={locale} />;
}
