import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Container } from "@workspace/ui/components/container";

import { getCurrentCustomer } from "@/modules/entities";
import { AuthCard, RegisterForm } from "@/modules/features";
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
        <Container className="py-16 md:py-24">
            <AuthCard title={account.register} description={account.registerIntro}>
                <RegisterForm source={source} />
            </AuthCard>
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
