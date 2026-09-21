export const canUseDOM = (): boolean =>
    typeof window !== "undefined" && Boolean(window.document?.createElement);

export const getServerSideURL = (): string =>
    process.env.NEXT_PUBLIC_SERVER_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "http://localhost:3000");

export const getClientSideURL = (): string => {
    if (canUseDOM()) {
        const { protocol, hostname, port } = window.location;
        return `${protocol}//${hostname}${port ? `:${port}` : ""}`;
    }

    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
        return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
    }

    return process.env.NEXT_PUBLIC_SERVER_URL || "";
};

export const absoluteUrl = (path: string): string => `${getServerSideURL()}${path}`;
