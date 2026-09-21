import { cache } from "react";

import "server-only";

import { getPayloadClient } from "@/modules/shared/api";

import type { Customer, ShowroomVisit } from "../type/customer.type";

export const getCurrentCustomer = cache(async (headers: Headers): Promise<Customer | null> => {
    const payload = await getPayloadClient();
    const { user } = await payload.auth({ headers });
    if (!user || user.collection !== "customers") return null;
    return user;
});

export const getCustomerVisits = cache(async (customer: Customer): Promise<ShowroomVisit[]> => {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
        collection: "showroom-visits",
        user: customer,
        overrideAccess: false,
        depth: 0,
        limit: 50,
        pagination: false,
        sort: "-preferredDate",
        where: { customer: { equals: customer.id } },
    });
    return docs;
});
