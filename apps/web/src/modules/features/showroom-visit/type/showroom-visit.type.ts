export type VisitErrorKey = "notAuthenticated" | "generic";

export type VisitFieldErrorKey = "required" | "invalidDate";

export interface VisitFormState {
    success?: boolean;
    error?: VisitErrorKey;
    fieldErrors?: { preferredDate?: VisitFieldErrorKey };
}
