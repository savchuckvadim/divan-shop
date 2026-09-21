import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { CalendarDaysIcon } from "lucide-react";

import { Badge } from "@workspace/ui/components/badge";
import { Container } from "@workspace/ui/components/container";
import { Heading } from "@workspace/ui/components/heading";
import { Text } from "@workspace/ui/components/text";
import { Card } from "@workspace/ui/composites/card";
import { EmptyState } from "@workspace/ui/composites/empty-state";
import { Section } from "@workspace/ui/composites/section";

import { getCurrentCustomer, getCustomerVisits, VISIT_STATUS_BADGE } from "@/modules/entities";
import { LogoutButton, RequestVisitForm } from "@/modules/features";
import { type Locale, LOCALE_INTL, ROUTES, SITE } from "@/modules/shared/config";
import { getDictionary, interpolate } from "@/modules/shared/i18n";
import { generateMeta } from "@/modules/shared/seo";

interface AccountPageProps {
    locale: Locale;
}

const TICKET_NOTCH =
    "before:absolute before:-left-3 before:top-1/2 before:size-6 before:-translate-y-1/2 before:rounded-full before:border before:border-dashed before:border-primary/50 before:bg-background before:content-[''] after:absolute after:-right-3 after:top-1/2 after:size-6 after:-translate-y-1/2 after:rounded-full after:border after:border-dashed after:border-primary/50 after:bg-background after:content-['']";

export const AccountPage = async ({ locale }: AccountPageProps) => {
    const customer = await getCurrentCustomer(await headers());
    if (!customer) redirect(ROUTES.login(locale));

    const visits = await getCustomerVisits(customer);
    const { account } = getDictionary(locale);
    const formatDate = new Intl.DateTimeFormat(LOCALE_INTL[locale], { dateStyle: "long" });
    const minDate = new Date().toISOString().slice(0, 10);
    const percent = customer.discountPercent ?? SITE.showroomDiscountPercent;

    return (
        <Container className="flex flex-col gap-10 py-10 md:gap-12 md:py-14">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="flex flex-col gap-3">
                    <Text as="span" eyebrow className="text-primary">
                        {account.title}
                    </Text>
                    <Heading as="h1" size="lg">
                        {interpolate(account.greeting, { name: customer.name })}
                    </Heading>
                </div>
                <LogoutButton />
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
                <Card
                    className={`relative overflow-visible border-dashed border-primary/50 ${TICKET_NOTCH}`}
                    eyebrow={account.yourCode}
                    footer={
                        <Text as="span" size="xs" muted className="uppercase tracking-[0.14em]">
                            {account.showAtShowroom}
                        </Text>
                    }
                >
                    <p className="font-mono text-4xl font-semibold tracking-[0.18em] text-foreground md:text-5xl">
                        {customer.discountCode}
                    </p>
                    <Text size="sm" muted className="mt-1">
                        {interpolate(account.codeHint, { percent })}
                    </Text>
                </Card>

                <Card title={account.requestVisit} description={account.requestVisitIntro}>
                    <RequestVisitForm minDate={minDate} />
                </Card>
            </div>

            <Section contained={false} padding="none" title={account.visits}>
                {visits.length === 0 ? (
                    <EmptyState as="p" icon={<CalendarDaysIcon />} title={account.noVisits} />
                ) : (
                    <ul className="divide-y divide-border/70 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
                        {visits.map((visit) => (
                            <li
                                key={visit.id}
                                className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
                            >
                                <div className="flex flex-col gap-1">
                                    <span className="font-serif text-lg font-medium leading-snug">
                                        {formatDate.format(new Date(visit.preferredDate))}
                                    </span>
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
            </Section>
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
