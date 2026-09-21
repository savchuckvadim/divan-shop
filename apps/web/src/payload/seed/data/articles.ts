import type { Locale } from "@/modules/shared/config";

import { richText, type RichTextInput, type RichTextState } from "../lexical";
import type { Localized } from "./site";

export interface ArticleSeed {
    slug: string;
    publishedAt: string;
    title: Localized<string>;
    excerpt: Localized<string>;
    content: Localized<RichTextInput[]>;
    metaDescription: Localized<string>;
}

export interface ArticleLocaleData {
    title: string;
    excerpt: string;
    content: RichTextState;
    meta: { title: string; description: string };
}

export const articleLocaleData = (article: ArticleSeed, locale: Locale): ArticleLocaleData => ({
    title: article.title[locale],
    excerpt: article.excerpt[locale],
    content: richText(...article.content[locale]),
    meta: { title: article.title[locale], description: article.metaDescription[locale] },
});

export const ARTICLES_SEED: ArticleSeed[] = [
    {
        slug: "como-elegir-sofa",
        publishedAt: "2026-09-15T10:00:00.000Z",
        title: {
            es: "Cómo elegir sofá: medidas, tela y mecanismo",
            en: "How to choose a sofa: size, fabric and mechanism",
            ru: "Как выбрать диван: размеры, ткань и механизм",
            uk: "Як обрати диван: розміри, тканина та механізм",
        },
        excerpt: {
            es: "Tres preguntas antes de comprar: cuánto espacio tienes, quién lo va a usar y si necesitas cama. Con eso el resto es fácil.",
            en: "Three questions before you buy: how much space you have, who will use it and whether it needs to be a bed. The rest follows.",
            ru: "Три вопроса перед покупкой: сколько места, кто будет пользоваться и нужно ли спальное место. Остальное — дело техники.",
            uk: "Три запитання перед покупкою: скільки місця, хто користуватиметься і чи потрібне спальне місце. Решта — справа техніки.",
        },
        metaDescription: {
            es: "Guía práctica para elegir sofá: medidas de un sofá de 3 plazas, telas antimanchas, piel y mecanismos relax o cama.",
            en: "Practical guide to choosing a sofa: 3 seater dimensions, stain-resistant fabrics, leather and recliner or bed mechanisms.",
            ru: "Практичный гид по выбору дивана: размеры трёхместного дивана, антивандальные ткани, кожа и механизмы.",
            uk: "Практичний гід із вибору дивана: розміри тримісного дивана, антивандальні тканини, шкіра та механізми.",
        },
        content: {
            es: [
                { h: "h2", text: "Empieza por las medidas" },
                "Un sofá de 3 plazas mide entre 200 y 240 cm de ancho y unos 95 cm de fondo. Deja al menos 70 cm de paso alrededor y mide la puerta y el ascensor antes de enamorarte de un modelo: en muchos pisos de Alicante el chaise longue entra solo si el módulo se desmonta.",
                { h: "h2", text: "La tela decide cuánto dura" },
                "Con niños o mascotas, elige tela antimanchas tipo Aquaclean o piel: se limpian con agua y aguantan años. El terciopelo es precioso pero marca el roce; el lino es fresco para el clima de la costa pero se arruga. Pide siempre una muestra y mírala con la luz de tu salón.",
                { h: "h2", text: "Mecanismo solo si lo vas a usar" },
                "Un sofá cama de apertura italiana se abre a diario sin quitar los cojines; el sistema libro es más barato pero incómodo como cama fija. El relax motorizado merece la pena si ves series cada noche; si dudas, un sillón relax aparte suele ser mejor compra. Ven a la exposición y prueba los dos.",
            ],
            en: [
                { h: "h2", text: "Start with the measurements" },
                "A 3 seater sofa is 200–240 cm wide and about 95 cm deep. Leave at least 70 cm of walkway around it and measure the door and the lift before you fall for a model: in many Alicante flats a chaise longue only fits if the module comes off.",
                { h: "h2", text: "Fabric decides how long it lasts" },
                "With kids or pets, choose a stain-resistant fabric such as Aquaclean or leather: they clean with water and last for years. Velvet is beautiful but shows wear; linen is cool for the coastal climate but creases. Always ask for a sample and look at it in your own living room light.",
                { h: "h2", text: "A mechanism only if you will use it" },
                "An Italian pull-out sofa bed opens every day without removing the cushions; a click-clack is cheaper but uncomfortable as a permanent bed. A motorised recliner is worth it if you watch series every night; if in doubt, a separate recliner armchair is often the better buy. Visit the showroom and try both.",
            ],
            ru: [
                { h: "h2", text: "Начните с размеров" },
                "Трёхместный диван занимает 200–240 см в ширину и около 95 см в глубину. Оставьте не меньше 70 см прохода вокруг и измерьте дверь и лифт до того, как влюбитесь в модель: во многих квартирах Аликанте диван с шезлонгом проходит только в разобранном виде.",
                { h: "h2", text: "Ткань решает, сколько он прослужит" },
                "С детьми и животными выбирайте антивандальную ткань типа Aquaclean или кожу: они чистятся водой и служат годами. Велюр красив, но быстро залащивается; лён свеж для климата побережья, но мнётся. Всегда просите образец и смотрите его при свете вашей гостиной.",
                { h: "h2", text: "Механизм — только если будете пользоваться" },
                "Диван-кровать с итальянским выкатным механизмом раскладывается каждый день без снятия подушек; еврокнижка дешевле, но неудобна как постоянная кровать. Электрический реклайнер оправдан, если вы смотрите сериалы каждый вечер; если сомневаетесь, отдельное кресло-реклайнер часто выгоднее. Приходите в шоурум и попробуйте оба.",
            ],
            uk: [
                { h: "h2", text: "Почніть із розмірів" },
                "Тримісний диван займає 200–240 см у ширину та близько 95 см у глибину. Залиште щонайменше 70 см проходу навколо та виміряйте двері й ліфт до того, як закохаєтеся в модель: у багатьох квартирах Аліканте диван із шезлонгом проходить лише в розібраному вигляді.",
                { h: "h2", text: "Тканина вирішує, скільки він прослужить" },
                "З дітьми та тваринами обирайте антивандальну тканину типу Aquaclean або шкіру: вони чистяться водою і служать роками. Велюр гарний, але швидко залисується; льон свіжий для клімату узбережжя, але мнеться. Завжди просіть зразок і дивіться його при світлі вашої вітальні.",
                { h: "h2", text: "Механізм — лише якщо будете користуватися" },
                "Диван-ліжко з італійським висувним механізмом розкладається щодня без зняття подушок; єврокнижка дешевша, але незручна як постійне ліжко. Електричний реклайнер виправданий, якщо ви дивитеся серіали щовечора; якщо сумніваєтеся, окреме крісло-реклайнер часто вигідніше. Приходьте до шоуруму і спробуйте обидва.",
            ],
        },
    },
    {
        slug: "sofa-cama-apertura-italiana-vs-sistema-libro",
        publishedAt: "2026-09-18T10:00:00.000Z",
        title: {
            es: "Sofá cama: apertura italiana vs sistema libro",
            en: "Sofa bed: Italian pull-out vs click-clack",
            ru: "Диван-кровать: итальянский механизм или еврокнижка",
            uk: "Диван-ліжко: італійський механізм чи єврокнижка",
        },
        excerpt: {
            es: "Los dos mecanismos más vendidos en la Costa Blanca, comparados por comodidad, precio y uso diario.",
            en: "The two best-selling mechanisms on the Costa Blanca, compared by comfort, price and daily use.",
            ru: "Два самых популярных механизма на Коста-Бланке: сравниваем удобство, цену и ежедневное использование.",
            uk: "Два найпопулярніші механізми на Коста-Бланці: порівнюємо зручність, ціну та щоденне використання.",
        },
        metaDescription: {
            es: "Apertura italiana o sistema libro: qué sofá cama elegir para uso diario o para invitados, con medidas de colchón y precios orientativos.",
            en: "Italian pull-out or click-clack: which sofa bed to choose for daily use or for guests, with mattress sizes and indicative prices.",
            ru: "Итальянский механизм или еврокнижка: какой диван-кровать выбрать для сна каждый день или для гостей, размеры и цены.",
            uk: "Італійський механізм чи єврокнижка: який диван-ліжко обрати для щоденного сну чи для гостей, розміри та ціни.",
        },
        content: {
            es: [
                { h: "h2", text: "Apertura italiana: la cama de verdad" },
                "Tiras de la base, el colchón de 12–18 cm se despliega en un gesto y los cojines del respaldo se quedan en su sitio. Colchones de 120, 140 o 160 x 190 cm, con opción viscoelástica. Es el mecanismo que recomendamos si alguien va a dormir en él más de dos noches por semana o si el apartamento no tiene dormitorio de invitados.",
                { h: "h2", text: "Sistema libro: sencillo y económico" },
                "El respaldo se abate y el asiento se convierte en cama; no hay colchón independiente. Cuesta entre un 30 y un 40 % menos, pesa poco y cabe en salones pequeños. La superficie es más firme y se nota la unión de los cojines, así que es la opción para visitas puntuales o para una segunda residencia.",
                { h: "h2", text: "Qué elegir" },
                "Uso diario o alquiler vacacional: apertura italiana con colchón de 140 o 160. Invitados de fin de semana y presupuesto ajustado: sistema libro. En ambos casos comprueba que el mecanismo tenga garantía y que el sofá entre por la puerta ya montado. En la exposición puedes abrir y cerrar los dos las veces que quieras.",
            ],
            en: [
                { h: "h2", text: "Italian pull-out: a real bed" },
                "Pull the base, a 12–18 cm mattress unfolds in one move and the back cushions stay where they are. Mattresses of 120, 140 or 160 x 190 cm, memory foam optional. This is the mechanism we recommend if someone will sleep on it more than two nights a week or if the flat has no guest bedroom.",
                { h: "h2", text: "Click-clack: simple and affordable" },
                "The backrest folds down and the seat becomes the bed; there is no separate mattress. It costs 30–40 % less, weighs little and fits small living rooms. The surface is firmer and you feel the join between cushions, so it is the choice for occasional guests or a holiday home.",
                { h: "h2", text: "Which one to choose" },
                "Daily use or holiday rental: Italian pull-out with a 140 or 160 mattress. Weekend guests and a tight budget: click-clack. In both cases check that the mechanism has a warranty and that the sofa fits through the door assembled. In the showroom you can open and close both as many times as you like.",
            ],
            ru: [
                { h: "h2", text: "Итальянский механизм: настоящая кровать" },
                "Потяните за основание — матрас 12–18 см раскладывается одним движением, подушки спинки остаются на месте. Матрасы 120, 140 или 160 x 190 см, есть вариант с memory foam. Этот механизм мы советуем, если кто-то будет спать на диване чаще двух ночей в неделю или в квартире нет гостевой спальни.",
                { h: "h2", text: "Еврокнижка: просто и недорого" },
                "Спинка откидывается, сиденье превращается в кровать; отдельного матраса нет. Стоит на 30–40 % дешевле, мало весит и помещается в небольшую гостиную. Поверхность жёстче, и стык подушек ощущается, поэтому это вариант для редких гостей или второго жилья.",
                { h: "h2", text: "Что выбрать" },
                "Ежедневный сон или сдача в аренду: итальянский механизм с матрасом 140 или 160. Гости на выходные и ограниченный бюджет: еврокнижка. В обоих случаях проверьте гарантию на механизм и что диван пройдёт в дверь в собранном виде. В шоуруме можно раскладывать оба сколько угодно раз.",
            ],
            uk: [
                { h: "h2", text: "Італійський механізм: справжнє ліжко" },
                "Потягніть за основу — матрац 12–18 см розкладається одним рухом, подушки спинки залишаються на місці. Матраци 120, 140 або 160 x 190 см, є варіант із memory foam. Цей механізм ми радимо, якщо хтось спатиме на дивані частіше двох ночей на тиждень або у квартирі немає гостьової спальні.",
                { h: "h2", text: "Єврокнижка: просто й недорого" },
                "Спинка відкидається, сидіння перетворюється на ліжко; окремого матраца немає. Коштує на 30–40 % дешевше, мало важить і вміщується в невелику вітальню. Поверхня жорсткіша, і стик подушок відчувається, тому це варіант для рідкісних гостей або другого житла.",
                { h: "h2", text: "Що обрати" },
                "Щоденний сон або здача в оренду: італійський механізм із матрацом 140 або 160. Гості на вихідні та обмежений бюджет: єврокнижка. В обох випадках перевірте гарантію на механізм і що диван пройде у двері в зібраному вигляді. У шоурумі можна розкладати обидва скільки завгодно разів.",
            ],
        },
    },
];
