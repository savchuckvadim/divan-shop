"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { getCurrentCustomer } from "@/modules/entities/customer";
import { getPayloadClient } from "@/modules/shared/api";
import { isVisitTime } from "@/modules/shared/config";
import { DEFAULT_LOCALE, isLocale, ROUTES } from "@/modules/shared/config";

import type { VisitFormState } from "../type/showroom-visit.type";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const NOTE_MAX_LENGTH = 1000;

const todayIso = (): string => new Date().toISOString().slice(0, 10);

export const requestVisit = async (
    _previous: VisitFormState,
    formData: FormData
): Promise<VisitFormState> => {
    const rawLocale = formData.get("locale");
    const locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

    const customer = await getCurrentCustomer(await headers());
    if (!customer) return { error: "notAuthenticated" };

    const preferredDate = String(formData.get("preferredDate") ?? "").trim();
    if (!preferredDate) return { fieldErrors: { preferredDate: "required" } };
    if (!DATE_PATTERN.test(preferredDate) || preferredDate < todayIso()) {
        return { fieldErrors: { preferredDate: "invalidDate" } };
    }

    const rawTime = formData.get("preferredTime");
    const preferredTime = isVisitTime(rawTime) ? rawTime : "morning";
    const note = String(formData.get("note") ?? "")
        .trim()
        .slice(0, NOTE_MAX_LENGTH);
    const productId = Number.parseInt(String(formData.get("product") ?? ""), 10);

    const payload = await getPayloadClient();

    try {
        await payload.create({
            collection: "showroom-visits",
            user: customer,
            overrideAccess: false,
            data: {
                customer: customer.id,
                preferredDate,
                preferredTime,
                note: note || undefined,
                product: Number.isNaN(productId) ? undefined : productId,
                status: "requested",
            },
        });
    } catch (caught) {
        payload.logger.warn({ err: caught, msg: "Showroom visit request failed" });
        return { error: "generic" };
    }

    revalidatePath(ROUTES.account(locale));
    return { success: true };
};
