"use client";

import { useFormContext } from "react-hook-form";

import { useI18n } from "@/modules/shared/i18n";

export const Error = ({ name }: { name: string }) => {
    const {
        formState: { errors },
    } = useFormContext();
    const { dictionary } = useI18n();

    return (
        <div className="mt-2 text-sm text-destructive">
            {(errors[name]?.message as string) || dictionary.form.fieldRequired}
        </div>
    );
};
