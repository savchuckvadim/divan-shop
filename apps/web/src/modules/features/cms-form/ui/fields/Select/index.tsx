import React from "react";

import type { SelectField } from "@payloadcms/plugin-form-builder/types";
import type { Control, FieldErrorsImpl } from "react-hook-form";
import { Controller } from "react-hook-form";

import {
    Select as SelectComponent,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@workspace/ui/components/select";
import { FormField } from "@workspace/ui/composites/form-field";

import { useFieldState } from "../../../lib/use-field-state";
import { Width } from "../Width";

export const Select: React.FC<
    SelectField & {
        control: Control;
        errors: Partial<FieldErrorsImpl>;
    }
> = ({ name, control, label, options, required, width, defaultValue }) => {
    const { error, requiredLabel } = useFieldState(name);

    return (
        <Width width={width}>
            <FormField
                label={label}
                htmlFor={name}
                required={required}
                requiredLabel={requiredLabel}
                error={error}
            >
                <Controller
                    control={control}
                    defaultValue={defaultValue}
                    name={name}
                    render={({ field: { onChange, value } }) => {
                        const controlledValue = options.find((t) => t.value === value);

                        return (
                            <SelectComponent
                                onValueChange={(val) => onChange(val)}
                                value={controlledValue?.value}
                            >
                                <SelectTrigger
                                    className="w-full"
                                    id={name}
                                    aria-invalid={Boolean(error)}
                                >
                                    <SelectValue placeholder={label} />
                                </SelectTrigger>
                                <SelectContent>
                                    {options.map(({ label, value }) => (
                                        <SelectItem key={value} value={value}>
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </SelectComponent>
                        );
                    }}
                    rules={{ required }}
                />
            </FormField>
        </Width>
    );
};
