import type { ReactElement } from "react";

import { OG_COLORS, OG_FONT_SANS, OG_FONT_SERIF, OG_SIZE, OG_SURFACE } from "./og-theme";

export interface OgCardProps {
    /** Small uppercase line above the title: section or category name. */
    eyebrow?: string | null;
    title: string;
    /** One supporting line under the title: tagline, excerpt or description. */
    subtitle?: string | null;
    /** Formatted price, shown as a pill for product cards. */
    price?: string | null;
    brandName: string;
    cityLine: string;
}

const titleFontSize = (title: string): number => {
    if (title.length > 90) return 52;
    if (title.length > 60) return 62;
    if (title.length > 36) return 74;
    return 86;
};

/** CSS-only arch that mirrors `LogoMark`: a showroom doorway reading as a sofa back. */
const LogoMark = (): ReactElement => (
    <div
        style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            width: 56,
            height: 56,
            borderRadius: "28px 28px 8px 8px",
            backgroundColor: OG_COLORS.primary,
        }}
    >
        <div
            style={{
                display: "flex",
                width: 26,
                height: 4,
                marginBottom: 10,
                borderRadius: 2,
                backgroundColor: OG_COLORS.primaryForeground,
            }}
        />
    </div>
);

export const OgCard = ({
    eyebrow,
    title,
    subtitle,
    price,
    brandName,
    cityLine,
}: OgCardProps): ReactElement => (
    <div
        style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: OG_SIZE.width,
            height: OG_SIZE.height,
            padding: "72px 80px",
            backgroundColor: OG_COLORS.background,
            backgroundImage: OG_SURFACE,
            color: OG_COLORS.foreground,
            fontFamily: OG_FONT_SANS,
        }}
    >
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
            {eyebrow ? (
                <div
                    style={{
                        display: "flex",
                        fontSize: 26,
                        letterSpacing: 6,
                        textTransform: "uppercase",
                        color: OG_COLORS.primary,
                    }}
                >
                    {eyebrow}
                </div>
            ) : null}
            <div
                style={{
                    display: "flex",
                    fontFamily: OG_FONT_SERIF,
                    fontSize: titleFontSize(title),
                    lineHeight: 1.08,
                    letterSpacing: -1.5,
                    maxWidth: 960,
                }}
            >
                {title}
            </div>
            {subtitle ? (
                <div
                    style={{
                        display: "flex",
                        fontSize: 32,
                        lineHeight: 1.35,
                        maxWidth: 820,
                        color: OG_COLORS.mutedForeground,
                    }}
                >
                    {subtitle}
                </div>
            ) : null}
            {price ? (
                <div
                    style={{
                        display: "flex",
                        alignSelf: "flex-start",
                        padding: "14px 32px",
                        borderRadius: 999,
                        backgroundColor: OG_COLORS.primary,
                        color: OG_COLORS.primaryForeground,
                        fontSize: 40,
                    }}
                >
                    {price}
                </div>
            ) : null}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div
                style={{
                    display: "flex",
                    width: "100%",
                    height: 2,
                    backgroundColor: OG_COLORS.border,
                }}
            />
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    <LogoMark />
                    <div
                        style={{
                            display: "flex",
                            fontFamily: OG_FONT_SERIF,
                            fontSize: 38,
                            letterSpacing: -0.5,
                        }}
                    >
                        {brandName}
                    </div>
                </div>
                <div
                    style={{
                        display: "flex",
                        fontSize: 24,
                        letterSpacing: 4,
                        textTransform: "uppercase",
                        color: OG_COLORS.mutedForeground,
                    }}
                >
                    {cityLine}
                </div>
            </div>
        </div>
    </div>
);
