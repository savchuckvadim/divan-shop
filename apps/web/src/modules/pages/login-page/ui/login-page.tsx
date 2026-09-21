import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@workspace/ui/components/card";
import { Container } from "@workspace/ui/components/container";

import { getCurrentCustomer } from "@/modules/entities";
import { LoginForm } from "@/modules/features";
import { type Locale, ROUTES } from "@/modules/shared/config";
import { getDictionary } from "@/modules/shared/i18n";
import { generateMeta } from "@/modules/shared/seo";

interface LoginPageProps {
    locale: Locale;
}

export const LoginPage = async ({ locale }: LoginPageProps) => {
    const customer = await getCurrentCustomer(await headers());
    if (customer) redirect(ROUTES.account(locale));

    const { account } = getDictionary(locale);

    return (
        <Container className="py-16">
            <Card className="mx-auto w-full max-w-md">
                <CardHeader>
                    <CardTitle>{account.login}</CardTitle>
                    <CardDescription>{account.loginIntro}</CardDescription>
                </CardHeader>
                <CardContent>
                    <LoginForm />
                </CardContent>
            </Card>
        </Container>
    );
};

export const generateLoginPageMetadata = ({ locale }: LoginPageProps): Metadata => {
    const { account } = getDictionary(locale);
    return generateMeta({
        locale,
        pathFor: ROUTES.login,
        fallbackTitle: account.login,
        noIndex: true,
    });
};
