import { unstable_cache } from "next/cache";

import { getPayloadClient } from "./payload-client";

export const REDIRECTS_CACHE_TAG = "redirects";

const getRedirects = async (depth = 1) => {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
        collection: "redirects",
        depth,
        limit: 0,
        pagination: false,
    });
    return docs;
};

export const getCachedRedirects = () =>
    unstable_cache(() => getRedirects(), [REDIRECTS_CACHE_TAG], { tags: [REDIRECTS_CACHE_TAG] });
