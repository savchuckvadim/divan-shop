import type { BadgeProps } from "@workspace/ui/components/badge";

import type { ShowroomVisitStatus, ShowroomVisitTime } from "../type/customer.type";

export const VISIT_STATUS_BADGE: Record<ShowroomVisitStatus, BadgeProps["variant"]> = {
    requested: "secondary",
    confirmed: "default",
    visited: "success",
    cancelled: "outline",
};

export const VISIT_TIME_OPTIONS: readonly ShowroomVisitTime[] = ["morning", "afternoon", "evening"];

export const isVisitTime = (value: unknown): value is ShowroomVisitTime =>
    typeof value === "string" && (VISIT_TIME_OPTIONS as readonly string[]).includes(value);
