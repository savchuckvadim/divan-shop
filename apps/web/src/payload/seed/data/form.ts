import type { Locale } from "@/modules/shared/config";
import type { Form } from "@/payload-types";

import { richText, type RichTextState } from "../lexical";
import type { Localized } from "./site";

export const CONTACT_FORM_TITLE = "contact-manager";

type FormFields = NonNullable<Form["fields"]>;

const LABELS = {
    name: { es: "Nombre", en: "Name", ru: "Имя", uk: "Ім'я" },
    phone: {
        es: "Teléfono o WhatsApp",
        en: "Phone or WhatsApp",
        ru: "Телефон или WhatsApp",
        uk: "Телефон або WhatsApp",
    },
    email: { es: "Email", en: "Email", ru: "Email", uk: "Email" },
    message: {
        es: "¿Qué sofá te interesa?",
        en: "Which sofa are you interested in?",
        ru: "Какой диван вас интересует?",
        uk: "Який диван вас цікавить?",
    },
    consent: {
        es: "Acepto la política de privacidad y el tratamiento de mis datos para responder a mi consulta",
        en: "I accept the privacy policy and the processing of my data to answer my enquiry",
        ru: "Я принимаю политику конфиденциальности и согласен на обработку данных для ответа на запрос",
        uk: "Я приймаю політику конфіденційності та погоджуюся на обробку даних для відповіді на запит",
    },
    submit: {
        es: "Enviar consulta",
        en: "Send enquiry",
        ru: "Отправить запрос",
        uk: "Надіслати запит",
    },
} satisfies Record<string, Localized<string>>;

const CONFIRMATION: Localized<string> = {
    es: "¡Gracias! Un asesor te contactará en horario de tienda, normalmente en menos de una hora.",
    en: "Thank you! An advisor will contact you during opening hours, usually within an hour.",
    ru: "Спасибо! Менеджер свяжется с вами в рабочее время, обычно в течение часа.",
    uk: "Дякуємо! Менеджер зв'яжеться з вами в робочий час, зазвичай протягом години.",
};

export interface ContactFormLocaleData {
    fields: FormFields;
    submitButtonLabel: string;
    confirmationMessage: RichTextState;
}

export const contactFormData = (locale: Locale): ContactFormLocaleData => ({
    fields: [
        { blockType: "text", name: "name", label: LABELS.name[locale], required: true, width: 50 },
        {
            blockType: "text",
            name: "phone",
            label: LABELS.phone[locale],
            required: true,
            width: 50,
        },
        { blockType: "email", name: "email", label: LABELS.email[locale], width: 100 },
        { blockType: "textarea", name: "message", label: LABELS.message[locale], width: 100 },
        {
            blockType: "checkbox",
            name: "consent",
            label: LABELS.consent[locale],
            required: true,
            width: 100,
        },
    ],
    submitButtonLabel: LABELS.submit[locale],
    confirmationMessage: richText(CONFIRMATION[locale]),
});
