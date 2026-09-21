"use client";

import { createContext, type ReactNode, useContext } from "react";

import type { Locale } from "@/modules/shared/config";

import type { Dictionary } from "./get-dictionary";

interface I18nContextValue {
    locale: Locale;
    dictionary: Dictionary;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export const I18nProvider = ({
    locale,
    dictionary,
    children,
}: I18nContextValue & { children: ReactNode }) => (
    <I18nContext.Provider value={{ locale, dictionary }}>{children}</I18nContext.Provider>
);

export const useI18n = (): I18nContextValue => {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error("useI18n must be used inside I18nProvider");
    }
    return context;
};
