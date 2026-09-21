import type { Locale } from "@/modules/shared/config";

export interface FormDictionary {
    submit: string;
    submitting: string;
    success: string;
    error: string;
    required: string;
    fieldRequired: string;
}

export const FORM: Record<Locale, FormDictionary> = {
    ru: {
        submit: "Отправить",
        submitting: "Отправляем…",
        success: "Спасибо! Мы свяжемся с вами в ближайшее время.",
        error: "Не удалось отправить форму. Попробуйте ещё раз.",
        required: "обязательно",
        fieldRequired: "Это поле обязательно",
    },
    en: {
        submit: "Send",
        submitting: "Sending…",
        success: "Thank you! We will contact you shortly.",
        error: "Could not send the form. Please try again.",
        required: "required",
        fieldRequired: "This field is required",
    },
    es: {
        submit: "Enviar",
        submitting: "Enviando…",
        success: "¡Gracias! Nos pondremos en contacto contigo en breve.",
        error: "No se pudo enviar el formulario. Inténtalo de nuevo.",
        required: "obligatorio",
        fieldRequired: "Este campo es obligatorio",
    },
    uk: {
        submit: "Надіслати",
        submitting: "Надсилаємо…",
        success: "Дякуємо! Ми зв'яжемося з вами найближчим часом.",
        error: "Не вдалося надіслати форму. Спробуйте ще раз.",
        required: "обов'язково",
        fieldRequired: "Це поле обов'язкове",
    },
};
