import type { BadgeProps } from "@workspace/ui/components/badge";

import type { ShowroomVisitStatus } from "../type/customer.type";

export const VISIT_STATUS_BADGE: Record<ShowroomVisitStatus, BadgeProps["variant"]> = {
    requested: "secondary",
    confirmed: "default",
    visited: "success",
    cancelled: "outline",
};
