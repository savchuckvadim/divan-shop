"use client";

import { useActionState } from "react";

import Link from "next/link";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Text } from "@workspace/ui/components/text";

import { ROUTES } from "@/modules/shared/config";
import { useI18n } from "@/modules/shared/i18n";
import { FormField } from "@/modules/shared/ui/form-field";

import { login } from "../api/auth.actions";
import type { AuthFormState } from "../type/auth.type";

const INITIAL_STATE: AuthFormState = {};

export const LoginForm = () => {
    const { locale, dictionary } = useI18n();
    const { account } = dictionary;
    const [state, action, pending] = useActionState(login, INITIAL_STATE);
    const fieldErrors = state.fieldErrors ?? {};

    return (
        <form action={action} className="flex flex-col gap-5" noValidate>
            <input type="hidden" name="locale" value={locale} />

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

            <FormField
                id="password"
                label={account.password}
                error={fieldErrors.password && account.errors[fieldErrors.password]}
            >
                <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    aria-invalid={Boolean(fieldErrors.password)}
                />
            </FormField>

            {state.error && (
                <p role="alert" className="text-sm text-destructive">
                    {account.errors[state.error]}
                </p>
            )}

            <Button type="submit" disabled={pending}>
                {pending ? account.submitting : account.login}
            </Button>

            <Text size="sm" muted>
                {account.noAccount}{" "}
                <Link href={ROUTES.register(locale)} className="text-foreground underline">
                    {account.register}
                </Link>
            </Text>
        </form>
    );
};
