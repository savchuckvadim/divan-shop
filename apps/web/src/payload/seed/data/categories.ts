import type { Localized } from "./site";

export interface CategorySeed {
    slug: string;
    title: Localized<string>;
    description: Localized<string>;
}

export const CATEGORIES_SEED: CategorySeed[] = [
    {
        slug: "chaise-longue",
        title: {
            es: "Sofás chaise longue",
            en: "Chaise longue sofas",
            ru: "Диваны с шезлонгом",
            uk: "Дивани з шезлонгом",
        },
        description: {
            es: "Sofás chaise longue (cheslong, cheslón, chaiselongue) con módulo reversible, en tela o piel. Entrega en Alicante y Costa Blanca.",
            en: "Chaise longue and L-shaped sofas with a reversible chaise module, in fabric or leather. Delivery across Alicante and the Costa Blanca.",
            ru: "Диваны с шезлонгом (оттоманкой) с переставляемым модулем, в ткани или коже. Доставка по Аликанте и Коста-Бланке.",
            uk: "Дивани з шезлонгом (оттоманкою) з переставним модулем, у тканині або шкірі. Доставка по Аліканте та Коста-Бланці.",
        },
    },
    {
        slug: "rinconeras",
        title: {
            es: "Sofás rinconera",
            en: "Corner sofas",
            ru: "Угловые диваны",
            uk: "Кутові дивани",
        },
        description: {
            es: "Sofás rinconera para aprovechar cada esquina del salón: fijos, con asientos deslizantes o con cama.",
            en: "Corner sofas that make the most of every living room: fixed, with sliding seats or with a bed.",
            ru: "Угловые диваны для гостиной любого размера: стационарные, с выдвижными сиденьями или раскладные.",
            uk: "Кутові дивани для вітальні будь-якого розміру: стаціонарні, з висувними сидіннями або розкладні.",
        },
    },
    {
        slug: "sofa-cama",
        title: {
            es: "Sofás cama",
            en: "Sofa beds",
            ru: "Диваны-кровати",
            uk: "Дивани-ліжка",
        },
        description: {
            es: "Sofás cama con apertura italiana o sistema libro, colchones de 120 a 160 cm. Ideales para apartamentos y visitas.",
            en: "Sofa beds with Italian pull-out or click-clack opening, mattresses from 120 to 160 cm. Ideal for apartments and guests.",
            ru: "Диваны-кровати с итальянским выкатным механизмом или еврокнижкой, спальное место от 120 до 160 см.",
            uk: "Дивани-ліжка з італійським висувним механізмом або єврокнижкою, спальне місце від 120 до 160 см.",
        },
    },
    {
        slug: "sofas-relax",
        title: {
            es: "Sofás relax",
            en: "Recliner sofas",
            ru: "Диваны-реклайнеры",
            uk: "Дивани-реклайнери",
        },
        description: {
            es: "Sofás relax manuales y motorizados con reposapiés y respaldo reclinable, con puerto USB opcional.",
            en: "Manual and motorised recliner sofas with footrest and reclining backrest, optional USB port.",
            ru: "Диваны-реклайнеры с ручным и электрическим механизмом, подножкой и откидной спинкой.",
            uk: "Дивани-реклайнери з ручним та електричним механізмом, підніжкою та відкидною спинкою.",
        },
    },
    {
        slug: "modulares",
        title: {
            es: "Sofás modulares",
            en: "Modular sofas",
            ru: "Модульные диваны",
            uk: "Модульні дивани",
        },
        description: {
            es: "Sofás modulares que crecen con tu casa: combina módulos, chaise longue y puffs a medida.",
            en: "Modular sofas that grow with your home: combine modules, chaise longues and pouffes to size.",
            ru: "Модульные диваны, которые растут вместе с домом: комбинируйте модули, шезлонги и пуфы.",
            uk: "Модульні дивани, що ростуть разом із домом: комбінуйте модулі, шезлонги та пуфи.",
        },
    },
    {
        slug: "sofas-piel",
        title: {
            es: "Sofás de piel",
            en: "Leather sofas",
            ru: "Кожаные диваны",
            uk: "Шкіряні дивани",
        },
        description: {
            es: "Sofás de piel natural y polipiel: fáciles de limpiar, resistentes y elegantes.",
            en: "Genuine leather and faux leather sofas: easy to clean, hard-wearing and elegant.",
            ru: "Диваны из натуральной кожи и экокожи: легко чистятся, износостойкие и элегантные.",
            uk: "Дивани з натуральної шкіри та екошкіри: легко чистяться, зносостійкі й елегантні.",
        },
    },
    {
        slug: "sofas-3-plazas",
        title: {
            es: "Sofás 3 plazas",
            en: "3 seater sofas",
            ru: "Трёхместные диваны",
            uk: "Тримісні дивани",
        },
        description: {
            es: "Sofás de 3 plazas y conjuntos 3+2 para salones de todos los tamaños, en tela antimanchas o piel.",
            en: "3 seater sofas and 3+2 sets for living rooms of every size, in stain-resistant fabric or leather.",
            ru: "Трёхместные диваны и комплекты 3+2 для гостиных любого размера, в антивандальной ткани или коже.",
            uk: "Тримісні дивани та комплекти 3+2 для віталень будь-якого розміру, в антивандальній тканині або шкірі.",
        },
    },
    {
        slug: "sofas-2-plazas",
        title: {
            es: "Sofás 2 plazas",
            en: "2 seater sofas",
            ru: "Двухместные диваны",
            uk: "Двомісні дивани",
        },
        description: {
            es: "Sofás de 2 plazas compactos para apartamentos, terrazas cerradas y segundas residencias.",
            en: "Compact 2 seater sofas for apartments, enclosed terraces and holiday homes.",
            ru: "Компактные двухместные диваны для апартаментов, застеклённых террас и дач.",
            uk: "Компактні двомісні дивани для апартаментів, засклених терас і дач.",
        },
    },
    {
        slug: "sillones-relax",
        title: {
            es: "Sillones relax",
            en: "Recliner armchairs",
            ru: "Кресла-реклайнеры",
            uk: "Крісла-реклайнери",
        },
        description: {
            es: "Sillones relax y butacas reclinables, manuales o eléctricos, con función levantapersonas opcional.",
            en: "Recliner and lift armchairs, manual or electric, with an optional rise-and-recline function.",
            ru: "Кресла-реклайнеры с ручным или электрическим механизмом, опционально с функцией подъёма.",
            uk: "Крісла-реклайнери з ручним або електричним механізмом, опційно з функцією підйому.",
        },
    },
];
