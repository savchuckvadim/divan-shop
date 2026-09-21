import { Fragment } from "react";

import Link from "next/link";

import { ChevronRightIcon } from "lucide-react";

import { absoluteUrl } from "@/modules/shared/lib";
import { breadcrumbsJsonLd, JsonLd } from "@/modules/shared/seo";

export interface Crumb {
    label: string;
    href: string;
}

export const Breadcrumbs = ({ items }: { items: Crumb[] }) => (
    <>
        <JsonLd
            data={breadcrumbsJsonLd(
                items.map((item) => ({ name: item.label, url: absoluteUrl(item.href) }))
            )}
        />
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <ol className="flex flex-wrap items-center gap-1">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    return (
                        <Fragment key={item.href}>
                            <li>
                                {isLast ? (
                                    <span aria-current="page" className="text-foreground">
                                        {item.label}
                                    </span>
                                ) : (
                                    <Link href={item.href} className="hover:text-foreground">
                                        {item.label}
                                    </Link>
                                )}
                            </li>
                            {!isLast && (
                                <li aria-hidden>
                                    <ChevronRightIcon className="size-3.5" />
                                </li>
                            )}
                        </Fragment>
                    );
                })}
            </ol>
        </nav>
    </>
);
