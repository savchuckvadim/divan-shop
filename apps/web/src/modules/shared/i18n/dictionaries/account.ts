import type { Locale } from "@/modules/shared/config";

export interface AccountDictionary {
    title: string;
    greeting: string;
    login: string;
    register: string;
    logout: string;
    email: string;
    password: string;
    passwordHint: string;
    name: string;
    phone: string;
    consentPrivacy: string;
    consentMarketing: string;
    yourCode: string;
    codeHint: string;
    requestVisit: string;
    requestVisitIntro: string;
    preferredDate: string;
    preferredTime: string;
    morning: string;
    afternoon: string;
    evening: string;
    note: string;
    notePlaceholder: string;
    submit: string;
    submitting: string;
    visits: string;
    noVisits: string;
    visitRequested: string;
    haveAccount: string;
    noAccount: string;
    loginIntro: string;
    registerIntro: string;
    status: {
        requested: string;
        confirmed: string;
        visited: string;
        cancelled: string;
    };
    errors: {
        invalidCredentials: string;
        emailTaken: string;
        required: string;
        invalidEmail: string;
        passwordTooShort: string;
        invalidDate: string;
        notAuthenticated: string;
        generic: string;
    };
}

export const ACCOUNT: Record<Locale, AccountDictionary> = {
    ru: {
        title: "Личный кабинет",
        greeting: "Здравствуйте, {name}",
        login: "Войти",
        register: "Зарегистрироваться",
        logout: "Выйти",
        email: "Email",
        password: "Пароль",
        passwordHint: "Не менее 8 символов",
        name: "Имя",
        phone: "Телефон",
        consentPrivacy: "Я согласен(на) на обработку персональных данных",
        consentMarketing: "Хочу получать новости и предложения",
        yourCode: "Ваш код на скидку",
        codeHint: "Покажите этот код в шоуруме и получите скидку {percent}% на покупку.",
        requestVisit: "Записаться в шоурум",
        requestVisitIntro: "Выберите удобный день, и менеджер подтвердит визит.",
        preferredDate: "Дата визита",
        preferredTime: "Время",
        morning: "Утро (10:00–13:00)",
        afternoon: "День (13:00–17:00)",
        evening: "Вечер (17:00–20:00)",
        note: "Комментарий",
        notePlaceholder: "Какие модели хотите посмотреть?",
        submit: "Отправить заявку",
        submitting: "Отправляем…",
        visits: "Мои визиты",
        noVisits: "Заявок на визит пока нет.",
        visitRequested: "Заявка принята. Мы свяжемся с вами для подтверждения.",
        haveAccount: "Уже есть аккаунт?",
        noAccount: "Ещё нет аккаунта?",
        loginIntro: "Войдите, чтобы увидеть свой код на скидку и записаться в шоурум.",
        registerIntro: "Зарегистрируйтесь и получите персональный код на скидку в шоуруме.",
        status: {
            requested: "Ожидает подтверждения",
            confirmed: "Подтверждён",
            visited: "Состоялся",
            cancelled: "Отменён",
        },
        errors: {
            invalidCredentials: "Неверный email или пароль",
            emailTaken: "Этот email уже зарегистрирован",
            required: "Заполните это поле",
            invalidEmail: "Введите корректный email",
            passwordTooShort: "Пароль должен быть не короче 8 символов",
            invalidDate: "Выберите дату не раньше сегодняшнего дня",
            notAuthenticated: "Войдите в аккаунт, чтобы продолжить",
            generic: "Что-то пошло не так. Попробуйте ещё раз.",
        },
    },
    en: {
        title: "My account",
        greeting: "Hello, {name}",
        login: "Log in",
        register: "Sign up",
        logout: "Log out",
        email: "Email",
        password: "Password",
        passwordHint: "At least 8 characters",
        name: "Name",
        phone: "Phone",
        consentPrivacy: "I agree to the processing of my personal data",
        consentMarketing: "Send me news and offers",
        yourCode: "Your discount code",
        codeHint: "Show this code at the showroom to get {percent}% off your purchase.",
        requestVisit: "Book a showroom visit",
        requestVisitIntro: "Pick a convenient day and our manager will confirm the visit.",
        preferredDate: "Visit date",
        preferredTime: "Time",
        morning: "Morning (10:00–13:00)",
        afternoon: "Afternoon (13:00–17:00)",
        evening: "Evening (17:00–20:00)",
        note: "Note",
        notePlaceholder: "Which models would you like to see?",
        submit: "Send request",
        submitting: "Sending…",
        visits: "My visits",
        noVisits: "No visit requests yet.",
        visitRequested: "Request received. We will contact you to confirm.",
        haveAccount: "Already have an account?",
        noAccount: "Don't have an account yet?",
        loginIntro: "Log in to see your discount code and book a showroom visit.",
        registerIntro: "Sign up to get a personal discount code for the showroom.",
        status: {
            requested: "Awaiting confirmation",
            confirmed: "Confirmed",
            visited: "Visited",
            cancelled: "Cancelled",
        },
        errors: {
            invalidCredentials: "Wrong email or password",
            emailTaken: "This email is already registered",
            required: "This field is required",
            invalidEmail: "Enter a valid email",
            passwordTooShort: "Password must be at least 8 characters",
            invalidDate: "Choose today or a later date",
            notAuthenticated: "Log in to continue",
            generic: "Something went wrong. Please try again.",
        },
    },
    es: {
        title: "Mi cuenta",
        greeting: "Hola, {name}",
        login: "Iniciar sesión",
        register: "Registrarse",
        logout: "Cerrar sesión",
        email: "Email",
        password: "Contraseña",
        passwordHint: "Mínimo 8 caracteres",
        name: "Nombre",
        phone: "Teléfono",
        consentPrivacy: "Acepto el tratamiento de mis datos personales",
        consentMarketing: "Quiero recibir novedades y ofertas",
        yourCode: "Tu código de descuento",
        codeHint:
            "Muestra este código en el showroom y obtén un {percent}% de descuento en tu compra.",
        requestVisit: "Reservar visita al showroom",
        requestVisitIntro: "Elige un día y nuestro gestor confirmará la visita.",
        preferredDate: "Fecha de la visita",
        preferredTime: "Hora",
        morning: "Mañana (10:00–13:00)",
        afternoon: "Mediodía (13:00–17:00)",
        evening: "Tarde (17:00–20:00)",
        note: "Comentario",
        notePlaceholder: "¿Qué modelos quieres ver?",
        submit: "Enviar solicitud",
        submitting: "Enviando…",
        visits: "Mis visitas",
        noVisits: "Todavía no hay solicitudes de visita.",
        visitRequested: "Solicitud recibida. Te contactaremos para confirmar.",
        haveAccount: "¿Ya tienes una cuenta?",
        noAccount: "¿Aún no tienes cuenta?",
        loginIntro: "Inicia sesión para ver tu código de descuento y reservar una visita.",
        registerIntro: "Regístrate y recibe un código de descuento personal para el showroom.",
        status: {
            requested: "Pendiente de confirmación",
            confirmed: "Confirmada",
            visited: "Realizada",
            cancelled: "Cancelada",
        },
        errors: {
            invalidCredentials: "Email o contraseña incorrectos",
            emailTaken: "Este email ya está registrado",
            required: "Este campo es obligatorio",
            invalidEmail: "Introduce un email válido",
            passwordTooShort: "La contraseña debe tener al menos 8 caracteres",
            invalidDate: "Elige hoy o una fecha posterior",
            notAuthenticated: "Inicia sesión para continuar",
            generic: "Algo salió mal. Inténtalo de nuevo.",
        },
    },
    uk: {
        title: "Особистий кабінет",
        greeting: "Вітаємо, {name}",
        login: "Увійти",
        register: "Зареєструватися",
        logout: "Вийти",
        email: "Email",
        password: "Пароль",
        passwordHint: "Не менше 8 символів",
        name: "Ім'я",
        phone: "Телефон",
        consentPrivacy: "Я погоджуюся на обробку персональних даних",
        consentMarketing: "Хочу отримувати новини та пропозиції",
        yourCode: "Ваш код на знижку",
        codeHint: "Покажіть цей код у шоурумі та отримайте знижку {percent}% на покупку.",
        requestVisit: "Записатися до шоуруму",
        requestVisitIntro: "Оберіть зручний день, і менеджер підтвердить візит.",
        preferredDate: "Дата візиту",
        preferredTime: "Час",
        morning: "Ранок (10:00–13:00)",
        afternoon: "День (13:00–17:00)",
        evening: "Вечір (17:00–20:00)",
        note: "Коментар",
        notePlaceholder: "Які моделі хочете подивитися?",
        submit: "Надіслати заявку",
        submitting: "Надсилаємо…",
        visits: "Мої візити",
        noVisits: "Заявок на візит поки немає.",
        visitRequested: "Заявку прийнято. Ми зв'яжемося з вами для підтвердження.",
        haveAccount: "Вже є акаунт?",
        noAccount: "Ще немає акаунта?",
        loginIntro: "Увійдіть, щоб побачити свій код на знижку та записатися до шоуруму.",
        registerIntro: "Зареєструйтеся та отримайте персональний код на знижку в шоурумі.",
        status: {
            requested: "Очікує підтвердження",
            confirmed: "Підтверджено",
            visited: "Відбувся",
            cancelled: "Скасовано",
        },
        errors: {
            invalidCredentials: "Неправильний email або пароль",
            emailTaken: "Цей email уже зареєстровано",
            required: "Заповніть це поле",
            invalidEmail: "Введіть коректний email",
            passwordTooShort: "Пароль має бути не коротшим за 8 символів",
            invalidDate: "Оберіть сьогоднішню або пізнішу дату",
            notAuthenticated: "Увійдіть в акаунт, щоб продовжити",
            generic: "Щось пішло не так. Спробуйте ще раз.",
        },
    },
};
