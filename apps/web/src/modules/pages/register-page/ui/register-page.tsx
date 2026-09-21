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
import { RegisterForm } from "@/modules/features";
import { type Locale, ROUTES } from "@/modules/shared/config";
import { getDictionary } from "@/modules/shared/i18n";
import { generateMeta } from "@/modules/shared/seo";

interface RegisterPageProps {
    locale: Locale;
    source?: string;
}

export const RegisterPage = async ({ locale, source }: RegisterPageProps) => {
    const customer = await getCurrentCustomer(await headers());
    if (customer) redirect(ROUTES.account(locale));

    const { account } = getDictionary(locale);

    return (
        <Container className="py-16">
            <Card className="mx-auto w-full max-w-md">
                <CardHeader>
                    <CardTitle>{account.register}</CardTitle>
                    <CardDescription>{account.registerIntro}</CardDescription>
                </CardHeader>
                <CardContent>
                    <RegisterForm source={source} />
                </CardContent>
            </Card>
        </Container>
    );
};

export const generateRegisterPageMetadata = ({
    locale,
}: Pick<RegisterPageProps, "locale">): Metadata => {
    const { account } = getDictionary(locale);
    return generateMeta({
        locale,
        pathFor: ROUTES.register,
        fallbackTitle: account.register,
        noIndex: true,
    });
};
