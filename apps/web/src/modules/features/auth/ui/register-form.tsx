"use client";

import { useActionState } from "react";

import Link from "next/link";

import { Button } from "@workspace/ui/components/button";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Text } from "@workspace/ui/components/text";

import { ROUTES } from "@/modules/shared/config";
import { useI18n } from "@/modules/shared/i18n";
import { FormField } from "@/modules/shared/ui/form-field";

import { register } from "../api/auth.actions";
import type { AuthFormState } from "../type/auth.type";

const INITIAL_STATE: AuthFormState = {};

interface RegisterFormProps {
    source?: string;
}

export const RegisterForm = ({ source }: RegisterFormProps) => {
    const { locale, dictionary } = useI18n();
    const { account } = dictionary;
    const [state, action, pending] = useActionState(register, INITIAL_STATE);
    const fieldErrors = state.fieldErrors ?? {};

    return (
        <form action={action} className="flex flex-col gap-5" noValidate>
            <input type="hidden" name="locale" value={locale} />
            {source && <input type="hidden" name="source" value={source} />}

            <FormField
                id="name"
                label={account.name}
                error={fieldErrors.name && account.errors[fieldErrors.name]}
            >
                <Input
                    id="name"
                    name="name"
                    autoComplete="name"
                    required
                    aria-invalid={Boolean(fieldErrors.name)}
                />
            </FormField>

            <FormField
                id="email"
                label={account.email}
                error={fieldErrors.email && account.errors[fieldErrors.email]}
            >
                <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    aria-invalid={Boolean(fieldErrors.email)}
                />
            </FormField>

            <FormField id="phone" label={account.phone}>
                <Input id="phone" name="phone" type="tel" autoComplete="tel" />
            </FormField>

            <FormField
                id="password"
                label={account.password}
                hint={account.passwordHint}
                error={fieldErrors.password && account.errors[fieldErrors.password]}
            >
                <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    aria-invalid={Boolean(fieldErrors.password)}
                />
            </FormField>

            <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                    <Checkbox
                        id="consentPrivacy"
                        name="consentPrivacy"
                        required
                        aria-invalid={Boolean(fieldErrors.consentPrivacy)}
                        className="mt-0.5"
                    />
                    <Label htmlFor="consentPrivacy" className="leading-snug">
                        {account.consentPrivacy}
                    </Label>
                </div>
                {fieldErrors.consentPrivacy && (
                    <p role="alert" className="text-xs text-destructive">
                        {account.errors[fieldErrors.consentPrivacy]}
                    </p>
                )}
                <div className="flex items-start gap-3">
                    <Checkbox id="consentMarketing" name="consentMarketing" className="mt-0.5" />
                    <Label htmlFor="consentMarketing" className="leading-snug">
                        {account.consentMarketing}
                    </Label>
                </div>
            </div>

            {state.error && (
                <p role="alert" className="text-sm text-destructive">
                    {account.errors[state.error]}
                </p>
            )}

            <Button type="submit" disabled={pending}>
                {pending ? account.submitting : account.register}
            </Button>

            <Text size="sm" muted>
                {account.haveAccount}{" "}
                <Link href={ROUTES.login(locale)} className="text-foreground underline">
                    {account.login}
                </Link>
            </Text>
        </form>
    );
};
