/**
 * Static params are a build-time optimisation only. When the database is
 * unreachable (Docker image build, CI) fall back to on-demand rendering.
 */
export const safeStaticParams = async <T>(load: () => Promise<T[]>): Promise<T[]> => {
    try {
        return await load();
    } catch (error) {
        console.warn(
            "generateStaticParams skipped:",
            error instanceof Error ? error.message : String(error)
        );
        return [];
    }
};
