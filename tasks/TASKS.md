# Task queue

Формат и правила: [README.md](./README.md). Раннер берёт первую задачу из **Queue** со `status: ready`. Контекст задач: [docs/strategy/operating-model.md](../docs/strategy/operating-model.md), решения в [docs/decisions](../docs/decisions/README.md).

Владельцу (не для раннера): заполнить `docs/strategy/targets.md`, `research/seo/competitors.md` (секция Market), запустить нейминг-спринт (T-010), завести бизнес-аккаунт Google и GBP сразу после выбора названия.

## Queue

### T-053 · Вернуть статическую генерацию (ISR) при сборке образа без БД

- status: ready
- priority: high
- area: seo
- source: chat
- created: 2026-10-05
- estimate: M
- idea: docs/ideas/2026-10-05-two-storefronts-design-fork.md

С коммита `3758ead` все контентные роуты `force-dynamic`: прод отдаёт `Cache-Control: private, no-cache, no-store` и рендерит каждую страницу на запрос, а CLAUDE.md обещает статическую генерацию. Payload пишет, что `force-dynamic` делает сайт медленнее (payloadcms.com/docs/production/building-without-a-db-connection). Нужно: `generateStaticParams`, которые при недоступной БД возвращают пустой список, плюс `revalidate` и ревалидация хуками Payload при публикации; sitemap и robots без `force-dynamic`, если это возможно; проверить, что сборка образа без БД остаётся зелёной (ловушка в `docs/HISTORY.md`).

Acceptance:

- `pnpm --filter web build` проходит с недоступной БД
- после деплоя страница каталога и статьи отдаётся из кэша (`x-nextjs-cache: HIT` или `Cache-Control` с `s-maxage`), публикация в админке обновляет страницу
- CLAUDE.md и `docs/features/site-core.md` описывают фактическое поведение
- запись в `docs/HISTORY.md`, если всплывёт ловушка

### T-069 · Молодёжная витрина: набор «Неон», домен и имя

- status: draft
- priority: low
- area: content
- source: chat
- created: 2026-10-06
- estimate: S
- idea: docs/ideas/2026-10-05-two-storefronts-design-fork.md

Владелец 2026-10-06: «вариант молодёжный тоже делаем, хоть домена пока нет» — бутик для молодой обеспеченной аудитории, набор Неон, Лайм, тёмная, скруглённые. Нужны имя и домен (связать с нейминг-спринтом T-010), подборка моделей из общего каталога через галочки витрин (T-054), тон текстов на 4 языках. Запуск — после T-054.

Questions:

- имя и домен молодёжной витрины
- отдельный ассортимент или те же модели в других тканях

### T-067 · Бутик: полный набор функций при ограниченном ассортименте

- status: ready
- priority: high
- area: content
- estimate: S
- source: chat
- created: 2026-10-06
- idea: docs/ideas/2026-10-05-online-brand-additions.md

Решение владельца 2026-10-06. Зафиксировать в `docs/product/boutique-scope.md`: критерии отбора моделей (8–20, качество, фото по T-056, маржа), какие функции бутик получает с запуска (образцы курьером, чертежи и проверка проёма, профиль посадки, видео-посадка, проекты, трекер производства, цена клуба), что показывает магазин вместо дубля (тизер со ссылкой, ADR-0011). Таблица моделей-кандидатов после обзвона фабрик (T-042).

Acceptance:

- документ согласован владельцем
- у каждой функции бутика есть задача в очереди
- ссылка из `docs/strategy/business-model.md`

### T-058 · Профиль посадки и «сравнить со своим диваном»

- status: ready
- priority: medium
- area: catalog
- estimate: M
- depends: T-042 (замеры на фабрике)
- source: chat
- created: 2026-10-06
- idea: docs/ideas/2026-10-05-online-brand-additions.md

Поля товара: высота и глубина сиденья, высота спинки и подлокотника, проседание под единым грузом, жёсткость по шкале 1–5 одной методики. Клиентский компонент сравнения: клиент вводит 2–3 цифры своего дивана (localStorage, без регистрации) и видит разницу. Тексты в словарях на 4 локалях, значения в JSON-LD `additionalProperty`. Методика замера — в `docs/playbooks/supplier-call.md`.

Acceptance:

- у товара с замерами показан профиль посадки и работает сравнение
- методика описана, шкала одна для всех моделей
- `docs/features/catalog.md` обновлён

### T-059 · Видео-посадка: один сценарий на модель и видеостраницы

- status: draft
- priority: medium
- area: content
- estimate: M
- depends: T-042 (доступ к образцам на фабрике)
- source: chat
- created: 2026-10-06
- idea: docs/ideas/2026-10-05-online-brand-additions.md

Ролик 60–90 с по единому сценарию: человек известного роста садится и ложится, ладонь продавливает подушку, механизм раскладывается, ткань крупно при дневном свете. Отдельная страница `/{locale}/video/{model}` с расшифровкой и разметкой VideoObject (Google показывает видео в выдаче только со страниц, где оно главное), копия на YouTube. Без AI-аватаров.

Acceptance:

- сценарий и чек-лист съёмки на 4 языках
- первая видеостраница проиндексирована
- VideoObject проходит Rich Results Test

### T-060 · Доставка владельцам, которых нет на месте

- status: ready
- priority: medium
- area: cms
- estimate: S
- source: chat
- created: 2026-10-06
- idea: docs/ideas/2026-10-05-online-brand-additions.md

Для владельцев вторых домов и покупателей новостроек, которые живут не здесь: в заявке и заказе — контакт key holder или управляющей компании, окно доставки, согласие на фотоотчёт после сборки. Процесс и шаблон фотоотчёта — в `docs/product/supply-and-delivery.md`. Тексты на 4 локалях.

Acceptance:

- заявку можно оформить с контактом key holder
- фотоотчёт уходит клиенту после сборки (процесс описан)
- обещание показано на странице доставки

### T-061 · Вывоз старого дивана как опция доставки

- status: draft
- priority: low
- area: catalog
- estimate: S
- depends: T-043 (тариф подрядчика)
- source: chat
- created: 2026-10-06
- idea: docs/ideas/2026-10-05-online-brand-additions.md

Платная опция при доставке: вынос и утилизация старого дивана. Цена от подрядчика, правила пунктов приёма в муниципалитетах Коста-Бланки. Опция в калькуляторе доставки (T-046) и в заказе.

Acceptance:

- цена и правила подтверждены подрядчиком
- опция видна в калькуляторе и в корзине

### T-062 · Предоплата 30–50 % для изделий под заказ

- status: blocked
- blocked: юридический контур и autónomo (T-048)
- priority: medium
- area: cms
- estimate: M
- source: chat
- created: 2026-10-06
- idea: docs/ideas/2026-10-05-online-brand-additions.md

Этап 1 по ADR-0010: заказ изделия под заказ подтверждается предоплатой переводом, остаток — при доставке. Статусы заказа, реквизиты в письме, напоминания. Формулировки и возвраты предоплаты — по итогам T-048.

Acceptance:

- заказ с предоплатой проходит от заявки до подтверждения
- условия предоплаты на странице условий продажи

### T-063 · Трекер производства в кабинете

- status: ready
- priority: medium
- area: cms
- estimate: M
- depends: T-047
- source: chat
- created: 2026-10-06
- idea: docs/ideas/2026-10-05-online-brand-additions.md

Статусы заказа как шаги «Как это делается»: заказ → каркас → обивка → фото контроля → доставка и сборка. Владелец двигает статус в админке и прикладывает фото контроля; клиент видит шаги и фото в кабинете, письмо на каждом шаге (после T-039).

Acceptance:

- клиент видит текущий шаг и фото контроля
- смена статуса в админке отражается в кабинете
- `docs/features/leads-and-account.md` обновлён

### T-064 · Страницы тканей как посадочные

- status: ready
- priority: medium
- area: seo
- estimate: M
- depends: T-045 (коллекция fabrics)
- source: chat
- created: 2026-10-06
- idea: docs/ideas/2026-10-05-online-brand-additions.md

Страница на тип ткани (Aquaclean, букле, бархат, лён, шенилл, кожа): свойства, уход в прибрежном климате (солнце, влажность, соль), модели в этой ткани, заказ образцов. Запросы из кластера F портфеля. Свои title и description, ссылки из карточек.

Acceptance:

- 6 страниц на 4 локалях в sitemap
- с каждой страницы можно заказать образцы
- внутренние ссылки из карточек товаров

### T-065 · Аутлет: возвраты и выставочные образцы

- status: draft
- priority: low
- area: catalog
- estimate: S
- source: chat
- created: 2026-10-06
- idea: docs/ideas/2026-10-05-online-brand-additions.md

Раздел для возвращённых и образцовых изделий со скидкой и честным описанием состояния; дубль объявлений на Wallapop. Возврат превращается в продажу, а не в убыток. Правило «precio anterior 30 días» для скидок — по T-048.

Acceptance:

- у изделия аутлета указано состояние и прежняя цена по правилам
- раздел исключён из основной сетки каталога

### T-066 · Партнёрская программа для дизайнеров и агентов

- status: draft
- priority: medium
- area: b2b
- estimate: M
- depends: T-021
- source: chat
- created: 2026-10-06
- idea: docs/ideas/2026-10-05-online-brand-additions.md

Код партнёра в заявке и заказе, скачиваемые чертежи и фото, комиссия, страница программы. Связь с проектами (T-057): дизайнер-партнёр подписан в проекте.

Acceptance:

- заявка с кодом партнёра видна в Bitrix24 с источником
- страница программы на 4 локалях

### T-068 · После первых продаж: отзывы с фото, сменные чехлы, конфигуратор по формам, рассрочка

- status: draft
- priority: low
- area: catalog
- estimate: L
- source: chat
- created: 2026-10-06
- idea: docs/ideas/2026-10-05-online-brand-additions.md

Набор, который владелец одобрил на этап «после первых продаж»: отзывы с фото после доставки без стимулов (ADR-0006), сменные чехлы и перетяжка, конфигуратор «по формам» без 3D (Burrow), виджет рассрочки на карточке (этап 3 ADR-0010). Дробить, когда появятся первые продажи.

Acceptance:

- разбито на задачи после первой продажи

### T-052 · Система тем в @workspace/ui: токены, палитры, светлая и тёмная, бренды

- status: ready
- priority: high
- area: ui
- source: chat
- created: 2026-10-05
- estimate: M
- idea: docs/ideas/2026-10-05-two-storefronts-design-fork.md

Владелец: «задел под темы», «в темах гармоничные палитры альтернативных дополнительных цветов», ЧБ-основа. Нужны четыре направления (Кино, Галерея, Чертёж, Неон), палитры, режимы и слой форм (строгие / скруглённые); витрина хранит свой набор (ADR-0011). Перенести механику прототипов в `packages/ui`: тема = набор токенов (нейтрали светлые и тёмные, шрифты, шкала размеров до 3440 px, отступы, радиусы, движение), палитра = акцентные токены (`--accent`, `--accent-soft`, `--on-accent`, партнёрский тон) с проверенным контрастом AA, бренд = `data-brand` (boutique / store). Атрибуты на `<html>` выставляются на сервере до первой отрисовки; Tailwind 4 читает токены через `@theme inline`. Композиты не знают про конкретную тему.

Acceptance:

- переключение темы, палитры и режима меняет сайт без правки компонентов
- контраст текста и акцента не ниже AA во всех палитрах и обоих режимах (скрипт проверки в репо)
- `docs/features/design-system.md` описывает, как добавить тему и палитру

### T-054 · Витрины на одном бэкенде: наборы тем по доменам, галочки витрин у товара

- status: ready
- priority: medium
- area: cms
- source: chat
- created: 2026-10-05
- estimate: L
- idea: docs/ideas/2026-10-05-two-storefronts-design-fork.md

ADR-0011 в простом исполнении: одно приложение, несколько доменов. Коллекция `storefronts` вместо одиночных глобалов `header` / `footer` / `site-settings`: домен, имя бренда, набор темы (направление, палитра, режим, формы — таблица в ADR), навигация, контакты, SEO-настройки. Хост → витрина в `proxy.ts`. У товара, проекта и статьи галочки «Показывать на» и **основная витрина**: страница индексируется только на основной, на остальных `rel=canonical` на неё и исключение из sitemap (владелец 2026-10-06: «поставил галочку для молодёжи и для общего магазина — товар появился и там и там»). Свои title и description на витрину (`plugin-seo` сейчас строит их от одного `SITE.name`); слаги уникальны в паре «витрина + слаг»; sitemap, robots, canonical, hreflang и OG по хосту. Дробить: a — коллекция и хост, b — галочки и каноникал, c — домены в Dokploy.

Acceptance:

- товар с двумя галочками открывается и покупается на обеих витринах, индексируется только на основной
- `divan.group` после изменений отдаёт те же URL и метаданные, что до них
- набор темы витрины задаётся в админке, без деплоя

### T-055 · Чертежи, «Пройдёт ли в дверь» и техническая карта модели

- status: ready
- priority: high
- area: catalog
- source: chat
- created: 2026-10-05
- estimate: M
- idea: docs/ideas/2026-10-05-online-brand-additions.md

Владелец просил чертежи. Без шоурума они — главный ответ на 58 % возвратов «не подошёл размер». Поля товара: габариты, высота и глубина сиденья, высота подлокотника, габарит самого крупного модуля или упаковки, допуск. Из полей строится SVG (вид спереди, сверху, профиль, размеры в см), PDF для скачивания, проверка двери и лифта (логика и тексты — по образцу `design/concepts/engine.js`, но на сервере или в клиентском островке без влияния на SEO). Техническая карта: каркас, подвес, плотность пены, наполнитель, ткань (состав, Martindale, уход). Дублировать размеры HTML-таблицей и в JSON-LD Product.

Acceptance:

- у товара с заполненными размерами есть чертёж, PDF и проверка двери и лифта на 4 локалях
- размеры есть в HTML и в JSON-LD
- `docs/features/catalog.md` обновлён

### T-056 · Единый стиль фото от разных фабрик: требования и обработка

- status: ready
- priority: medium
- area: content
- source: chat
- created: 2026-10-05
- estimate: M
- idea: docs/ideas/2026-10-05-online-brand-additions.md

Владелец: «обрабатывать все диваны в единый дизайн». Документ `docs/product/photo-spec.md` для фабрик (ракурсы, фон, свет, разрешение, цветовая карта, технический лист) и обработка: вырез фона, единый фон и тень, кадр и линия пола, правильный цвет ткани. Скрипт в репо на sharp там, где хватает (размеры, webp, проверка фона по краям, как в `design/concepts/tools/build-assets.mjs`), и внешний сервис для выреза с ценой за товар. AI-сцены и видео — только с пометкой «escena ilustrativa», товар не перерисовывается.

Acceptance:

- спецификация отправлена владельцем хотя бы одной фабрике
- скрипт приводит 5 тестовых фото к единому кадру и фону, результат в отчёте
- стоимость обработки одного товара посчитана

### T-057 · Проекты: интерьеры с диванами, вещи и цены

- status: ready
- priority: medium
- area: cms
- source: chat
- created: 2026-10-05
- estimate: M
- idea: docs/ideas/2026-10-05-online-brand-additions.md

Коллекция `projects`: заголовок и текст (локализованы), город, площадь, этаж и лифт, год, фотогалерея, вещи в комнате (ссылки на товары с ценой на момент проекта), итог, дизайнер-партнёр. Страницы `/{locale}/projects` и `/{locale}/projects/{slug}` через `ROUTES`, JSON-LD (ItemList вещей), sitemap. Вид — по образцу секции «Проекты» в прототипах.

Acceptance:

- проект создаётся в админке и виден на сайте на 4 локалях
- у вещей в проекте работают ссылки на карточки
- страницы в sitemap, у каждой свои title и description
- `docs/features/cms-pages.md` обновлён

### T-042 · Обзвон фабрик Yecla: MOQ, цена от PVP, marca blanca (владелец)

- status: ready
- priority: high
- area: product
- source: chat
- created: 2026-09-30
- estimate: M

Блокирует всю экономику: MOQ и готовность фабрик работать под нашим брендом публично не раскрывает ни один источник. Обзвонить 10–15 фабрик Yecla и Валенсии по скрипту из `docs/playbooks/supplier-call.md`, записать ответы в `docs/product/suppliers.md` (таблица: фабрика, контакт, marca blanca да/нет, MOQ, % от PVP, срок, отгрузка клиенту, лоскуты для образцов, гарантия, материалы для сайта). Отправная точка и вопросы — `docs/product/supply-and-delivery.md` §4.

Acceptance:

- не менее 8 заполненных строк с ценой от PVP и MOQ
- отмечены 2–3 фабрики-кандидата на старт и причина выбора
- цифры перенесены в `docs/strategy/business-model.md` §6 вместо оценок

### T-043 · Подрядчик последней мили: тариф при объёме (владелец)

- status: ready
- priority: high
- area: product
- source: chat
- created: 2026-09-30
- estimate: S

Без этой цифры нельзя ставить цену доставки на карточке (T-046). Запросить у 5–7 перевозчиков Аликанте и Торревьехи тариф при 50–100 доставках в месяц с подъёмом, сборкой и выносом упаковки, зоны и ответственность за повреждение. Ориентиры и список где искать — `docs/product/supply-and-delivery.md` §4–5.

Acceptance:

- таблица зон и цен в `docs/product/supply-and-delivery.md`
- выбран подрядчик или два, зафиксировано кто отвечает за битое при перевозке
- тариф подставлен в калькулятор доставки

### T-044 · Дизайн-проход: выбранное направление на живом сайте

- status: ready
- priority: high
- area: ui
- source: chat
- created: 2026-09-30
- estimate: L
- idea: docs/ideas/2026-10-05-two-storefronts-design-fork.md

Владелец 2026-10-06 утвердил три набора: divan.group — Галерея, Эспарто, авто, скруглённые; divan.boutique — Кино, Гранат, светлая, строгие; молодёжная витрина — Неон, Лайм, тёмная, скруглённые (таблица в ADR-0011). Прототипы — `design/concepts/` (кнопки «Набор» в панели). Далее: перенести токены и компоненты выбранного направления в `@workspace/ui` поверх системы тем (T-052) и пройти по страницам сайта: главная, каталог, карточка товара, проекты, статьи, кабинет. Каждое правило из «SEO-first» в `design/concepts/README.md` переходит в прод без исключений. Дробить на подзадачи по страницам.

Acceptance:

- страницы сайта используют токены и компоненты выбранного направления, без хардкода цветов
- `scripts/qa/shoot.mjs --audit` на 390, 1440, 2560: нет переполнения, ошибок консоли, скрытого текста без JS
- LCP на герое, CLS < 0.1 по полевым данным после релиза
- `docs/features/design-system.md` обновлён

### T-045 · Образцы тканей как продукт: коллекция, заказ, виджет в корзине

- status: ready
- priority: high
- area: cms
- source: chat
- created: 2026-09-30
- estimate: M

Лучшее отношение эффекта к цене во всём проекте: бесплатные образцы почтой — отраслевой стандарт Испании (Delsofa, Sofaralia, SofaNatur) и мировой (Swyft, Loaf, DFS), при этом в регионе их не даёт никто. Они же главный инструмент против 44% возвратов по причине «цвет и материал».

Коллекция `fabrics` (название, состав, цвет, тип, фото текстуры, надбавка к цене, AquaClean да/нет, доступность), связь с товарами, заявка на образцы (до 6 штук) с адресом и согласиями, виджет выбора в сайдбаре корзины и на карточке, письмо клиенту и уведомление владельцу, страница «образцы тканей» на 4 локалях.

Доставка коробки — курьером за 48–72 ч по Коста-Бланке (решение владельца 2026-10-05, «выслать курьера с демо-материалами»): в заявке способ доставки и окно, владельцу — список для курьера. Визит с образцами по записи — позже, если появится спрос. Идея: `docs/ideas/2026-10-05-online-brand-additions.md`.

Acceptance:

- клиент выбирает до 6 образцов и отправляет заявку без регистрации
- заявка попадает в Payload и в Bitrix24 как лид (ADR-0004), владельцу уходит письмо со списком и адресом
- «заказы образцов в неделю» считается как ведущая метрика (см. business-model §10)
- страница индексируется, тексты в словарях

### T-046 · Калькулятор доставки и сборки по городу на карточке

- status: ready
- priority: high
- area: catalog
- source: chat
- created: 2026-09-30
- estimate: M
- depends: T-043

Don Baraton даёт цифры только в разделе Delivery, остальные говорят «спросите нас». Показать на карточке: «Torrevieja: 39 €, 3–5 дней, montaje incluido». Global `delivery-zones` (зона, города и почтовые индексы, цена, срок, что входит), выбор города с запоминанием, расчёт для корзины, страница условий доставки на 4 локалях.

Acceptance:

- карточка показывает цену, срок и состав услуги для выбранного города
- города покрывают Торревьеху, Орихуэла-Косту, Гуардамар, Кесаду, Аликанте, Бенидорм, Кальпе
- цифры берутся из тарифа T-043, не выдуманы
- при неизвестном городе честное «рассчитаем по запросу», а не ноль

### T-047 · Кабинет без шоурума: цена клуба вместо кода за визит, заказы и возвраты

- status: ready
- priority: medium
- area: cms
- source: chat
- created: 2026-09-30
- estimate: M
- idea: docs/ideas/2026-10-05-online-brand-additions.md

ADR-0009 отменил визит в шоурум, поэтому `showroom-visits` и формулировки «покажите код в шоуруме» уходят. Владелец 2026-10-05: «скидки зарегистрированным» — значит регистрация остаётся с выгодой: **цена клуба** −5 % для вошедших клиентов, на карточке и в корзине рядом с обычной ценой. Подавать как цену участника, не как распродажу (как это соотносится с правилом 30 дней для объявленных скидок — проверить в T-048). Персональный `discountCode` либо убрать, либо оставить как промокод без привязки к визиту. Добавить историю заказов и заявок на образцы, адреса доставки, заявку на возврат. Тексты про шоурум убрать из словарей `account`, `home`, `product`, `blog`, из `home-fallback` и из SEO-описаний (живой сайт пишет «Exposición física»).

Acceptance:

- ни одного упоминания шоурума в UI, словарях и мета-описаниях
- вошедший клиент видит цену клуба в карточке и корзине; JSON-LD цены участника — по образцу из `design/concepts/store.html`
- в кабинете видны заказы, заявки на образцы и кнопка заявки на возврат
- существующие клиенты не теряются при миграции
- обновлён `docs/features/leads-and-account.md`

### T-048 · Юридический контур продажи на расстоянии (владелец + агент)

- status: ready
- priority: high
- area: legal
- source: chat
- created: 2026-09-30
- estimate: M

Блокирует этап 2 из ADR-0010. Владелец в Испании и открывает autónomo, нужно заявить вид деятельности. Собрать: какой epígrafe IAE и CNAE под онлайн-торговлю мебелью, условия продажи под venta a distancia (14 дней desistimiento, гарантия 3 года, LSSI ст. 27–28), политика возвратов с учётом того что возврат крупной мебели платный для клиента где это законно, ПО фактурации с Verifactu и API, порядок с Bizum и отчётностью в AEAT (Orden HAC/747/2025).

Acceptance:

- чеклист «что нужно до включения оплаты» в `docs/marketing/launch-checklist.md`
- юрстраницы на 4 локалях: условия продажи, возвраты, доставка, приватность, cookies
- выбрано ПО фактурации, записано в ADR
- владелец знает, какой вид деятельности заявить

### T-049 · Анализ plugin-ecommerce: как свести с нашими products и локализацией

- status: ready
- priority: medium
- area: cms
- source: chat
- created: 2026-09-30
- estimate: M

Официальный `@payloadcms/plugin-ecommerce` в бете даёт товары с вариантами, корзины, заказы, транзакции, адреса и адаптер Stripe, но не доставку, налоги и фронтенд. У нас уже есть своя коллекция `products` с локализацией, SEO-табом, слагами и статической генерацией. Разобрать, что конфликтует: варианты против наших полей, валюты, локализация коллекций плагина, миграции в проде без push.

Acceptance:

- документ с выбором: берём плагин целиком, берём частично, или пишем заказы сами
- перечислены риски беты и как фиксируем версию
- решение оформлено ADR
- оценка трудоёмкости чекаута по выбранному пути

### T-050 · Комплекты обстановки с ценами против Jewell и MCB

- status: draft
- priority: medium
- area: catalog
- source: chat
- created: 2026-09-30
- estimate: L

Самая большая дыра на рынке: у Jewell десять языков включая русский и украинский и ни одной цены; Furniture Packs Spain и MCB прячут цену за формой. Комплект даёт чек 2 800–15 800 € против ~1 400 € за диван и несёт CAC, который диван не несёт. Сделать комплекты как сущность: состав товар за товаром со ссылками на карточки, итоговая цена, срок, что входит в монтаж, варианты «1/2/3 спальни» и «под сдачу».

Questions:

- собираем комплекты из своего каталога или это отдельная сущность с фиксированным составом
- нужен ли B2B-вход для landlord'ов и апартамент-менеджеров сразу или после первых продаж

### T-051 · Web-native AR на флагманских моделях

- status: draft
- priority: low
- area: ui
- source: chat
- created: 2026-09-30
- estimate: M

`<model-viewer>` от Google бесплатен и даёт AR прямо из мобильного браузера с автогенерацией USDZ для iOS; у Interior Define web-native AR дал в 33 раза больше использования, чем приложение, и в 8 раз лучшую конверсию. Расход — только 3D-модели (~150–500 € за модель). Делать после T-044 и только на 1–2 флагманах, с QR-переходом desktop→mobile.

Questions:

- есть ли у выбранных фабрик готовые 3D-модели, или заказывать фрилансеру

### T-034 · Расписание публикаций в CMS: поле даты, статус, автопубликация

- status: ready
- priority: high
- area: cms
- source: chat
- created: 2026-09-26
- estimate: M

Статьям и страницам нужен управляемый календарь публикаций. В `articles` уже есть `publishedAt` и черновики; надо довести до расписания: поле `scheduledAt` (дата и время), значение `scheduled` в статусе, задача Payload (`jobs`), которая раз в 15 минут публикует всё, у чего `scheduledAt` в прошлом, и ревалидирует путь. Крон дёргает эндпоинт `/api/payload-jobs/run` с `CRON_SECRET`. В админке колонка со датой публикации в списке.

Acceptance:

- статья со `scheduledAt` в будущем не видна на сайте, после наступления времени публикуется без вмешательства
- запуск задачи логируется, ошибка уходит в Telegram
- строка в `docs/ops/crons.md`, запись в `docs/features/cms-pages.md`

### T-035 · Контент-план на 12 недель и очередь тем

- status: ready
- priority: high
- area: content
- source: chat
- created: 2026-09-26
- estimate: S

`docs/content/content-plan.md`: таблица 12 недель (дата, кластер из query-portfolio, тема, целевой запрос, тип «статья / страница / товар», связанные посты в соцсети, статус). Первые темы из кластера F: как выбрать диван, размеры, механизмы, ткани для животных, диван для аренды. Плюс `docs/content/editorial-policy.md`: кто автор, откуда фото, правило «сначала ответ, потом подробности», требования E-E-A-T, чеклист перед публикацией.

Acceptance:

- 12 недель заполнены темами с целевыми запросами и целевыми URL
- редполитика описывает проверку фактов и обязательные элементы статьи
- ссылки из `docs/features/marketing-ops.md`

### T-036 · Скилл /content-brief: бриф и черновик статьи в CMS

- status: ready
- priority: high
- area: dx
- source: chat
- created: 2026-09-26
- estimate: M
- idea: docs/ideas/2026-09-21-design-direction.md

Скилл берёт следующую тему из контент-плана, собирает бриф (интент, структура выдачи, вопросы людей, внутренние ссылки на категории, источники) в `content/briefs/<slug>.md`, пишет черновик статьи на испанском и создаёт запись в `articles` со статусом draft и `scheduledAt` на следующую свободную дату плана. Публикует человек. Крон по средам, слой claude, в рамках лимита ADR-0008.

Acceptance:

- прогон создаёт бриф и черновик в CMS, ничего не публикуя
- черновик содержит FAQ-блок и ссылки на две категории
- строка в `docs/ops/crons.md`, запись в реестре скиллов

### T-037 · Картинка к статье: генерация обложки из заголовка

- status: draft
- priority: medium
- area: ui
- source: chat
- created: 2026-09-26
- estimate: M

Сейчас OG-картинка генерируется на лету, а обложки статьи в списке блога нет: если редактор не загрузил фото, карточка показывает букву. Нужен вариант: либо генерировать обложку тем же механизмом и сохранять в Media при публикации, либо оставить плейсхолдер и требовать фото. Решить через `/idea`, потому что это влияет на визуал блога.

Questions:

- генерировать обложки автоматически или всегда требовать реальное фото от редактора

### T-038 · Скилл /social-pack: посты для соцсетей из контента сайта

- status: draft
- priority: medium
- area: content
- source: chat
- created: 2026-09-26
- estimate: M

По пятницам готовит пакет на следующую неделю: три поста (карусель, сценарий короткого видео, полезный пост) на четырёх языках плюс пост в Google Business Profile, всё привязано к вышедшей статье, новому товару или отзыву. Складывает в `content/social/YYYY-Www.md` с готовыми подписями, хэштегами и призывом писать в WhatsApp. Публикация руками через Meta Business Suite, пока нет токенов.

Questions:

- есть ли аккаунты Instagram и Facebook и кто будет публиковать
- готов ли владелец снимать фото и короткие видео в шоуруме раз в неделю

### T-039 · Письма: почтовый адаптер и шаблоны личного кабинета

- status: ready
- priority: high
- area: infra
- source: chat
- created: 2026-09-26
- estimate: M

Без адаптера Payload пишет письма в лог, поэтому клиент не получает код скидки. Подключить Resend (или SMTP Brevo) через переменные окружения, настроить SPF, DKIM и DMARC на домене `divan.group`, сделать шаблоны на четырёх языках: код скидки после регистрации, подтверждение записи в шоурум, подтверждение заявки менеджеру. Отправка через хуки коллекций, ошибки не ломают регистрацию.

Acceptance:

- регистрация в личном кабинете приводит к письму с кодом
- mail-tester показывает не ниже 9 из 10
- ключи только в переменных окружения панели, в репозитории их нет

### T-040 · Личный кабинет: подтверждение email и восстановление пароля

- status: ready
- priority: medium
- area: cms
- source: chat
- created: 2026-09-26
- estimate: M

Включить `verify` у коллекции `customers`, добавить страницы подтверждения адреса и сброса пароля на четырёх языках, тексты в словари. Требует T-039, иначе письма никуда не уйдут.

Acceptance:

- новый клиент получает письмо подтверждения и активирует аккаунт
- сброс пароля работает по ссылке из письма
- страницы закрыты от индексации

### T-041 · Оплата: анализ вариантов для Испании (без реализации)

- status: draft
- priority: low
- area: cms
- source: chat
- created: 2026-09-26
- estimate: S

Разобрать варианты на будущее: плагин Stripe для Payload, рассрочка SeQura и Aplazame, Bizum и Redsys; что требуется юридически (условия продажи, подтверждение заказа, возвраты, Verifactu с 2027), какой объём работы даёт корзина и заказы. Результат: раздел в `docs/marketing/launch-checklist.md` и ADR с рекомендацией. Запускать после подтверждения гипотезы продаж (ADR-0007).

### T-032 · Визуальный аудит конкурентов и мудборд

- status: ready
- priority: medium
- area: ui
- source: chat
- idea: docs/ideas/2026-09-21-design-direction.md
- created: 2026-09-21
- estimate: M

Открыть через WebFetch 6–8 сайтов из `research/seo/competitors.md` (sofasalicante.com, donbaraton.es, mueblesjbrinas.com, famaliving.com/alicante, natuzzi, kave home, article.com или castlery как DTC-эталон) и для каждого зафиксировать: сетка и ширина, плотность информации на главной и карточке, типы фото, свотчи тканей, блоки доставки/гарантии/FAQ/отзывов, CTA, что выглядит дёшево, что премиально. Свести в `research/design/2026-09-competitor-visual-audit.md`: таблица «есть / нет» по 12 признакам, 5 вещей копировать, 5 вещей избегать, и как это ложится на решение из идеи (A + B + C).

Acceptance:

- файл аудита с таблицей по ≥6 конкурентам и выводами
- обновлён раздел «Договорённости» в `docs/features/design-system.md` принципами 1–3 из идеи
- при необходимости 1–3 draft-задачи на конкретные блоки (например, страница тканей, блок «доставка в ваш город» на карточке)

### T-033 · Тест с 5 пользователями после фотосессии hero-моделей

- status: draft
- priority: medium
- area: ui
- source: chat
- idea: docs/ideas/2026-09-21-design-direction.md
- created: 2026-09-21
- estimate: S

Когда есть фото 2–3 hero-моделей и они загружены в CMS: протокол из `docs/playbooks/usability-test.md` (T-019), 3 сценария (найти диван-кровать до 1500 €, узнать доставку в Торревьеху, записаться в шоурум), 3 испаноязычных + 2 экспата, 20 минут каждый. Находки → задачи.

Questions:

- когда будут фото hero-моделей (задача владельца, см. launch-checklist §3)

### T-027 · Проект «Divan Shop» в Bitrix24 и первичный push задач (владелец + агент)

- status: draft
- priority: high
- area: dx
- source: chat
- created: 2026-09-21
- estimate: S

Владелец создаёт группу/проект в портале и кладёт `B24_WEBHOOK_URL`, `B24_TASKS_GROUP_ID`, `B24_RESPONSIBLE_ID` в `.env.automation`; агент выполняет `--push` и проверяет `--status`. В чате задачи можно открывать/закрывать через MCP b24-portal.

Questions:

- какой портал: april-dev? ID группы; кто ответственный по умолчанию

### T-028 · Email-адаптер (Resend) для писем ЛК и лидов + SPF/DKIM

- status: draft
- priority: medium
- area: infra
- source: chat
- created: 2026-09-21
- estimate: S

`@payloadcms/email-resend` (или nodemailer) через env; письма: код скидки после регистрации, подтверждение записи в шоурум, авто-ответ лиду. Ждёт домен.

### T-029 · Веб-версия базы знаний

- status: draft
- priority: low
- area: dx
- source: chat
- created: 2026-09-21
- estimate: M

По рекомендации из `docs/ops/project-management.md` (статический экспорт `docs/` в приватный раздел или коллекция в Payload). Решить после накопления 20+ документов.

### T-030 · GA4-события для ЛК и CTA (sign_up, showroom_visit_request, contact_manager_click)

- status: ready
- priority: medium
- area: seo
- source: chat
- created: 2026-09-21
- estimate: S

Расширить спецификацию событий из T-006 событиями ЛК; dataLayer.push в формах регистрации и записи.

Acceptance:

- `docs/analytics-events.md` дополнен; события уходят в dataLayer

### T-004 · Дефолтная локаль es (ADR-0001)

- status: ready
- priority: high
- area: seo
- source: chat
- created: 2026-09-21
- estimate: S

`DEFAULT_LOCALE = "es"`, порядок `LOCALES = ["es", "en", "ru", "uk"]`, x-default → es. Проверить `proxy.ts`, `alternates`, sitemap, Payload `localization.defaultLocale`, словари не трогать. Обновить CLAUDE.md и README (упоминания «ru (default)»).

Acceptance:

- `curl -I /` редиректит на `/es`; hreflang x-default указывает на `/es/...`
- `pnpm web generate`, typecheck, lint зелёные
- ADR-0001 остаётся accepted, в README decisions проставлена дата выполнения

### T-005 · Коллекция leads: согласия, UTM, антиспам, авто-подтверждение (ADR-0004)

- status: ready
- priority: high
- area: cms
- source: seo-research
- created: 2026-09-21
- estimate: L

Разбить на: T-005a `formSubmissionOverrides` → коллекция `leads` с полями locale, channel, utm_*, gclid, product_slug, page_url, source_code, consentAt, consentText, consentEmail, consentWhatsApp, ip, ga_client_id, b24LeadId, syncStatus, syncError; hidden-поля на фронте из cookie первого визита. T-005b Cloudflare Turnstile + honeypot + rate limit по IP в форме и route. T-005c авто-подтверждение на языке лида через Resend/Brevo (шаблоны из `docs/marketing/leads-and-crm.md`) и Telegram-уведомление без ПД. T-005d хук `afterChange` → Bitrix24 `crm.item.add` с `originatorId='payload'` + `scripts/lead-sync-retry.mjs` (B24 webhook URL из `.env.automation`, работает только если задан).

Acceptance:

- отправка формы создаёт запись `leads` со всеми полями и согласиями; спам-запрос отклоняется
- письмо-подтверждение уходит ≤60 с на языке лида; в Telegram только id/имя/источник
- при заданном `B24_WEBHOOK_URL` лид появляется в B24, при ошибке `syncStatus=pending` и ретрай

### T-006 · Кнопка WhatsApp с кодом источника + события GA4

- status: ready
- priority: high
- area: ui
- source: seo-research
- created: 2026-09-21
- estimate: M

Компонент `WhatsAppButton` (features/whatsapp-contact): `wa.me/{phone}?text=` локализованная фраза + `[{locale}-{page}-{productSlug}]`; телефон из Site Settings. `dataLayer.push` для `click_whatsapp`, `click_phone`, `click_directions`, `showroom_visit_request`, `view_item` (спецификация `docs/analytics-events.md` создаётся в этой задаче). Кнопка на всех страницах (плавающая) и в карточке товара.

Acceptance:

- `docs/analytics-events.md` с таблицей событий и параметров
- события уходят в `window.dataLayer`, GTM-контейнер не встраивается (человек ставит через `NEXT_PUBLIC_GTM_ID`, опционально)
- тексты в словарях на 4 локалях

### T-007 · Страница шоурума + JSON-LD FurnitureStore + areaServed

- status: ready
- priority: high
- area: seo
- source: seo-research
- created: 2026-09-21
- estimate: M

Site Settings расширить: адрес (street, postalCode, city), geo (lat/lng), openingHours, mapsUrl, sameAs[]. Страница `/{locale}/showroom` (slug по локали из ROUTES: es `tienda-de-sofas-alicante`, en `sofa-shop-alicante`, ru `showroom-alikante`, uk `showroom-alikante`) с картой (ссылка/iframe без cookie до согласия), часами, фото, FAQ-блоком, CTA WhatsApp/маршрут. JSON-LD `FurnitureStore` с `@id`, areaServed (список городов из `docs/marketing/local-seo.md`), hasMap, sameAs; на товарах `Offer.availableAtOrFrom` → `@id`.

Acceptance:

- Rich Results Test валиден для FurnitureStore и Product
- одна `@id` на всех локалях, hreflang на страницу
- ссылка на шоурум в header/footer

### T-008 · Категории кластера B и поля товара для фильтров и Merchant

- status: ready
- priority: high
- area: cms
- source: seo-research
- created: 2026-09-21
- estimate: M

Products: добавить `plazas` (число мест), `sku`, `condition` (new/outlet), `brand`, `gtin` (опц.), `leadTimeDays`, `fabrics[]` (свотчи: название, image, aquaclean bool), `dimensionsImage`. Categories: поле `synonyms` (localized текст для описания: cheslong/cheslón/chaiselongue) и `metaTemplate`. Seed категорий из `docs/marketing/query-portfolio.md` (chaise-longue, rinconeras, sofa-cama, sofas-relax, modulares, sofas-piel, sofas-3-plazas, sofas-2-plazas, sillones-relax) с локализованными title/description и slug по локали? Нет: slug общий (ADR: slugs не локализуются), заголовки локализованы.

Acceptance:

- `pnpm web seed:categories` создаёт 9 категорий на 4 локалях
- карточка товара показывает размеры, места, ткани, срок поставки
- JSON-LD Product содержит sku, brand, itemCondition, offers.availability

### T-009 · Фид товаров для Merchant Center и Meta Commerce

- status: ready
- priority: high
- area: seo
- source: seo-research
- created: 2026-09-21
- estimate: M

Route `/api/feeds/products.xml?locale=es&profile=google` и `.csv?profile=meta` из Products: id, title, description, link (ROUTES.product), image_link + additional_image_link, price с IVA «EUR», availability, condition, brand, identifier_exists=false при отсутствии gtin, product_type (категория), custom_label_0 = hero. Кэш 1 ч, ревалидация хуком.

Acceptance:

- фид валиден по спецификации Merchant (проверить XML-схему RSS 2.0 + g:), пример в docs
- 4 локали × 2 профиля
- документ `docs/marketing/google-stack.md` дополнен URL фида

### T-010 · Нейминг-спринт: генерация кандидатов и скрипт проверки

- status: ready
- priority: high
- area: content
- source: seo-research
- created: 2026-09-21
- estimate: M

Скилл `.claude/skills/naming/SKILL.md` по `docs/marketing/launch-checklist.md` §1 и скрипт `scripts/check-name.mjs` (RDAP .es/.com/.eu, HTTP-проверка хендлов instagram/tiktok/youtube/facebook, ссылки для ручной проверки OEPM/EUIPO/TMview кл. 20/35, попытка TMview API). Прогнать: 50 кандидатов по 4 стратегиям → матрица → шортлист 5 в `research/naming/candidates.md` с обоснованием произносимости на es/en/ru/uk.

Acceptance:

- `node scripts/check-name.mjs <name>` печатает таблицу доступности
- `research/naming/candidates.md` с 50 кандидатами, оценками и шортлистом 5
- Telegram-сводка владельцу для опроса

### T-011 · Коллекция Locations и городские страницы (ADR-0002)

- status: ready
- priority: high
- area: seo
- source: seo-research
- created: 2026-09-21
- estimate: L

Разбить: T-011a коллекция `locations` (city, slugs по локали через поле slug localized? нет — 4 поля slugEs/slugEn/slugRu/slugUk, deliveryDays, deliveryPrice, assemblyIncluded, distanceKm, faq[], gallery[], featuredProducts[], reviews[] позже), `ROUTES.location`, страница, sitemap, hreflang, JSON-LD (FurnitureStore areaServed + BreadcrumbList). T-011b seed 6 городов с плейсхолдерами данных доставки и пометкой «не публиковать без уникального контента» (draft).

Acceptance:

- `/es/sofas-en-torrevieja`, `/en/sofas-torrevieja`, `/ru/divany-torrevieha`, `/uk/dyvany-torrevieha` рендерятся из одной записи
- блоки «тип + город» ссылаются на категории
- страницы в статусе draft не попадают в sitemap

### T-012 · Скрипт сбора метрик collect-all + targets.json

- status: ready
- priority: high
- area: infra
- source: seo-research
- created: 2026-09-21
- estimate: L

Разбить: T-012a `config/metrics/targets.json` из `docs/marketing/query-portfolio.md` (ядро запросов) + `scripts/metrics/collect-all.mjs` оркестратор с `_manifest.json` и graceful skip источников без ключей. T-012b `gsc-snapshot.mjs` (день T-3, 3 среза, пагинация). T-012c `ga4-snapshot.mjs`. T-012d `cwv-snapshot.mjs` (CrUX + PSI fallback). T-012e `clarity-snapshot.mjs`, `index-check.mjs`. Все через `googleapis`, service account из `.env.automation`, read-only scopes. Регистрация в `install-schedule.ps1` (06:00) и строка в `docs/ops/crons.md`.

Acceptance:

- без ключей скрипт завершается с понятным сообщением и exit 0, с ключами пишет JSON в `data/metrics/<source>/daily/`
- `_manifest.json` обновляется; `metrics-healthcheck` в том же скрипте шлёт Telegram при пропуске >2 дней

### T-013 · Скилл /weekly-growth-review

- status: ready
- priority: high
- area: dx
- source: seo-research
- created: 2026-09-21
- estimate: M

`.claude/skills/weekly-growth-review/SKILL.md` по `docs/ops/crons.md`: читает `data/metrics/*`, `targets.json`, `research/feedback/`, `tasks/reports/`; пишет `reports/weekly/YYYY-Www.md`, обновляет `docs/kpi/dashboard.md`, кладёт 3–5 draft-задач с ICE (добавить поле `ice:` в формат задачи в tasks/README.md), Telegram-свод. Регистрация пн 07:30.

Acceptance:

- прогон на пустых данных даёт корректный отчёт «данных нет, что подключить»
- формат задачи в README расширен полем ICE

### T-014 · Юридические страницы и CMP-интеграция

- status: ready
- priority: high
- area: cms
- source: seo-research
- created: 2026-09-21
- estimate: L

Разбить: T-014a страницы Aviso legal, Política de privacidad, Política de cookies, Envíos/devoluciones/garantía, Condiciones (этап 1 — лидген) как CMS-страницы seed на 4 локалях с плейсхолдерами реквизитов из Site Settings (razón social, NIF, Registro Mercantil — добавить поля) и оговоркой «prevalece la versión en español»; ссылки в футере. T-014b CMP: слот для сертифицированного CMP через `NEXT_PUBLIC_CMP_*` (Cookiebot/CookieYes), Consent Mode v2 default denied, GA4/Clarity/Pixel только после согласия; ссылка «Cookies» в футере. T-014c «IVA incluido» рядом с ценой, `price_history` коллекция + хук + `scripts/price-anterior-guard.mjs`.

Acceptance:

- 5 юр-страниц на 4 локалях доступны из футера
- до согласия ни один аналитический тег не грузится (проверка в headless)
- зачёркнутая цена показывается только при `oldPrice ≥ min(price за 30 дней)`

### T-015 · Скилл /daily-ops и шаблоны ответов

- status: draft
- priority: medium
- area: dx
- source: seo-research
- created: 2026-09-21
- estimate: M

Черновики ответов на новые лиды/отзывы на языке автора, пост GBP по расписанию, дайджест SLA. Ждёт T-005 и решения по Bitrix24 (Free vs Basic, REST).

Questions:

- есть ли партнёрский NFR-портал Bitrix24; работает ли REST на Free (проверить на тестовом портале bitrix24.eu)

### T-016 · Контент-операции: content-plan, editorial-policy, бриф, скилл /content-brief

- status: ready
- priority: medium
- area: content
- source: seo-research
- created: 2026-09-21
- estimate: M

`docs/content/content-plan.md` (очередь тем кластера F из query-portfolio, 12 недель), `docs/content/editorial-policy.md` (E-E-A-T: автор-владелец, свои фото, «как мы проверяем», answer-first абзацы, llms.txt), `content/briefs/_template.md`, скилл `.claude/skills/content-brief/SKILL.md` (бриф → черновик CMS-страницы draft в блоке content + faq). Коллекция `posts`/раздел `/{locale}/blog` — если нужен отдельный тип, добавить `articles` с полями author, publishedAt, category, hero image, layout; иначе использовать pages с тегом blog. Решение зафиксировать ADR-0009.

Acceptance:

- первая статья «cómo elegir sofá» создана как draft на es
- `/es/blog` список и `/es/blog/{slug}` рендерятся, sitemap включает
- `public/llms.txt` сгенерирован

### T-017 · IndexNow-хук и Bing/Yandex

- status: ready
- priority: low
- area: seo
- source: seo-research
- created: 2026-09-21
- estimate: S

Хук afterChange для products/pages/locations: пинг IndexNow (ключ из env) при публикации; файл ключа в public. Документация подключения Bing Webmaster и Yandex Webmaster в google-stack.md.

Acceptance:

- публикация товара шлёт IndexNow при заданном `INDEXNOW_KEY`, молча пропускает без ключа

### T-018 · Инфраструктура: хостинг ADR, бэкапы, аптайм, антиспам-домен

- status: draft
- priority: high
- area: infra
- source: seo-research
- created: 2026-09-21
- estimate: M

ADR-0010 хостинг (Vercel+Neon/S3 vs VPS+Docker), скрипт ночного `pg_dump` + синк `public/media` в B2/S3, UptimeRobot, 2FA на /admin, renovate. Нужны решения владельца.

Questions:

- где хостим; есть ли S3/B2; домен

### T-019 · Feedback-хранилище и плейбуки

- status: ready
- priority: medium
- area: content
- source: seo-research
- created: 2026-09-21
- estimate: S

`research/feedback/README.md` с форматом записи (дата, источник, язык, сегмент, модель, тема, цитата), `docs/playbooks/weekly-growth-review.md` (повестка 45 мин), `usability-test.md` (5 человек, 3 сценария), `jtbd-interview.md` (switch-интервью), `review-reply.md` (шаблоны ответов на отзывы es/en/ru/uk), `docs/experiments/log.md`.

Acceptance:

- файлы существуют, ссылки из operating-model.md работают

### T-020 · Скилл /social-pack и Pinterest-публикатор

- status: draft
- priority: medium
- area: content
- source: seo-research
- created: 2026-09-21
- estimate: M

Ждёт фото/бренд. `scripts/pinterest-publish.mjs` через Pinterest API, `content/social/` формат, скилл. Включается в фазе 1.

### T-021 · Партнёрская страница и коллекция partners

- status: draft
- priority: medium
- area: cms
- source: seo-research
- created: 2026-09-21
- estimate: M

`/en/partners-real-estate` + es, коллекция `partners` (тип, контакт, промокод, статус), поле `referrer` в leads. Ждёт решения о комиссии (5–8% или купон) и юр. оформления.

### T-001 · Заполнить competitors.md и targets.md (владелец)

- status: draft
- priority: high
- area: seo
- source: chat
- created: 2026-09-21
- estimate: S

Конкуренты предзаполнены из ресёрча; владелец уточняет рынок, сегмент, hero-модели и цели в `docs/strategy/targets.md`.

Acceptance:

- секции Market в competitors.md и таблица hero-моделей в targets.md заполнены
- статус переведён в done вручную

## In progress

## Done

### T-031 · Дизайн-проход: бренд-шапка и подвал, hero, карточки, страница товара, блог, ЛК

- status: done
- priority: high
- area: ui
- source: chat
- created: 2026-09-21
- estimate: M
- done: 2026-09-21
- commit: 25dfe8b

Направление «linen, clay, olive, sea»: палитра на токенах, Playfair 500 с курсивным акцентом в заголовках, CSS-логотип-арка, hero-полоса с трастовыми фактами, карточки с подъёмом и тенью, билет-карточка кода скидки в ЛК, FAQ-аккордеон, CTA-баннер с градиентом; reduced-motion и focus-visible глобально. Подробности в docs/features/design-system.md.

Acceptance:

- typecheck/lint/format зелёные; dev smoke /ru, /ru/catalog, /ru/blog, /ru/about, /ru/contacts, /ru/account/register → 200
- никаких hex-цветов в приложении, все строки в словарях на 4 локалях

### T-002 · Страница «Контакты» с формой заявки

- status: done
- priority: high
- area: cms
- source: chat
- created: 2026-09-21
- estimate: M
- done: 2026-09-21
- commit: 1a02a01

CMS-страница `contacts` из блоков: hero (low impact) с адресом и телефоном из Site Settings, блок `formBlock` с формой «Заявка» (имя, телефон, WhatsApp-согласие, сообщение). Кнопка «Узнать цену и сроки» на товаре ведёт на `/{locale}/contacts#form`, `tel:` остаётся как второй CTA.

Acceptance:

- есть скрипт `pnpm web seed:contacts`, создающий форму и страницу на 4 локалях, либо инструкция в docs
- `ROUTES.contacts(locale)` добавлен и используется в product-page и header
- тексты формы во всех 4 локалях в словарях
- `pnpm typecheck && pnpm lint` зелёные

### T-003 · FAQ-блок для страниц (SEO: FAQPage schema)

- status: done
- priority: high
- area: seo
- source: chat
- created: 2026-09-21
- estimate: M
- done: 2026-09-21
- commit: 1a02a01

Блок `faq` (массив вопрос/ответ, localized) в конструкторе страниц и компонент с `<details>` и JSON-LD `FAQPage`. GBP Q&A закрыт, Ask Maps читает сайт, поэтому FAQ на сайте — замена.

Acceptance:

- `payload/blocks/faq.ts` + `widgets/page-blocks/ui/faq-block.tsx`, зарегистрирован в `render-blocks.tsx` и в `pages` layout
- JSON-LD FAQPage валиден
- `pnpm web generate` выполнен

### T-022 · Обёртка над shadcn: composites в @workspace/ui и рефакторинг приложения

- status: done
- priority: high
- area: ui
- source: chat
- created: 2026-09-21
- estimate: M
- done: 2026-09-21
- commit: 1a02a01

Слой `packages/ui/src/composites` (Card, CardGrid, Section, PageHeader, Stack, Grid, FormField, FormMessage, EmptyState, KeyValueList, Stat) с простым внутренним синтаксисом поверх shadcn-примитивов; приложение использует composites, а не деревья CardHeader/CardTitle/… Пакет A.

Acceptance:

- экспорт `@workspace/ui/composites/*`, README с правилом «composites first»
- product-card, product-specs, catalog header, not-found, home-fallback, cms-form fields переведены на composites
- typecheck/lint/format зелёные

### T-023 · Статьи (blog), FAQ-блок, страницы home/about/contacts, seed, CTA «связаться с менеджером»

- status: done
- priority: high
- area: cms
- source: chat
- created: 2026-09-21
- estimate: L
- done: 2026-09-21
- commit: 1a02a01

Коллекция `articles` + `/{locale}/blog`, FAQ-блок с FAQPage JSON-LD (закрывает T-003), CMS-страницы home/about/contacts и форма «contact-manager» через `pnpm web seed` (закрывает T-002), CTA на товаре ведёт на контакты. Пакет B.

Acceptance:

- `pnpm web seed` идемпотентно создаёт настройки, навигацию, 9 категорий, 3 страницы, форму, 2 статьи на 4 локалях
- `/es/blog`, `/es/blog/{slug}`, `/es/about`, `/es/contacts` отвечают 200; sitemap включает статьи
- FAQ-блок валиден в Rich Results Test

### T-024 · Личный кабинет: регистрация, код скидки, запись в шоурум (ADR-0007)

- status: done
- priority: high
- area: cms
- source: chat
- created: 2026-09-21
- estimate: L
- done: 2026-09-21
- commit: 1a02a01

Auth-коллекция `customers` с персональным кодом `SHOW-XXXX`, коллекция `showroom-visits`, server actions регистрации/входа/выхода, страницы `/account`, `/account/login`, `/account/register`, форма записи на визит. Пакет C.

Acceptance:

- регистрация создаёт клиента с кодом и согласием, вход ставит httpOnly cookie
- клиент видит свой код, процент и список визитов; может запросить визит
- доступы: клиент читает только своё, админ всё; страницы noindex

### T-025 · Подсистема управления проектом через документацию

- status: done
- priority: high
- area: dx
- source: chat
- created: 2026-09-21
- estimate: L
- done: 2026-09-21
- commit: 1a02a01

`docs/ops/project-management.md`, реестр фич `docs/features/*` (Implemented/Planned по коду), `docs/HISTORY.md`, `docs/ideas/`, скиллы `/idea`, `/docs-sync`, `/project-checkin`, доработка `/task-run` и `/task-add`, зеркало задач в Bitrix24 `scripts/pm/b24-tasks-sync.mjs` (только через env), правила в CLAUDE.md. Пакет D.

Acceptance:

- реестр фич совпадает с кодом на дату проверки
- `node scripts/pm/b24-tasks-sync.mjs --status` без env завершается с exit 0
- CLAUDE.md содержит правила «всегда актуализировать доку и задачи», «идеи из чата → /idea»

### T-026 · Интеграция пакетов A–D: слияние, header-ссылки (blog, contacts, ЛК), CTA «код на скидку» на товаре, smoke-тест

- status: done
- priority: high
- area: dx
- source: chat
- created: 2026-09-21
- estimate: M
- done: 2026-09-21
- commit: 1a02a01

После слияния веток: регенерировать payload-types и importMap, добавить в header ссылки blog/contacts/account (AccountLink из features/auth), на странице товара второй CTA «Посмотреть в шоуруме и получить код» → ROUTES.account, прогнать seed на dev-базе, curl всех новых страниц, обновить docs/features через /docs-sync.

Acceptance:

- typecheck/lint/format зелёные; dev smoke: /es, /es/catalog, /es/blog, /es/about, /es/contacts, /es/account/login → 200
- T-002, T-003, T-022–T-025 переведены в Done с коммитами
