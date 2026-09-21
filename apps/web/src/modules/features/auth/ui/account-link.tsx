"use client";

import Link from "next/link";

import { UserRoundIcon } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";

import { ROUTES } from "@/modules/shared/config";
import { useI18n } from "@/modules/shared/i18n";

interface AccountLinkProps {
    className?: string;
    showLabel?: boolean;
}

export const AccountLink = ({ className, showLabel = false }: AccountLinkProps) => {
    const { locale, dictionary } = useI18n();

    return (
        <Button
            asChild
            variant="ghost"
            size="sm"
            shape="pill"
            className={cn("text-foreground/80 hover:text-foreground", className)}
        >
            <Link href={ROUTES.account(locale)} aria-label={dictionary.account.title}>
                <UserRoundIcon aria-hidden />
                <span className={cn(!showLabel && "hidden xl:inline")}>
                    {dictionary.account.title}
                </span>
            </Link>
        </Button>
    );
};
