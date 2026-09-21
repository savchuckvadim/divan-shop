import { type NextRequest, NextResponse } from "next/server";

import {
    DEFAULT_LOCALE,
    isLocale,
    type Locale,
    LOCALE_COOKIE,
    LOCALE_HEADER,
} from "@/modules/shared/config";

const detectLocale = (request: NextRequest): Locale => {
    const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
    if (isLocale(cookieLocale)) return cookieLocale;

    const acceptLanguage = request.headers.get("accept-language") ?? "";
    for (const part of acceptLanguage.split(",")) {
        const code = part.split(";")[0]?.trim().slice(0, 2).toLowerCase();
        if (isLocale(code)) return code;
    }

    return DEFAULT_LOCALE;
};

export const proxy = (request: NextRequest) => {
    const { pathname } = request.nextUrl;
    const firstSegment = pathname.split("/")[1];

    if (isLocale(firstSegment)) {
        const headers = new Headers(request.headers);
        headers.set(LOCALE_HEADER, firstSegment);
        return NextResponse.next({ request: { headers } });
    }

    const locale = detectLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;

    return NextResponse.redirect(url);
};

export const config = {
    matcher: [
        "/((?!admin|api|next|_next|media|favicon\\.ico|favicon\\.svg|sitemap\\.xml|robots\\.txt|.*\\.[a-zA-Z0-9]+$).*)",
    ],
};
