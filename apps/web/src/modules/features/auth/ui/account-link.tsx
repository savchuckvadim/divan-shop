"use client";

import Link from "next/link";

import { UserIcon } from "lucide-react";

import { cn } from "@workspace/ui/lib/utils";

import { ROUTES } from "@/modules/shared/config";
import { useI18n } from "@/modules/shared/i18n";

export const AccountLink = ({ className }: { className?: string }) => {
    const { locale, dictionary } = useI18n();

    return (
        <Link
            href={ROUTES.account(locale)}
            className={cn(
                "inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                className
            )}
        >
            <UserIcon className="size-4" aria-hidden />
            {dictionary.account.title}
        </Link>
    );
};
