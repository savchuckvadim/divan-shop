import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { Label } from "@workspace/ui/components/label";
import { cn } from "@workspace/ui/lib/utils";

const formMessageVariants = cva("text-sm", {
    variants: {
        variant: {
            error: "text-destructive",
            success: "rounded-md bg-success/40 px-3 py-2 text-foreground",
            info: "text-muted-foreground",
        },
    },
    defaultVariants: {
        variant: "info",
    },
});

export interface FormMessageProps
    extends React.ComponentProps<"p">, VariantProps<typeof formMessageVariants> {}

function FormMessage({ className, variant, ...props }: FormMessageProps) {
    return (
        <p
            data-slot="form-message"
            data-variant={variant ?? "info"}
            role={variant === "error" ? "alert" : undefined}
            className={cn(formMessageVariants({ variant }), className)}
            {...props}
        />
    );
}

export interface FormFieldProps extends React.ComponentProps<"div"> {
    label: React.ReactNode;
    htmlFor: string;
    hint?: React.ReactNode;
    error?: React.ReactNode;
    required?: boolean;
    requiredLabel?: string;
    inline?: boolean;
}

function FormField({
    label,
    htmlFor,
    hint,
    error,
    required,
    requiredLabel,
    inline = false,
    className,
    children,
    ...props
}: FormFieldProps) {
    const labelNode = (
        <Label htmlFor={htmlFor} data-slot="form-field-label">
            {label}
            {required && (
                <span data-slot="form-field-required" className="text-destructive">
                    {" "}
                    *{requiredLabel && <span className="sr-only"> ({requiredLabel})</span>}
                </span>
            )}
        </Label>
    );

    return (
        <div
            data-slot="form-field"
            data-inline={inline ? "true" : undefined}
            data-invalid={error ? "true" : undefined}
            className={cn("flex flex-col gap-2", className)}
            {...props}
        >
            {inline ? (
                <div className="flex items-center gap-2">
                    {children}
                    {labelNode}
                </div>
            ) : (
                <>
                    {labelNode}
                    {children}
                </>
            )}
            {error ? (
                <FormMessage variant="error">{error}</FormMessage>
            ) : (
                hint && <FormMessage variant="info">{hint}</FormMessage>
            )}
        </div>
    );
}

export { FormField, FormMessage, formMessageVariants };
