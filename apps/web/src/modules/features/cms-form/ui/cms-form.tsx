"use client";

import { useCallback, useState } from "react";

import { useRouter } from "next/navigation";

import type { FormFieldBlock, Form as FormType } from "@payloadcms/plugin-form-builder/types";
import type { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@workspace/ui/components/button";
import { FormMessage } from "@workspace/ui/composites/form-field";

import { useI18n } from "@/modules/shared/i18n";
import { getClientSideURL } from "@/modules/shared/lib";
import { RichText } from "@/modules/shared/ui";

import { fields } from "./fields";

export interface CmsFormProps {
    id?: string;
    form: FormType;
    enableIntro?: boolean | null;
    introContent?: DefaultTypedEditorState | null;
}

interface SubmitError {
    message: string;
    status?: string;
}

export const CmsForm = ({ form, enableIntro, introContent }: CmsFormProps) => {
    const { id: formId, confirmationMessage, confirmationType, redirect, submitButtonLabel } = form;
    const { dictionary } = useI18n();
    const router = useRouter();

    const formMethods = useForm({ defaultValues: form.fields });
    const {
        control,
        formState: { errors },
        handleSubmit,
        register,
    } = formMethods;

    const [isLoading, setIsLoading] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [error, setError] = useState<SubmitError | undefined>();

    const onSubmit = useCallback(
        async (data: FormFieldBlock[]) => {
            setError(undefined);
            setIsLoading(true);

            const submissionData = Object.entries(data).map(([field, value]) => ({ field, value }));

            try {
                const response = await fetch(`${getClientSideURL()}/api/form-submissions`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ form: formId, submissionData }),
                });
                const result = await response.json();

                if (response.status >= 400) {
                    setError({
                        message: result.errors?.[0]?.message || dictionary.form.error,
                        status: result.status,
                    });
                    return;
                }

                setHasSubmitted(true);

                if (confirmationType === "redirect" && redirect?.url) {
                    router.push(redirect.url);
                }
            } catch {
                setError({ message: dictionary.form.error });
            } finally {
                setIsLoading(false);
            }
        },
        [confirmationType, dictionary.form.error, formId, redirect, router]
    );

    return (
        <div className="container lg:max-w-[48rem]">
            {enableIntro && introContent && !hasSubmitted && (
                <RichText className="mb-8 lg:mb-12" data={introContent} enableGutter={false} />
            )}
            <div className="rounded-xl border border-border bg-card p-4 lg:p-6">
                <FormProvider {...formMethods}>
                    {hasSubmitted && confirmationType === "message" && (
                        <RichText data={confirmationMessage} />
                    )}
                    {error && (
                        <FormMessage variant="error" className="mb-4">
                            {error.status ? `${error.status}: ` : ""}
                            {error.message}
                        </FormMessage>
                    )}
                    {!hasSubmitted && (
                        <form id={String(formId)} onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-6 flex flex-col gap-6">
                                {form.fields?.map((field, index) => {
                                    const Field = fields[field.blockType as keyof typeof fields] as
                                        React.FC<Record<string, unknown>> | undefined;
                                    if (!Field) return null;
                                    return (
                                        <Field
                                            key={index}
                                            form={form}
                                            {...field}
                                            {...formMethods}
                                            control={control}
                                            errors={errors}
                                            register={register}
                                        />
                                    );
                                })}
                            </div>
                            <Button form={String(formId)} type="submit" disabled={isLoading}>
                                {isLoading
                                    ? dictionary.form.submitting
                                    : submitButtonLabel || dictionary.form.submit}
                            </Button>
                        </form>
                    )}
                </FormProvider>
            </div>
        </div>
    );
};
