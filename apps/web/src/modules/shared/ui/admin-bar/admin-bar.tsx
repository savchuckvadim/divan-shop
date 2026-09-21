"use client";

import { useCallback, useState } from "react";

import { useRouter, useSelectedLayoutSegments } from "next/navigation";

import {
    PayloadAdminBar,
    type PayloadAdminBarProps,
    type PayloadMeUser,
} from "@payloadcms/admin-bar";

import { cn } from "@workspace/ui/lib/utils";

import { ROUTES } from "@/modules/shared/config";
import { useI18n } from "@/modules/shared/i18n";
import { getClientSideURL } from "@/modules/shared/lib";

import "./admin-bar.scss";

const COLLECTION_LABELS = {
    pages: { plural: "Pages", singular: "Page" },
    products: { plural: "Products", singular: "Product" },
    categories: { plural: "Categories", singular: "Category" },
} as const;

type AdminCollection = keyof typeof COLLECTION_LABELS;

const segmentToCollection = (segment?: string): AdminCollection => {
    if (segment === "product") return "products";
    if (segment === "catalog") return "categories";
    return "pages";
};

export const AdminBar = ({ adminBarProps }: { adminBarProps?: PayloadAdminBarProps }) => {
    const segments = useSelectedLayoutSegments();
    const [show, setShow] = useState(false);
    const router = useRouter();
    const { locale } = useI18n();

    const collection = segmentToCollection(segments?.[0]);

    const onAuthChange = useCallback((user: PayloadMeUser) => {
        setShow(Boolean(user?.id));
    }, []);

    return (
        <div className={cn("admin-bar bg-black py-2 text-white", show ? "block" : "hidden")}>
            <div className="container">
                <PayloadAdminBar
                    {...adminBarProps}
                    className="py-2 text-white"
                    classNames={{
                        controls: "font-medium text-white",
                        logo: "text-white",
                        user: "text-white",
                    }}
                    cmsURL={getClientSideURL()}
                    collectionSlug={collection}
                    collectionLabels={COLLECTION_LABELS[collection]}
                    logo={<span>Dashboard</span>}
                    onAuthChange={onAuthChange}
                    onPreviewExit={() => {
                        fetch("/next/exit-preview").then(() => {
                            router.push(ROUTES.home(locale));
                            router.refresh();
                        });
                    }}
                    style={{
                        backgroundColor: "transparent",
                        padding: 0,
                        position: "relative",
                        zIndex: "unset",
                    }}
                />
            </div>
        </div>
    );
};
