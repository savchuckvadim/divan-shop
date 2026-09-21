import { cn } from "@workspace/ui/lib/utils";

import { SITE } from "@/modules/shared/config";

interface LogoMarkProps {
    className?: string;
}

/** CSS-only arch: a showroom doorway that also reads as a sofa back with a seat line. */
export const LogoMark = ({ className }: LogoMarkProps) => (
    <span
        aria-hidden
        data-slot="logo-mark"
        className={cn(
            "relative flex size-8 shrink-0 items-end justify-center overflow-hidden rounded-t-full rounded-b-[0.3rem] bg-primary text-primary-foreground",
            className
        )}
    >
        <span className="absolute inset-x-[22%] top-[22%] bottom-[30%] rounded-t-full border border-current/40" />
        <span className="mb-[15%] h-[6%] w-[45%] rounded-full bg-current/90" />
    </span>
);

interface LogoProps {
    className?: string;
    name?: string | null;
    caption?: string | null;
    size?: "md" | "lg";
}

export const Logo = ({ className, name, caption, size = "md" }: LogoProps) => (
    <span data-slot="logo" className={cn("inline-flex items-center gap-2.5", className)}>
        <LogoMark className={size === "lg" ? "size-10" : undefined} />
        <span className="flex flex-col">
            <span
                className={cn(
                    "font-serif font-medium leading-none tracking-[-0.02em] text-foreground",
                    size === "lg" ? "text-[1.75rem]" : "text-[1.35rem]"
                )}
            >
                {name || SITE.name}
            </span>
            {caption && (
                <span className="mt-1.5 text-[0.58rem] font-medium uppercase leading-none tracking-[0.22em] text-muted-foreground">
                    {caption}
                </span>
            )}
        </span>
    </span>
);
