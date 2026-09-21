"use client";

import { useActionState } from "react";

import { CheckIcon } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@workspace/ui/components/select";
import { Textarea } from "@workspace/ui/components/textarea";

import { VISIT_TIMES } from "@/modules/shared/config";
import { useI18n } from "@/modules/shared/i18n";
import { FormField } from "@/modules/shared/ui/form-field";

import { requestVisit } from "../api/showroom-visit.actions";
import type { VisitFormState } from "../type/showroom-visit.type";

const INITIAL_STATE: VisitFormState = {};

interface RequestVisitFormProps {
    minDate: string;
    productId?: number;
}

export const RequestVisitForm = ({ minDate, productId }: RequestVisitFormProps) => {
    const { locale, dictionary } = useI18n();
    const { account } = dictionary;
    const [state, action, pending] = useActionState(requestVisit, INITIAL_STATE);
    const dateError = state.fieldErrors?.preferredDate;

    return (
        <form action={action} className="flex flex-col gap-5" noValidate>
            <input type="hidden" name="locale" value={locale} />
            {productId && <input type="hidden" name="product" value={productId} />}

            <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                    id="preferredDate"
                    label={account.preferredDate}
                    error={dateError && account.errors[dateError]}
                >
                    <Input
                        id="preferredDate"
                        name="preferredDate"
                        type="date"
                        min={minDate}
                        required
                        aria-invalid={Boolean(dateError)}
                    />
                </FormField>

                <FormField id="preferredTime" label={account.preferredTime}>
                    <Select name="preferredTime" defaultValue="morning">
                        <SelectTrigger id="preferredTime">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {VISIT_TIMES.map((time) => (
                                <SelectItem key={time} value={time}>
                                    {account[time]}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </FormField>
            </div>

            <FormField id="note" label={account.note}>
                <Textarea id="note" name="note" placeholder={account.notePlaceholder} rows={3} />
            </FormField>

            {state.error && (
                <p role="alert" className="text-sm text-destructive">
                    {account.errors[state.error]}
                </p>
            )}
            {state.success && (
                <p role="status" className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckIcon className="size-4 shrink-0" aria-hidden />
                    {account.visitRequested}
                </p>
            )}

            <Button type="submit" disabled={pending} className="self-start">
                {pending ? account.submitting : account.submit}
            </Button>
        </form>
    );
};
