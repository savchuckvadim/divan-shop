export type AuthErrorKey = "invalidCredentials" | "emailTaken" | "generic";

export type AuthFieldErrorKey = "required" | "invalidEmail" | "passwordTooShort";

export type AuthField = "email" | "password" | "name" | "consentPrivacy";

export interface AuthFormState {
    error?: AuthErrorKey;
    fieldErrors?: Partial<Record<AuthField, AuthFieldErrorKey>>;
}
