"use client";

import { useFormContext } from "react-hook-form";

import { useI18n } from "@/modules/shared/i18n";

interface FieldState {
    error: string | undefined;
    requiredLabel: string;
}

export const useFieldState = (name: string): FieldState => {
    const {
        formState: { errors },
    } = useFormContext();
    const { dictionary } = useI18n();
    const fieldError = errors[name];

    return {
        error: fieldError
            ? (fieldError.message as string | undefined) || dictionary.form.fieldRequired
            : undefined,
        requiredLabel: dictionary.form.required,
    };
};
