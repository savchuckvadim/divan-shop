"use client";

import { LogOutIcon } from "lucide-react";

import { Button } from "@workspace/ui/components/button";

import { useI18n } from "@/modules/shared/i18n";

import { logout } from "../api/auth.actions";

export const LogoutButton = () => {
    const { locale, dictionary } = useI18n();

    return (
        <form action={logout}>
            <input type="hidden" name="locale" value={locale} />
            <Button type="submit" variant="outline" size="sm">
                <LogOutIcon className="size-4" />
                {dictionary.account.logout}
            </Button>
        </form>
    );
};
