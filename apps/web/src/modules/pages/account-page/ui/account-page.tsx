import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Badge } from "@workspace/ui/components/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@workspace/ui/components/card";
import { Container } from "@workspace/ui/components/container";
import { Heading } from "@workspace/ui/components/heading";
import { Text } from "@workspace/ui/components/text";

import { getCurrentCustomer, getCustomerVisits, VISIT_STATUS_BADGE } from "@/modules/entities";
import { LogoutButton, RequestVisitForm } from "@/modules/features";
import { type Locale, LOCALE_INTL, ROUTES, SITE } from "@/modules/shared/config";
import { getDictionary, interpolate } from "@/modules/shared/i18n";
import { generateMeta } from "@/modules/shared/seo";

interface AccountPageProps {
    locale: Locale;
}

export const AccountPage = async ({ locale }: AccountPageProps) => {
    const customer = await getCurrentCustomer(await headers());
    if (!customer) redirect(ROUTES.login(locale));

    const visits = await getCustomerVisits(customer);
    const { account } = getDictionary(locale);
    const formatDate = new Intl.DateTimeFormat(LOCALE_INTL[locale], { dateStyle: "long" });
    const minDate = new Date().toISOString().slice(0, 10);
    const percent = customer.discountPercent ?? SITE.showroomDiscountPercent;

    return (
        <Container className="flex flex-col gap-10 py-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <Heading as="h1">{interpolate(account.greeting, { name: customer.name })}</Heading>
                <LogoutButton />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>{account.yourCode}</CardTitle>
                        <CardDescription>
                            {interpolate(account.codeHint, { percent })}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="font-mono text-4xl font-semibold tracking-[0.2em] md:text-5xl">
                            {customer.discountCode}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{account.requestVisit}</CardTitle>
                        <CardDescription>{account.requestVisitIntro}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RequestVisitForm minDate={minDate} />
                    </CardContent>
                </Card>
            </div>

            <section className="flex flex-col gap-4">
                <Heading as="h2" size="md">
                    {account.visits}
                </Heading>
                {visits.length === 0 ? (
                    <Text muted>{account.noVisits}</Text>
                ) : (
                    <ul className="divide-y divide-border rounded-lg border">
                        {visits.map((visit) => (
                            <li
                                key={visit.id}
                                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                            >
                                <div className="flex flex-col gap-1">
                                    <Text as="span" className="font-medium">
                                        {formatDate.format(new Date(visit.preferredDate))}
                                    </Text>
                                    <Text as="span" size="sm" muted>
                                        {account[visit.preferredTime ?? "morning"]}
                                        {visit.note ? ` · ${visit.note}` : ""}
                                    </Text>
                                </div>
                                <Badge variant={VISIT_STATUS_BADGE[visit.status]}>
                                    {account.status[visit.status]}
                                </Badge>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </Container>
    );
};

export const generateAccountPageMetadata = ({ locale }: AccountPageProps): Metadata => {
    const { account } = getDictionary(locale);
    return generateMeta({
        locale,
        pathFor: ROUTES.account,
        fallbackTitle: account.title,
        noIndex: true,
    });
};
