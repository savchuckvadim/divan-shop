/* Shared behaviour for the Divan design concepts (boutique.html, store.html).
 * Content lives in the HTML in Spanish; this script only enhances it. Russian comes from the
 * dictionary below (Spanish source string -> Russian), so the markup carries no i18n keys. */
(function () {
    "use strict";

    var doc = document.documentElement;
    var reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

    var store = {
        get: function (key) {
            try {
                return localStorage.getItem(key);
            } catch (e) {
                return null;
            }
        },
        set: function (key, value) {
            try {
                if (value === null) localStorage.removeItem(key);
                else localStorage.setItem(key, value);
            } catch (e) {}
        },
    };

    /* ---------------- i18n ---------------- */

    var RU = {
        "Sofás hechos en Yecla para la Costa Blanca | divan.boutique": "Диваны из Йеклы для Коста‑Бланки | divan.boutique",
        "Sofás y muebles con entrega y montaje en la Costa Blanca | divan.group": "Диваны и мебель с доставкой и сборкой на Коста‑Бланке | divan.group",
        "Saltar al contenido": "Перейти к содержанию",
        "divan.boutique, inicio": "divan.boutique, главная",
        "divan.group, inicio": "divan.group, главная",
        Principal: "Главное меню",
        Idioma: "Язык",
        Colecciones: "Коллекции",
        Proyectos: "Проекты",
        Tejidos: "Ткани",
        Servicio: "Сервис",
        Club: "Клуб",
        "Mi cuenta": "Мой кабинет",
        Cesta: "Корзина",
        "Menú": "Меню",
        "2 artículos": "2 товара",
        "Fabricado bajo pedido en Yecla · Entregado en la Costa Blanca": "Под заказ в Йекле · С доставкой по Коста‑Бланке",
        "Sofás hechos a 90 minutos de tu salón": "Диваны, сделанные в 90 минутах от вашей гостиной",
        "Cada pieza se fabrica bajo pedido en talleres de Yecla y llega a tu casa de la Costa Blanca: la subimos, la montamos y nos llevamos el embalaje.":
            "Каждую модель делают под заказ в мастерских Йеклы и привозят к вам домой на Коста‑Бланке: поднимаем, собираем и забираем упаковку.",
        "Ver la colección": "Смотреть коллекцию",
        "Pedir muestras gratis": "Заказать образцы бесплатно",
        "Sofá Montgó tapizado en terciopelo negro, de frente, sobre un suelo de madera clara": "Диван Montgó в чёрном бархате, вид спереди, на светлом деревянном полу",
        "Sofá lounge · 3,5 plazas": "Лаунж‑диван · 3,5 места",
        "Bajo pedido · 3–4 semanas": "Под заказ · 3–4 недели",
        "Cómo trabajamos": "Как мы работаем",
        "Talleres locales": "Местные мастерские",
        "Yecla y Valencia, a 90 minutos": "Йекла и Валенсия, в 90 минутах",
        "Bajo pedido": "Под заказ",
        "3–4 semanas de fabricación": "3–4 недели на изготовление",
        "Entrega y montaje": "Доставка и сборка",
        "desde 39 € en tu municipio": "от 39 € в вашем городе",
        "Muestras de tela": "Образцы тканей",
        "gratis, hasta 6 en casa": "бесплатно, до 6 штук домой",
        "Colección 2026 · 8 piezas": "Коллекция 2026 · 8 моделей",
        "La colección": "Коллекция",
        "Ocho modelos, cada uno fabricado a mano y presentado con el mismo encuadre para que compares de verdad.":
            "Восемь моделей: каждая сделана вручную и снята в одном ракурсе, чтобы их можно было честно сравнить.",
        Anterior: "Назад",
        Siguiente: "Вперёд",
        Cerrar: "Закрыть",
        "Modelos de la colección": "Модели коллекции",
        "Sofá modular · 3 módulos": "Модульный диван · 3 модуля",
        "Rinconera modular XL": "Угловой модульный диван XL",
        "Sofá de piel · 3 plazas": "Кожаный диван · 3 места",
        "Rinconera con chaise": "Угловой диван с шезлонгом",
        "Butaca giratoria": "Поворотное кресло",
        "Diván chaise": "Кушетка",
        "Butaca de piel": "Кожаное кресло",
        "Tres telas disponibles": "Три ткани на выбор",
        "Dos pieles disponibles": "Два вида кожи",
        "Dos telas disponibles": "Две ткани на выбор",
        "Sofá modular Tabarca en bouclé marfil junto a un ventanal": "Модульный диван Tabarca в букле цвета слоновой кости у большого окна",
        "Sofá Montgó en terciopelo negro": "Диван Montgó в чёрном бархате",
        "Rinconera modular Bèrnia en chenilla verde oliva": "Угловой модульный диван Bèrnia в оливковой шенилле",
        "Sofá Benissa de piel coñac a la luz de la tarde": "Кожаный диван Benissa цвета коньяка в вечернем свете",
        "Rinconera Ifach gris con chaise en un salón luminoso": "Серый угловой диван Ifach с шезлонгом в светлой гостиной",
        "Butaca giratoria Mariola en bouclé marfil": "Поворотное кресло Mariola в букле цвета слоновой кости",
        "Diván Guadalest de líneas curvas en tela arena": "Кушетка Guadalest с плавными линиями в песочной ткани",
        "Butaca Moraira de piel coñac en un interior oscuro": "Кожаное кресло Moraira цвета коньяка в тёмном интерьере",
        "Tabarca en bouclé marfil, tres módulos en línea bajo un ventanal": "Tabarca в букле цвета слоновой кости: три модуля в линию под окном",
        "Detalle del bouclé marfil y la costura del brazo": "Букле цвета слоновой кости и шов подлокотника крупным планом",
        "Esquina del módulo con pata de madera de haya": "Угол модуля с буковой ножкой",
        "Pieza destacada · Nº 01": "Главная модель · № 01",
        "Sofá modular de tres módulos": "Модульный диван из трёх модулей",
        "Tres módulos que se ordenan como quieras: en línea, en ángulo o separados. Asiento de 62 cm de fondo para sentarse de verdad, estructura de haya y bouclé con tratamiento antimanchas.":
            "Три модуля, которые можно расставить как угодно: в линию, углом или по отдельности. Глубина сиденья 62 см, чтобы сидеть по‑настоящему удобно, буковый каркас и букле с защитой от пятен.",
        Ancho: "Ширина",
        Fondo: "Глубина",
        Alto: "Высота",
        "Altura de asiento": "Высота сиденья",
        "Fondo de asiento": "Глубина сиденья",
        "Tela:": "Ткань:",
        "Hazte socio gratis": "Вступить в клуб бесплатно",
        "Bajo pedido · 3–4 semanas · IVA incluido": "Под заказ · 3–4 недели · НДС включён",
        "Añadir a la cesta": "В корзину",
        "Pedir muestras de esta tela": "Заказать образцы этой ткани",
        "Plano de Tabarca: alzado frontal, planta y perfil con medidas en centímetros": "Чертёж Tabarca: вид спереди, вид сверху и профиль, размеры в сантиметрах",
        "Alzado frontal": "Вид спереди",
        Planta: "Вид сверху",
        Perfil: "Профиль",
        "Escala 1:20 · cm": "Масштаб 1:20 · см",
        "Plano de Tabarca": "Чертёж Tabarca",
        "Medidas reales en centímetros · tolerancia ±2 cm, hecho a mano": "Реальные размеры в сантиметрах · допуск ±2 см, ручная работа",
        "Descargar el plano en PDF": "Скачать чертёж в PDF",
        "¿Cabe por tu puerta?": "Пройдёт ли в вашу дверь?",
        "Cada módulo viaja por separado: 97 × 104 × 72 cm.": "Каждый модуль едет отдельно: 97 × 104 × 72 см.",
        "Ancho de la puerta": "Ширина двери",
        cm: "см",
        "Ascensor: ancho": "Лифт: ширина",
        "Ascensor: fondo": "Лифт: глубина",
        Comprobar: "Проверить",
        "Tabarca en una casa de Altea": "Tabarca в доме в Алтее",
        "Módulos de bouclé en un salón cálido con alfombra de lana y silla de madera": "Модули из букле в тёплой гостиной с шерстяным ковром и деревянным стулом",
        "Tabarca en bouclé marfil · Altea, 2026": "Tabarca в букле цвета слоновой кости · Алтея, 2026",
        "Galería": "Галерея",
        "Luz de la Costa Blanca": "Свет Коста‑Бланки",
        "Fotografiamos cada pieza con la misma luz y el mismo encuadre.": "Каждую модель снимаем при одном свете и в одном ракурсе.",
        "Casa de pueblo en Altea: sofá de obra y nichos de cal": "Старый дом в Алтее: встроенный диван и белёные ниши",
        "Apartamento en Torrevieja: sofá blanco junto a la ventana": "Квартира в Торревьехе: белый диван у окна",
        "Brazo tapizado en terciopelo a contraluz": "Бархатный подлокотник в контровом свете",
        "Sofá curvo de obra en tonos arena": "Изогнутый встроенный диван в песочных тонах",
        "Chenilla oliva sobre alfombra de lana": "Оливковая шенилла на шерстяном ковре",
        "Diván bajo una ventana al atardecer": "Кушетка под окном на закате",
        "Salón con sofá de obra, nichos encalados y mesa redonda de madera": "Гостиная со встроенным диваном, белёными нишами и круглым деревянным столом",
        "Sofá blanco con cojín azul junto a una cortina de lino": "Белый диван с голубой подушкой у льняной шторы",
        "Detalle en blanco y negro del brazo tapizado de un sofá": "Чёрно‑белый крупный план обитого подлокотника",
        "Sofá curvo con cojines blancos y paredes de tierra": "Изогнутый диван с белыми подушками у глиняных стен",
        "Esquina de un sofá en chenilla verde oliva": "Угол дивана в оливковой шенилле",
        "Diván con cojines de lino en una habitación en penumbra": "Кушетка с льняными подушками в полумраке",
        "Casas reales, piezas reales": "Настоящие дома, настоящая мебель",
        "Cada proyecto muestra qué piezas hay en la sala y cuánto cuestan.": "В каждом проекте видно, что стоит в комнате и сколько это стоит.",
        "Ático en Playa de San Juan": "Пентхаус на Плайя‑де‑Сан‑Хуан",
        "Alicante · 96 m² · 7.ª planta · 2026": "Аликанте · 96 м² · 7‑й этаж · 2026",
        "Rinconera Ifach, Aquaclean Niebla": "Угловой диван Ifach, Aquaclean Niebla",
        "Butaca Mariola, Bouclé Marfil": "Кресло Mariola, Bouclé Marfil",
        "Salón de un ático con rinconera gris y mesa de madera clara": "Гостиная пентхауса с серым угловым диваном и светлым деревянным столом",
        "Obra nueva en Orihuela Costa": "Новостройка в Ориуэла‑Коста",
        "Orihuela Costa · 88 m² · planta baja · 2026": "Ориуэла‑Коста · 88 м² · первый этаж · 2026",
        "Diván Guadalest, Algodón Tiza": "Кушетка Guadalest, Algodón Tiza",
        "Butaca Moraira, Piel Coñac": "Кресло Moraira, Piel Coñac",
        "Entrada luminosa de una vivienda nueva con sofá curvo": "Светлый вход в новом доме с изогнутым диваном",
        "Villa en Jávea": "Вилла в Хавеа",
        "Jávea · 210 m² · doble altura · 2025": "Хавеа · 210 м² · второй свет · 2025",
        "Sofá Benissa, Piel Coñac": "Диван Benissa, Piel Coñac",
        "Sofá de piel oscura junto a un ventanal sobre el jardín, con luz de tarde": "Тёмный кожаный диван у окна в сад, вечерний свет",
        "Muestras de tela recortadas sobre una mesa de mármol": "Образцы тканей на мраморном столе",
        "Caja de muestras": "Коробка образцов",
        "Toca la tela antes de elegir": "Потрогайте ткань, прежде чем выбрать",
        "Elige hasta seis telas. Un mensajero te las lleva a casa en 48–72 horas, gratis y sin compromiso.":
            "Выберите до шести тканей. Курьер привезёт их домой за 48–72 часа, бесплатно и без обязательств.",
        "de 6 elegidas": "из 6 выбрано",
        "Pedir la caja de muestras": "Заказать коробку образцов",
        "Sin registro. Solo necesitamos tu dirección.": "Без регистрации. Нужен только ваш адрес.",
        "Cómo se hace": "Как это делается",
        "De tu pedido a tu salón": "От заказа до вашей гостиной",
        Pedido: "Заказ",
        "Eliges modelo, medida y tela. Te confirmamos plazo y precio final por escrito.": "Вы выбираете модель, размер и ткань. Мы письменно подтверждаем срок и итоговую цену.",
        Estructura: "Каркас",
        "Bastidor de madera de haya, encolado y atornillado en el taller.": "Буковый каркас, склеенный и собранный на винтах в мастерской.",
        Tapizado: "Обивка",
        "Espuma, guata y tela cortadas para tu pieza.": "Пена, синтепон и ткань раскраиваются под вашу модель.",
        Control: "Контроль",
        "Antes de salir del taller te enviamos fotos de tu sofá terminado.": "Перед отправкой присылаем фото вашего готового дивана.",
        "Lo subimos, lo montamos y retiramos el embalaje.": "Поднимаем, собираем и забираем упаковку.",
        "Manos marcando con lápiz un listón de madera": "Руки размечают карандашом деревянный брус",
        "Tapicero ajustando la tela con un mazo de madera": "Обойщик подгоняет ткань деревянной киянкой",
        "Máquina de coser industrial cosiendo piel coñac": "Промышленная швейная машина шьёт кожу цвета коньяка",
        "Calle encalada de Altea con el mar al fondo": "Белёная улочка Алтеи с видом на море",
        "Todo incluido, todo por escrito": "Всё включено, всё письменно",
        "Entrega y montaje en": "Доставка и сборка:",
        Alicante: "Аликанте",
        Torrevieja: "Торревьеха",
        "Orihuela Costa": "Ориуэла‑Коста",
        "Guardamar del Segura": "Гуардамар‑дель‑Сегура",
        Benidorm: "Бенидорм",
        Calpe: "Кальпе",
        "3–4 semanas": "3–4 недели",
        "4 semanas": "4 недели",
        "Incluye subida, montaje y retirada del embalaje.": "Включает подъём, сборку и вывоз упаковки.",
        "Garantía de 3 años": "Гарантия 3 года",
        "La garantía legal, sin letra pequeña.": "Законная гарантия, без мелкого шрифта.",
        "14 días para devolver": "14 дней на возврат",
        "En los modelos de catálogo.": "Для моделей из каталога.",
        "Pago a tu manera": "Оплата как вам удобно",
        "Tarjeta, Bizum, transferencia o a plazos.": "Карта, Bizum, перевод или рассрочка.",
        Videoconsulta: "Видеоконсультация",
        "Por WhatsApp, con las muestras en la mano: +34 600 000 000.": "В WhatsApp, с образцами в руках: +34 600 000 000.",
        "Precio club: un 5 % menos en cada pieza": "Цена клуба: на 5 % дешевле на любую модель",
        "Precio club en toda la colección": "Цена клуба на всю коллекцию",
        "Configuraciones guardadas": "Сохранённые конфигурации",
        "Seguimiento de tu pedido": "Отслеживание заказа",
        "Correo electrónico": "Электронная почта",
        "Acepto la política de privacidad.": "Я принимаю политику конфиденциальности.",
        "Unirme al club": "Вступить в клуб",
        "La selección premium vive aquí. El catálogo completo, en": "Здесь премиальная подборка. Полный каталог — на",
        "Pie de página": "Подвал сайта",
        "Colección": "Коллекция",
        "Sofás": "Диваны",
        Rinconeras: "Угловые диваны",
        Butacas: "Кресла",
        Devoluciones: "Возврат",
        "Garantía": "Гарантия",
        "Formas de pago": "Способы оплаты",
        Empresa: "Компания",
        Contacto: "Контакты",
        Legal: "Правовая информация",
        "Aviso legal": "Юридическая информация",
        Privacidad: "Конфиденциальность",
        Cookies: "Файлы cookie",
        "Condiciones de venta": "Условия продажи",
        "Tu cesta": "Ваша корзина",
        "Tabarca · 3 módulos": "Tabarca · 3 модуля",
        "Bouclé Marfil · bajo pedido": "Bouclé Marfil · под заказ",
        "Mariola · butaca giratoria": "Mariola · поворотное кресло",
        "Lana Carbón · bajo pedido": "Lana Carbón · под заказ",
        "Caja de muestras: 3 de 6 · gratis": "Коробка образцов: 3 из 6 · бесплатно",
        Subtotal: "Сумма",
        "Precio club (−5 %)": "Цена клуба (−5 %)",
        "Entrega y montaje · Torrevieja": "Доставка и сборка · Торревьеха",
        Total: "Итого",
        "Tramitar pedido": "Оформить заказ",
        "Fabricación 3–4 semanas · 14 días de desistimiento en modelos de catálogo · garantía de 3 años. En el último paso, el botón dice «Pedido con obligación de pago».":
            "Изготовление 3–4 недели · 14 дней на отказ от покупки для моделей каталога · гарантия 3 года. На последнем шаге кнопка называется «Заказ с обязательством оплаты».",
        "Menú móvil": "Мобильное меню",
        "Prototipo de diseño: modelos, precios y proyectos son datos de ejemplo. Fotos: Unsplash y Pexels.": "Дизайн-прототип: модели, цены и проекты — примерные данные. Фото: Unsplash и Pexels.",
        "Controles de diseño": "Настройки дизайна",
        "Diseño": "Дизайн",
        "Dirección": "Направление",
        Cine: "Кино",
        Plano: "Чертёж",
        Paleta: "Палитра",
        Modo: "Режим",
        Claro: "Светлая",
        Oscuro: "Тёмная",
        Auto: "Авто",
        "Neón": "Неон",
        Formas: "Формы",
        Rectas: "Строгие",
        Redondeadas: "Скруглённые",
        Conjunto: "Набор",
        Juvenil: "Молодёжный",
    };

    var PATTERNS = [
        [/^desde (.+)$/, "от $1"],
        [/^Precio club (.+)$/, "Цена клуба $1"],
        [/^En esta sala: (.+)$/, "В этой комнате: $1"],
        [/^(\d+) productos$/, "$1 товаров"],
        [/^Añadir (.+) a la cesta$/, "Добавить $1 в корзину"],
    ];

    var EXTRA = {}; // pages may register more strings: window.DV_I18N = {...}
    if (window.DV_I18N) EXTRA = window.DV_I18N;

    var lang = "es";
    var textOriginals = new WeakMap();
    var attrOriginals = new WeakMap();
    var ATTRS = ["alt", "aria-label", "placeholder", "title", "data-caption"];
    var originalTitle = document.title;

    var normalise = function (text) {
        return text.replace(/\s+/g, " ").trim();
    };

    var localiseNumbers = function (text) {
        return text
            .replace(/(\d)\.(\d{3})(?!\d)/g, "$1 $2")
            .replace(/(\d)\s?cm\b/g, "$1 см")
            .replace(/\bcm\b/g, "см")
            .replace(/m²/g, "м²");
    };

    var translate = function (source) {
        var key = normalise(source);
        if (!key) return source;
        if (lang === "es") return key;
        var out = RU[key] !== undefined ? RU[key] : EXTRA[key];
        if (out === undefined) {
            for (var i = 0; i < PATTERNS.length; i += 1) {
                if (PATTERNS[i][0].test(key)) {
                    out = key.replace(PATTERNS[i][0], PATTERNS[i][1]);
                    break;
                }
            }
        }
        return localiseNumbers(out === undefined ? key : out);
    };

    var t = function (es) {
        return lang === "es" ? es : translate(es);
    };

    var applyLang = function (next) {
        lang = next === "ru" ? "ru" : "es";
        doc.lang = lang;
        var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
            acceptNode: function (node) {
                var parent = node.parentNode;
                if (!parent || /^(SCRIPT|STYLE|NOSCRIPT)$/.test(parent.nodeName)) return NodeFilter.FILTER_REJECT;
                if (parent.closest && parent.closest("[data-no-i18n]")) return NodeFilter.FILTER_REJECT;
                return normalise(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
            },
        });
        var node;
        while ((node = walker.nextNode())) {
            if (!textOriginals.has(node)) textOriginals.set(node, node.nodeValue);
            var original = textOriginals.get(node);
            if (lang === "es") {
                node.nodeValue = original;
            } else {
                var lead = original.match(/^\s*/)[0];
                var trail = original.match(/\s*$/)[0];
                node.nodeValue = lead + translate(original) + trail;
            }
        }
        var withAttrs = document.querySelectorAll(ATTRS.map((name) => "[" + name + "]").join(","));
        withAttrs.forEach(function (element) {
            var saved = attrOriginals.get(element);
            if (!saved) {
                saved = {};
                ATTRS.forEach(function (name) {
                    if (element.hasAttribute(name)) saved[name] = element.getAttribute(name);
                });
                attrOriginals.set(element, saved);
            }
            Object.keys(saved).forEach(function (name) {
                element.setAttribute(name, lang === "es" ? saved[name] : translate(saved[name]));
            });
        });
        document.title = lang === "es" ? originalTitle : translate(originalTitle);
        document.querySelectorAll("[data-lang]").forEach(function (button) {
            button.setAttribute("aria-pressed", String(button.getAttribute("data-lang") === lang));
        });
        refreshDynamic();
    };

    /* ---------------- design controls ---------------- */

    var PALETTES = {
        cinema: { p1: "Granate", p2: "Hora azul", p3: "Tungsteno", p4: "Pinar" },
        neon: { p1: "Chicle", p2: "Lima", p3: "Voltio", p4: "Ácido" },
        atelier: { p1: "Lacre", p2: "Tinta", p3: "Pátina", p4: "Esparto" },
        blueprint: { p1: "Latón", p2: "Cianotipo", p3: "Tablero", p4: "Lacre" },
    };
    var PALETTES_RU = {
        Granate: "Гранат",
        "Hora azul": "Синий час",
        Tungsteno: "Вольфрам",
        Pinar: "Сосны",
        Lacre: "Сургуч",
        Tinta: "Чернила",
        "Pátina": "Патина",
        Esparto: "Эспарто",
        "Latón": "Латунь",
        Cianotipo: "Цианотипия",
        Tablero: "Чертёжная доска",
        Chicle: "Жвачка",
        Lima: "Лайм",
        Voltio: "Вольт",
        "Ácido": "Кислота",
    };

    var PRESETS = {
        group: { page: "store", concept: "atelier", palette: "p4", theme: "auto", shape: "round" },
        boutique: { page: "boutique", concept: "cinema", palette: "p1", theme: "light", shape: "sharp" },
        youth: { page: "boutique", concept: "neon", palette: "p2", theme: "dark", shape: "round" },
    };
    var currentPage = doc.getAttribute("data-brand") === "store" ? "store" : "boutique";
    var paletteKey = function (page) {
        return "dv2.palette." + (page || currentPage);
    };
    var applyPreset = function (name) {
        var preset = PRESETS[name];
        if (!preset) return;
        store.set("dv2.concept", preset.concept);
        store.set(paletteKey(preset.page), preset.palette);
        store.set("dv2.theme", preset.theme);
        store.set("dv2.shape", preset.shape);
        if (preset.page !== currentPage) {
            location.href = preset.page + ".html";
            return;
        }
        doc.setAttribute("data-concept", preset.concept);
        doc.setAttribute("data-palette", preset.palette);
        if (preset.theme === "auto") doc.removeAttribute("data-theme");
        else doc.setAttribute("data-theme", preset.theme);
        if (preset.shape === "round") doc.setAttribute("data-shape", "round");
        else doc.removeAttribute("data-shape");
    };

    var syncControls = function () {
        var concept = doc.getAttribute("data-concept") || "cinema";
        var palette = doc.getAttribute("data-palette") || "p1";
        var theme = doc.getAttribute("data-theme") || "auto";
        document.querySelectorAll("[data-set-concept]").forEach(function (button) {
            button.setAttribute("aria-pressed", String(button.getAttribute("data-set-concept") === concept));
        });
        document.querySelectorAll("[data-set-palette]").forEach(function (button) {
            var key = button.getAttribute("data-set-palette");
            var name = (PALETTES[concept] || {})[key] || key;
            button.setAttribute("aria-pressed", String(key === palette));
            button.setAttribute("aria-label", lang === "ru" ? PALETTES_RU[name] || name : name);
            button.setAttribute("data-palette-preview", key);
        });
        var shapeNow = doc.getAttribute("data-shape") === "round" ? "round" : "sharp";
        var themeNow = doc.getAttribute("data-theme") || "auto";
        document.querySelectorAll("[data-set-preset]").forEach(function (button) {
            var preset = PRESETS[button.getAttribute("data-set-preset")];
            var active = preset && preset.page === currentPage && preset.concept === concept && preset.palette === palette && preset.theme === themeNow && preset.shape === shapeNow;
            button.setAttribute("aria-pressed", String(Boolean(active)));
        });
        document.querySelectorAll("[data-set-shape]").forEach(function (button) {
            button.setAttribute("aria-pressed", String(button.getAttribute("data-set-shape") === shapeNow));
        });
        document.querySelectorAll("[data-set-theme]").forEach(function (button) {
            button.setAttribute("aria-pressed", String(button.getAttribute("data-set-theme") === theme));
        });
        var label = document.querySelector("[data-palette-name]");
        if (label) {
            var current = (PALETTES[concept] || {})[palette] || "";
            label.textContent = lang === "ru" ? PALETTES_RU[current] || current : current;
        }
    };

    document.addEventListener("click", function (event) {
        var target = event.target.closest("[data-set-concept],[data-set-palette],[data-set-theme],[data-set-shape],[data-set-preset],[data-lang],[data-controls-toggle]");
        if (!target) return;
        if (target.hasAttribute("data-set-concept")) {
            var concept = target.getAttribute("data-set-concept");
            doc.setAttribute("data-concept", concept);
            store.set("dv2.concept", concept);
        } else if (target.hasAttribute("data-set-palette")) {
            var palette = target.getAttribute("data-set-palette");
            doc.setAttribute("data-palette", palette);
            store.set(paletteKey(), palette);
        } else if (target.hasAttribute("data-set-theme")) {
            var theme = target.getAttribute("data-set-theme");
            if (theme === "auto") doc.removeAttribute("data-theme");
            else doc.setAttribute("data-theme", theme);
            store.set("dv2.theme", theme);
        } else if (target.hasAttribute("data-set-preset")) {
            applyPreset(target.getAttribute("data-set-preset"));
        } else if (target.hasAttribute("data-set-shape")) {
            var shape = target.getAttribute("data-set-shape");
            if (shape === "round") doc.setAttribute("data-shape", "round");
            else doc.removeAttribute("data-shape");
            store.set("dv2.shape", shape === "round" ? "round" : "sharp");
        } else if (target.hasAttribute("data-lang")) {
            var next = target.getAttribute("data-lang");
            store.set("dv2.lang", next);
            applyLang(next);
        } else if (target.hasAttribute("data-controls-toggle")) {
            var panel = target.closest("[data-controls]");
            var open = target.getAttribute("aria-expanded") !== "true";
            target.setAttribute("aria-expanded", String(open));
            panel.classList.toggle("is-collapsed", !open);
        }
        syncControls();
    });

    /* ---------------- dialogs ---------------- */

    var lastFocus = null;
    var openDialog = function (dialog) {
        if (!dialog || dialog.open) return;
        lastFocus = document.activeElement;
        if (typeof dialog.showModal === "function") dialog.showModal();
        else dialog.setAttribute("open", "");
    };
    document.querySelectorAll("dialog").forEach(function (dialog) {
        dialog.addEventListener("close", function () {
            if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
        });
        dialog.addEventListener("click", function (event) {
            if (event.target === dialog) dialog.close();
        });
    });
    document.addEventListener("click", function (event) {
        var opener = event.target.closest("[aria-controls]");
        if (opener && opener.getAttribute("aria-haspopup") === "dialog") {
            openDialog(document.getElementById(opener.getAttribute("aria-controls")));
            return;
        }
        var closer = event.target.closest("[data-close]");
        if (closer) {
            var dialog = closer.closest("dialog");
            if (dialog) dialog.close();
        }
        var add = event.target.closest("[data-add]");
        if (add) {
            document.querySelectorAll(".hdr__cart .count").forEach(function (count) {
                count.textContent = String(Number(count.textContent || 0) + 1);
            });
            openDialog(document.getElementById("cart"));
        }
    });

    /* ---------------- lightbox ---------------- */

    var lightbox = document.getElementById("lightbox");
    var lightboxLinks = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));
    var lightboxIndex = 0;
    var showLightbox = function (index) {
        if (!lightbox || lightboxLinks.length === 0) return;
        lightboxIndex = (index + lightboxLinks.length) % lightboxLinks.length;
        var link = lightboxLinks[lightboxIndex];
        var thumb = link.querySelector("img");
        var image = lightbox.querySelector("[data-lightbox-img]");
        image.src = link.getAttribute("href");
        image.alt = thumb ? thumb.alt : "";
        if (thumb) {
            image.width = thumb.width;
            image.height = thumb.height;
        }
        lightbox.querySelector("[data-lightbox-caption]").textContent = link.getAttribute("data-caption") || "";
        lightbox.querySelector("[data-lightbox-count]").textContent = lightboxIndex + 1 + " / " + lightboxLinks.length;
        openDialog(lightbox);
    };
    lightboxLinks.forEach(function (link, index) {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            showLightbox(index);
        });
    });
    if (lightbox) {
        lightbox.querySelector("[data-lightbox-prev]").addEventListener("click", function () {
            showLightbox(lightboxIndex - 1);
        });
        lightbox.querySelector("[data-lightbox-next]").addEventListener("click", function () {
            showLightbox(lightboxIndex + 1);
        });
        lightbox.addEventListener("keydown", function (event) {
            if (event.key === "ArrowLeft") showLightbox(lightboxIndex - 1);
            if (event.key === "ArrowRight") showLightbox(lightboxIndex + 1);
        });
    }

    /* ---------------- rails (carousels) ---------------- */

    document.querySelectorAll("[data-rail]").forEach(function (rail) {
        var track = rail.querySelector(".rail__track");
        var counter = rail.querySelector("[data-rail-index]");
        if (!track) return;
        var step = function (direction) {
            track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: reduced ? "auto" : "smooth" });
        };
        var prev = rail.querySelector("[data-rail-prev]");
        var next = rail.querySelector("[data-rail-next]");
        if (prev) prev.addEventListener("click", function () { step(-1); });
        if (next) next.addEventListener("click", function () { step(1); });
        rail.classList.add("has-js");
        var ticking = false;
        track.addEventListener(
            "scroll",
            function () {
                if (ticking) return;
                ticking = true;
                requestAnimationFrame(function () {
                    ticking = false;
                    var items = track.children;
                    var best = 0;
                    for (var i = 0; i < items.length; i += 1) {
                        if (items[i].offsetLeft - track.offsetLeft <= track.scrollLeft + 8) best = i;
                    }
                    if (counter) counter.textContent = String(best + 1);
                    rail.style.setProperty("--rail-progress", String(track.scrollLeft / Math.max(1, track.scrollWidth - track.clientWidth)));
                });
            },
            { passive: true }
        );
    });

    /* ---------------- marquee: neon shows the strip twice, the clone is decorative ---------------- */

    document.querySelectorAll(".strip__list").forEach(function (list) {
        var track = document.createElement("div");
        track.className = "strip__track";
        list.parentNode.insertBefore(track, list);
        track.appendChild(list);
        var clone = list.cloneNode(true);
        clone.classList.add("strip__clone");
        clone.setAttribute("aria-hidden", "true");
        track.appendChild(clone);
    });

    /* ---------------- fit check ---------------- */

    var fitForm = document.querySelector("[data-fit]");
    var runFit = function () {
        if (!fitForm) return;
        var dims = (fitForm.getAttribute("data-module") || "97,104,72").split(",").map(Number).sort(function (a, b) { return a - b; });
        var door = Number(fitForm.elements.door.value) || 0;
        var liftW = Number(fitForm.elements.liftw.value) || 0;
        var liftD = Number(fitForm.elements.liftd.value) || 0;
        var lift = [Math.min(liftW, liftD), Math.max(liftW, liftD)];
        var passesDoor = dims[0] + 2 <= door;
        var passesLift = dims[0] <= lift[0] - 2 && dims[1] <= lift[1] - 2;
        var out = fitForm.querySelector(".fit__result");
        var message;
        if (passesDoor && passesLift) {
            message = t("Pasa por una puerta de {door} cm y por un ascensor de {w} × {d} cm.");
        } else if (passesDoor) {
            message = t("Pasa por la puerta. El ascensor es pequeño: lo subimos por la escalera, como parte del servicio.");
        } else {
            message = t("No pasa: el módulo necesita una puerta de al menos {need} cm. Escríbenos y buscamos una solución.");
        }
        message = message
            .replace("{door}", door)
            .replace("{w}", liftW)
            .replace("{d}", liftD)
            .replace("{need}", dims[0] + 2);
        out.textContent = lang === "ru" ? localiseNumbers(message) : message;
        out.classList.toggle("is-bad", !passesDoor);
    };
    RU["Pasa por una puerta de {door} cm y por un ascensor de {w} × {d} cm."] = "Пройдёт в дверь {door} см и в лифт {w} × {d} см.";
    RU["Pasa por la puerta. El ascensor es pequeño: lo subimos por la escalera, como parte del servicio."] =
        "В дверь пройдёт. Лифт маловат: поднимем по лестнице, это входит в доставку.";
    RU["No pasa: el módulo necesita una puerta de al menos {need} cm. Escríbenos y buscamos una solución."] =
        "Не пройдёт: модулю нужна дверь не уже {need} см. Напишите нам, подберём решение.";
    if (fitForm) {
        fitForm.addEventListener("submit", function (event) {
            event.preventDefault();
            runFit();
        });
        fitForm.addEventListener("input", runFit);
    }

    /* ---------------- fabrics, samples, delivery, club ---------------- */

    document.querySelectorAll("input[name='fabric']").forEach(function (input) {
        input.addEventListener("change", function () {
            var name = document.querySelector("[data-fabric-name]");
            if (name) name.textContent = input.value;
        });
    });

    var samplesForm = document.querySelector("[data-samples]");
    RU["Has elegido el máximo: 6 telas."] = "Вы выбрали максимум — 6 тканей.";
    RU["Solicitud registrada en el prototipo: {n} telas."] = "Заявка принята (прототип): тканей — {n}.";
    var runSamples = function () {
        if (!samplesForm) return;
        var boxes = samplesForm.querySelectorAll("input[type='checkbox']");
        var checked = samplesForm.querySelectorAll("input[type='checkbox']:checked").length;
        boxes.forEach(function (box) {
            box.disabled = !box.checked && checked >= 6;
        });
        var count = samplesForm.querySelector("[data-samples-count]");
        if (count) count.textContent = String(checked);
        var note = samplesForm.querySelector("[data-samples-note]");
        if (note && checked >= 6) note.textContent = t("Has elegido el máximo: 6 telas.");
    };
    if (samplesForm) {
        samplesForm.addEventListener("change", runSamples);
        samplesForm.addEventListener("submit", function (event) {
            event.preventDefault();
            var checked = samplesForm.querySelectorAll("input[type='checkbox']:checked").length;
            var note = samplesForm.querySelector("[data-samples-note]");
            if (note) note.textContent = t("Solicitud registrada en el prototipo: {n} telas.").replace("{n}", checked);
        });
    }

    var deliveryForm = document.querySelector("[data-delivery]");
    var runDelivery = function () {
        if (!deliveryForm) return;
        var parts = deliveryForm.elements.town.value.split("|");
        var price = deliveryForm.querySelector("[data-delivery-price]");
        var leadTime = deliveryForm.querySelector("[data-delivery-lead]");
        if (price) price.textContent = parts[0] + " €";
        if (leadTime) leadTime.textContent = t(parts[1]);
    };
    if (deliveryForm) {
        deliveryForm.addEventListener("change", runDelivery);
        deliveryForm.addEventListener("submit", function (event) {
            event.preventDefault();
        });
    }

    var clubForm = document.querySelector("[data-club]");
    RU["Listo en el prototipo: ya ves el precio club."] = "Готово (прототип): теперь вам видна цена клуба.";
    if (clubForm) {
        clubForm.addEventListener("submit", function (event) {
            event.preventDefault();
            var note = clubForm.querySelector("[data-club-note]");
            if (note) note.textContent = t("Listo en el prototipo: ya ves el precio club.");
        });
    }

    document.querySelectorAll("form[data-filters]").forEach(function (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();
        });
    });

    var refreshDynamic = function () {
        runFit();
        runSamples();
        runDelivery();
        syncControls();
    };

    /* ---------------- reveals: images and drawings only, never text ---------------- */

    if (!reduced && "IntersectionObserver" in window && doc.classList.contains("js-anim")) {
        var targets = document.querySelectorAll(
            ".card .frame, .feature__media .frame, .sheet, .g, .project__media, .samples__media, .step .frame, .grid-card .frame"
        );
        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-in");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
        );
        var fold = window.innerHeight;
        targets.forEach(function (element) {
            if (element.getBoundingClientRect().top > fold) {
                element.classList.add("rv");
                observer.observe(element);
            }
        });
    }

    if (doc.classList.contains("controls-collapsed")) {
        var panelToggle = document.querySelector("[data-controls-toggle]");
        if (panelToggle) {
            panelToggle.setAttribute("aria-expanded", "false");
            panelToggle.closest("[data-controls]").classList.add("is-collapsed");
        }
        doc.classList.remove("controls-collapsed");
    }

    var wanted = doc.getAttribute("data-lang-wanted");
    if (wanted === "ru") applyLang("ru");
    else refreshDynamic();

    window.__dvReady = true;
})();
