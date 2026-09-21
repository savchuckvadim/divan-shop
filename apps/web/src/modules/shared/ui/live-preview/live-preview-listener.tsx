"use client";

import { useRouter } from "next/navigation";

import { RefreshRouteOnSave } from "@payloadcms/live-preview-react";

import { getClientSideURL } from "@/modules/shared/lib";

export const LivePreviewListener = () => {
    const router = useRouter();
    return <RefreshRouteOnSave refresh={router.refresh} serverURL={getClientSideURL()} />;
};
