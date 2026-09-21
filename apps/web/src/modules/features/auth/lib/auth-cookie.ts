import { cookies } from "next/headers";

import "server-only";

import { isSecureServerURL } from "@/modules/shared/lib";

export const AUTH_COOKIE_NAME = "payload-token";

const AUTH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60;

export const setAuthCookie = async (token: string): Promise<void> => {
    const store = await cookies();
    store.set(AUTH_COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isSecureServerURL(),
        maxAge: AUTH_COOKIE_MAX_AGE,
    });
};

export const clearAuthCookie = async (): Promise<void> => {
    const store = await cookies();
    store.delete({ name: AUTH_COOKIE_NAME, path: "/" });
};
