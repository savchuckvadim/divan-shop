import type { Access, CollectionBeforeChangeHook, CollectionConfig, FieldAccess } from "payload";

import { DEFAULT_LOCALE, LOCALE_LABELS, LOCALES, SITE } from "@/modules/shared/config";
import { isSecureServerURL } from "@/modules/shared/lib";

import { anyone, authenticated, isAdminUser, isCustomerUser } from "../access";

export const DISCOUNT_CODE_PREFIX = "SHOW-";

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 4;
const CODE_MAX_ATTEMPTS = 10;
const SEVEN_DAYS_IN_SECONDS = 7 * 24 * 60 * 60;
const LOCK_TIME_MS = 10 * 60 * 1000;

const randomCode = (): string => {
    let code = DISCOUNT_CODE_PREFIX;
    for (let i = 0; i < CODE_LENGTH; i += 1) {
        code += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
    }
    return code;
};

const adminOnlyField: FieldAccess = ({ req: { user } }) => isAdminUser(user);

const ownRecordOrAdmin: Access = ({ req: { user } }) => {
    if (isAdminUser(user)) return true;
    if (user && isCustomerUser(user)) return { id: { equals: user.id } };
    return false;
};

const generateDiscountCode: CollectionBeforeChangeHook = async ({ data, operation, req }) => {
    if (operation !== "create") return data;
    if (data.discountCode && isAdminUser(req.user)) return data;

    for (let attempt = 0; attempt < CODE_MAX_ATTEMPTS; attempt += 1) {
        const candidate = randomCode();
        const { totalDocs } = await req.payload.count({
            collection: "customers",
            where: { discountCode: { equals: candidate } },
            overrideAccess: true,
        });
        if (totalDocs === 0) {
            return { ...data, discountCode: candidate };
        }
    }

    throw new Error("Could not generate a unique discount code");
};

const applyDefaultDiscountPercent: CollectionBeforeChangeHook = async ({
    data,
    operation,
    req,
}) => {
    if (operation !== "create") return data;
    if (typeof data.discountPercent === "number" && isAdminUser(req.user)) return data;

    const settings = await req.payload.findGlobal({
        slug: "site-settings",
        depth: 0,
        overrideAccess: true,
    });

    return {
        ...data,
        discountPercent: settings.showroomDiscountPercent ?? SITE.showroomDiscountPercent,
    };
};

export const Customers: CollectionConfig<"customers"> = {
    slug: "customers",
    auth: {
        verify: false,
        maxLoginAttempts: 5,
        lockTime: LOCK_TIME_MS,
        tokenExpiration: SEVEN_DAYS_IN_SECONDS,
        cookies: { sameSite: "Lax", secure: isSecureServerURL() },
    },
    timestamps: true,
    access: {
        admin: authenticated,
        create: anyone,
        read: ownRecordOrAdmin,
        update: ownRecordOrAdmin,
        delete: authenticated,
    },
    admin: {
        group: "Customers",
        useAsTitle: "email",
        defaultColumns: ["email", "name", "discountCode", "locale", "createdAt"],
    },
    fields: [
        { name: "name", type: "text", required: true },
        { name: "phone", type: "text" },
        {
            name: "locale",
            type: "select",
            required: true,
            defaultValue: DEFAULT_LOCALE,
            options: LOCALES.map((code) => ({ label: LOCALE_LABELS[code], value: code })),
        },
        {
            name: "discountCode",
            type: "text",
            unique: true,
            index: true,
            access: { create: adminOnlyField, update: adminOnlyField },
            admin: {
                position: "sidebar",
                readOnly: true,
                description: "Generated on registration, shown at the showroom",
            },
        },
        {
            name: "discountPercent",
            type: "number",
            min: 0,
            max: 100,
            defaultValue: SITE.showroomDiscountPercent,
            access: { create: adminOnlyField, update: adminOnlyField },
            admin: { position: "sidebar" },
        },
        {
            name: "consentPrivacyAt",
            type: "date",
            required: true,
            access: { update: adminOnlyField },
            admin: { date: { pickerAppearance: "dayAndTime" } },
        },
        { name: "consentMarketing", type: "checkbox", defaultValue: false },
        {
            name: "source",
            type: "text",
            admin: { description: "Page or product slug the customer registered from" },
        },
    ],
    hooks: {
        beforeChange: [generateDiscountCode, applyDefaultDiscountPercent],
    },
};
