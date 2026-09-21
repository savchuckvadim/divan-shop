import type { Customer, ShowroomVisit } from "@/payload-types";

export type { Customer, ShowroomVisit };

export type ShowroomVisitStatus = ShowroomVisit["status"];

export type ShowroomVisitTime = NonNullable<ShowroomVisit["preferredTime"]>;
