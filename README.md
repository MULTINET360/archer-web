# PAGINAWEB

# Archer · propuesta comercial y tienda

Sitio estático en `dist/`. Abrir con un servidor HTTP; no requiere instalación de dependencias.

## Ejecutar

`python -m http.server 4173 --bind 127.0.0.1 --directory dist`

Abrir `http://127.0.0.1:4173/`. Las rutas están en el hash: `#inicio`, `#nosotros`, `#productos`, `#internacionales`, `#institucional`, `#tienda`, `#pedido`.

## Contenido y precios

- `dist/catalog.js`: familias, presentaciones, códigos y precios de catálogo en centavos de boliviano. Precio web = precio de lista del catálogo. La referencia comparativa es lista × 1,30, redondeada a centavos por unidad. Se etiqueta como referencia calculada, no como precio anterior de venta.
- `SHOP_CONFIG.referenceMarkupPercent`: 30. Esta cifra incrementa la referencia; no descuenta el importe cobrado.
- `SHOP_CONFIG.whatsapp`: `59177226763`.
- `null` en `listCents` significa cotización pendiente. Nunca se presenta como gratis.
- Envío y disponibilidad se coordinan por WhatsApp. No se promete entrega gratuita ni stock en tiempo real.
- Las imágenes proceden de los materiales entregados y de recortes del PDF. Algunas son referencias de la familia, no de la presentación exacta.
- Se incluyen las cuatro marcas solicitadas. El PDF contiene otras marcas que quedan fuera de esta navegación.
- Los precios corresponden al catálogo de agosto de 2026. El catálogo no muestra precio inequívoco para lavandina normal de 1/5 L ni silicona de 5 L: esas variantes quedan por cotizar.
- Se conserva el contenido principal de Negocios Internacionales y la misión y visión de la web existente. Las declaraciones corporativas y las fichas técnicas requieren mantenimiento por la empresa.

## Pedido

El carrito se conserva únicamente en el navegador. Los datos del formulario permanecen en memoria mientras está abierta la página; no se envían a un servidor propio ni se guardan en localStorage. El usuario revisa el pedido y abre WhatsApp con un mensaje prellenado. Debe enviarlo allí. El sitio no confirma una venta, no reserva stock y no procesa pagos.

## Verificación

`node tests/shop.test.cjs`

Comprueba precio final de lista y referencia comparativa, redondeos, cantidades, productos por cotizar, mensaje de pedido, identificadores e imágenes del catálogo.

## Antes de operar públicamente

Validar vigencia de precios, política comercial, tarifas/cobertura de entrega y datos de catálogo señalados en `NOTAS-CATALOGO.md`. Publicación de revisión privada mediante Sites; el dominio archer.com.bo no se modifica.
