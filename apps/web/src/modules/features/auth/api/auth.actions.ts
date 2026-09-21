"use server";

import { redirect } from "next/navigation";

import { AuthenticationError, LockedAuth, ValidationError } from "payload";

import { getPayloadClient } from "@/modules/shared/api";
import { ROUTES } from "@/modules/shared/config";

import { clearAuthCookie, setAuthCookie } from "../lib/auth-cookie";
import {
    isChecked,
    isValidEmail,
    MIN_PASSWORD_LENGTH,
    readEmail,
    readLocale,
    readText,
} from "../lib/form-values";
import type { AuthErrorKey, AuthFormState } from "../type/auth.type";

const isEmailTaken = (error: unknown): boolean =>
    error instanceof ValidationError &&
    error.data.errors.some((fieldError) => fieldError.path === "email");

const isBadCredentials = (error: unknown): boolean =>
    error instanceof AuthenticationError || error instanceof LockedAuth;

const validateCredentials = (email: string, password: string): AuthFormState["fieldErrors"] => {
    const fieldErrors: NonNullable<AuthFormState["fieldErrors"]> = {};
    if (!email) fieldErrors.email = "required";
    else if (!isValidEmail(email)) fieldErrors.email = "invalidEmail";
    if (!password) fieldErrors.password = "required";
    return fieldErrors;
};

export const register = async (
    _previous: AuthFormState,
    formData: FormData
): Promise<AuthFormState> => {
    const locale = readLocale(formData);
    const email = readEmail(formData);
    const password = String(formData.get("password") ?? "");
    const name = readText(formData, "name", 120);
    const phone = readText(formData, "phone", 40);
    const source = readText(formData, "source", 200);
    const consentPrivacy = isChecked(formData, "consentPrivacy");
    const consentMarketing = isChecked(formData, "consentMarketing");

    const fieldErrors = validateCredentials(email, password) ?? {};
    if (password && password.length < MIN_PASSWORD_LENGTH) {
        fieldErrors.password = "passwordTooShort";
    }
    if (!name) fieldErrors.name = "required";
    if (!consentPrivacy) fieldErrors.consentPrivacy = "required";
    if (Object.keys(fieldErrors).length) return { fieldErrors };

    const payload = await getPayloadClient();
    let token: string | undefined;
    let error: AuthErrorKey | undefined;

    try {
        await payload.create({
            collection: "customers",
            data: {
                email,
                password,
                name,
                phone: phone || undefined,
                locale,
                source: source || undefined,
                consentPrivacyAt: new Date().toISOString(),
                consentMarketing,
            },
        });
        ({ token } = await payload.login({
            collection: "customers",
            data: { email, password },
        }));
    } catch (caught) {
        payload.logger.warn({ err: caught, msg: "Customer registration failed" });
        error = isEmailTaken(caught) ? "emailTaken" : "generic";
    }

    if (error) return { error };
    if (!token) return { error: "generic" };

    await setAuthCookie(token);
    redirect(ROUTES.account(locale));
};

export const login = async (
    _previous: AuthFormState,
    formData: FormData
): Promise<AuthFormState> => {
    const locale = readLocale(formData);
    const email = readEmail(formData);
    const password = String(formData.get("password") ?? "");

    const fieldErrors = validateCredentials(email, password) ?? {};
    if (Object.keys(fieldErrors).length) return { fieldErrors };

    const payload = await getPayloadClient();
    let token: string | undefined;
    let error: AuthErrorKey | undefined;

    try {
        ({ token } = await payload.login({
            collection: "customers",
            data: { email, password },
        }));
    } catch (caught) {
        if (!isBadCredentials(caught)) {
            payload.logger.warn({ err: caught, msg: "Customer login failed" });
        }
        error = isBadCredentials(caught) ? "invalidCredentials" : "generic";
    }

    if (error) return { error };
    if (!token) return { error: "generic" };

    await setAuthCookie(token);
    redirect(ROUTES.account(locale));
};

export const logout = async (formData: FormData): Promise<void> => {
    const locale = readLocale(formData);
    await clearAuthCookie();
    redirect(ROUTES.login(locale));
};
