export const VISIT_TIMES = ["morning", "afternoon", "evening"] as const;

export type VisitTime = (typeof VISIT_TIMES)[number];

export const isVisitTime = (value: unknown): value is VisitTime =>
    typeof value === "string" && (VISIT_TIMES as readonly string[]).includes(value);
