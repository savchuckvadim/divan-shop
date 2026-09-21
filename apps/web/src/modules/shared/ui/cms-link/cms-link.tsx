"use client";

import type { ReactNode } from "react";

import Link from "next/link";

import { Button, type ButtonProps } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";

import { useI18n } from "@/modules/shared/i18n";
import { type CmsLinkTarget, resolveCmsHref } from "@/modules/shared/lib";

export interface CmsLinkProps extends CmsLinkTarget {
    appearance?: "inline" | ButtonProps["variant"];
    children?: ReactNode;
    className?: string;
    label?: string | null;
    newTab?: boolean | null;
    size?: ButtonProps["size"] | null;
}

export const CmsLink = ({
    type,
    url,
    reference,
    appearance = "inline",
    children,
    className,
    label,
    newTab,
    size: sizeFromProps,
}: CmsLinkProps) => {
    const { locale } = useI18n();
    const href = resolveCmsHref({ type, url, reference }, locale);

    if (!href) return null;

    const newTabProps = newTab ? { rel: "noopener noreferrer", target: "_blank" } : {};

    if (appearance === "inline") {
        return (
            <Link className={cn(className)} href={href} {...newTabProps}>
                {label}
                {children}
            </Link>
        );
    }

    const size = appearance === "link" ? "clear" : sizeFromProps;

    return (
        <Button asChild className={className} size={size} variant={appearance}>
            <Link href={href} {...newTabProps}>
                {label}
                {children}
            </Link>
        </Button>
    );
};
