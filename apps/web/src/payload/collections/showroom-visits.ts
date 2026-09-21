import type { Access, CollectionBeforeChangeHook, CollectionConfig, FieldAccess } from "payload";

import { authenticated, isAdminUser, isCustomerUser } from "../access";

export const VISIT_TIMES = ["morning", "afternoon", "evening"] as const;
export const VISIT_STATUSES = ["requested", "confirmed", "visited", "cancelled"] as const;

const customerOrAdmin: Access = ({ req: { user } }) => isAdminUser(user) || isCustomerUser(user);

const ownVisitsOrAdmin: Access = ({ req: { user } }) => {
    if (isAdminUser(user)) return true;
    if (user && isCustomerUser(user)) return { customer: { equals: user.id } };
    return false;
};

const adminOnlyField: FieldAccess = ({ req: { user } }) => isAdminUser(user);

const bindCustomer: CollectionBeforeChangeHook = async ({ data, operation, req }) => {
    const { user } = req;
    const byCustomer = operation === "create" && Boolean(user) && isCustomerUser(user);
    const customerId = byCustomer && user ? user.id : data.customer;

    if (!customerId) return data;

    const customer = await req.payload.findByID({
        collection: "customers",
        id: customerId,
        depth: 0,
        overrideAccess: true,
    });

    return {
        ...data,
        customer: customer.id,
        code: customer.discountCode ?? data.code,
        ...(byCustomer ? { status: "requested" } : {}),
    };
};

export const ShowroomVisits: CollectionConfig<"showroom-visits"> = {
    slug: "showroom-visits",
    timestamps: true,
    access: {
        create: customerOrAdmin,
        read: ownVisitsOrAdmin,
        update: authenticated,
        delete: authenticated,
    },
    admin: {
        group: "Customers",
        useAsTitle: "code",
        defaultColumns: ["code", "customer", "preferredDate", "preferredTime", "status"],
    },
    fields: [
        {
            name: "customer",
            type: "relationship",
            relationTo: "customers",
            required: true,
            index: true,
        },
        {
            type: "row",
            fields: [
                {
                    name: "preferredDate",
                    type: "date",
                    required: true,
                    admin: { width: "50%", date: { pickerAppearance: "dayOnly" } },
                },
                {
                    name: "preferredTime",
                    type: "select",
                    defaultValue: "morning",
                    options: VISIT_TIMES.map((value) => ({ label: value, value })),
                    admin: { width: "50%" },
                },
            ],
        },
        { name: "note", type: "textarea" },
        { name: "product", type: "relationship", relationTo: "products" },
        {
            name: "status",
            type: "select",
            required: true,
            defaultValue: "requested",
            options: VISIT_STATUSES.map((value) => ({ label: value, value })),
            access: { update: adminOnlyField },
            admin: { position: "sidebar" },
        },
        {
            name: "code",
            type: "text",
            index: true,
            admin: {
                position: "sidebar",
                readOnly: true,
                description: "Copied from the customer discount code",
            },
        },
    ],
    hooks: { beforeChange: [bindCustomer] },
};
