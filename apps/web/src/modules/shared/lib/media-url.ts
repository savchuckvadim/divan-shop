/**
 * Local media paths (`/api/media/file/...`) stay relative so Next.js image
 * optimization treats them as local instead of going through `remotePatterns`.
 */
export const getMediaUrl = (url: string | null | undefined, cacheTag?: string | null): string => {
    if (!url) return "";
    return cacheTag ? `${url}?${encodeURIComponent(cacheTag)}` : url;
};
