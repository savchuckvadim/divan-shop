/**
 * Payload relationships come back either populated (object) or as a bare id
 * depending on `depth`. These helpers narrow them safely.
 */
export const isPopulated = <T extends object>(
    value: T | string | number | null | undefined
): value is T => typeof value === "object" && value !== null;

export const relationId = <T extends { id: string | number }>(
    value: T | string | number | null | undefined
): string | number | undefined => {
    if (value === null || value === undefined) return undefined;
    return typeof value === "object" ? value.id : value;
};
