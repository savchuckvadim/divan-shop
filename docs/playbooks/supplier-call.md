# Плейбук: разговор с фабрикой и с подрядчиком доставки

Для задач T-042 и T-043. Цель — получить цифры, которых нет в интернете: MOQ, цену от PVP, тариф последней мили при объёме. Контекст: [supply-and-delivery.md](../product/supply-and-delivery.md).

## Как представляться

Коротко и честно, без преувеличения объёмов. Преувеличение вскроется на первом заказе и испортит условия.

> «Buenos días. Estamos lanzando una tienda online de sofás y mobiliario para la Costa Blanca, con entrega e instalación en Alicante y Torrevieja. Trabajamos en cuatro idiomas: español, inglés, ruso y ucraniano. Buscamos fabricante para producción bajo pedido. ¿Con quién puedo hablar de condiciones para tiendas online?»

Если спросят про объёмы: «Empezamos poco a poco, los primeros meses son de prueba. Por eso preguntamos por el mínimo, para planificar de forma realista.»

## Фабрике: восемь вопросов

Записывать ответы дословно, не пересказом. Строка в `docs/product/suppliers.md` на каждую фабрику.

1. **Marca blanca.** Trabajan con marca blanca? Se puede poner nuestra etiqueta y nuestro nombre de modelo?
2. **MOQ.** Cuál es el pedido mínimo: por modelo, por tela, por pedido? Hay mínimo en euros?
3. **Цена.** Qué descuento sobre PVP recomendado tenemos a nuestro volumen? Hay escalado por volumen?
4. **Отгрузка.** Envían directamente al cliente final en la Costa Blanca, o solo a nosotros? Con montaje o solo entrega?
5. **Срок.** Plazo de fabricación bajo pedido? Qué pasa con el plazo en julio y agosto?
6. **Образцы.** Nos dan muestras de telas para enviar a clientes? Gratis, y cuántas?
7. **Гарантия.** Quién responde ante el cliente: ustedes o nosotros? Qué pasa si llega dañado? Hay seguro de transporte?
8. **Материалы.** Tienen fotos de producto y ficheros 3D que podamos usar en la web? Con qué licencia?

Вопрос на выходе, который часто даёт больше всего: «¿Trabajan ya con alguna tienda online? ¿Cómo lo hacen normalmente?»

## Подрядчику последней мили: пять вопросов

1. **Тариф при объёме.** Precio por entrega con 50–100 entregas al mes, no precio puntual. Hay contrato mensual?
2. **Что входит.** Dos personas, subida sin ascensor, montaje en casa, retirada del embalaje — todo incluido o aparte?
3. **Ответственность.** Quién responde por daños en transporte y subida? Tienen seguro? Cómo se gestiona una reclamación?
4. **Окно доставки.** Dan al cliente una franja horaria y llamada de confirmación el día anterior?
5. **Зоны.** Precio por zona: Torrevieja, Orihuela Costa, Guardamar, Ciudad Quesada, Alicante, Benidorm, Calpe.

## Правила записи

- Цифры, а не впечатления: «45% от PVP при 5 единицах», не «дали хорошую скидку».
- Дата разговора и имя собеседника — потом понадобится.
- Что отказались обсуждать — тоже факт, записать.
- После обзвона перенести подтверждённые цифры в `docs/strategy/business-model.md` §6 вместо оценок и снять пометку «оценка».

## Стоп-сигналы

- Фабрика требует минимум, который мы не можем выбрать за квартал → не подходит на старте, оставить на будущее.
- Отказ отгружать напрямую клиенту и отсутствие подрядчика у нас → появляется потребность в складе раньше времени, пересмотреть §7 supply-and-delivery.
- Никто не отвечает за битое при перевозке → это 31% причин возвратов, условие нерабочее.
