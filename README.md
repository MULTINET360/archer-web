# PAGINAWEB

> Política vigente desde el 17 de octubre de 2026: precio de venta = lista × 1,30, sin precio tachado; delivery por radio y recojo en planta. Ver [actualización vigente](ACTUALIZACION-OCTUBRE-17.md). Esta política reemplaza las referencias históricas a precio final de lista y envío siempre gratuito que aparecen debajo.

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
- Envío y disponibilidad se coordinan por WhatsApp. El envío gratuito fue confirmado por el usuario el 12 de octubre de 2026. No hay stock en tiempo real.
- Las imágenes proceden de los materiales entregados y de recortes del PDF. Algunas son referencias de la familia, no de la presentación exacta.
- Se incluyen las cuatro marcas solicitadas. El PDF contiene otras marcas que quedan fuera de esta navegación.
- Los precios corresponden al catálogo de agosto de 2026. El catálogo no muestra precio inequívoco para lavandina normal de 1/5 L ni silicona de 5 L: esas variantes quedan por cotizar.
- Se conserva el contenido principal de Negocios Internacionales y la misión y visión de la web existente. Las declaraciones corporativas y las fichas técnicas requieren mantenimiento por la empresa.

## Pedido

El carrito se conserva únicamente en el navegador. Los datos del formulario permanecen en memoria mientras está abierta la página; no se envían a un servidor propio ni se guardan en localStorage. El usuario revisa el pedido y abre WhatsApp con un mensaje prellenado. Debe enviarlo allí. El sitio no confirma una venta, no reserva stock y no recibe confirmaciones bancarias automáticas.

## Verificación

`node tests/shop.test.cjs`

Comprueba precio final de lista y referencia comparativa, redondeos, cantidades, productos por cotizar, mensaje de pedido, identificadores e imágenes del catálogo.

## Antes de operar públicamente

Validar vigencia de precios, política comercial, tarifas/cobertura de entrega y datos de catálogo señalados en `NOTAS-CATALOGO.md`. Publicación de revisión privada mediante Sites; el dominio archer.com.bo no se modifica.


## Revisión de Marketing — 1 de octubre de 2026

La publicación navegable es https://lively-lily-a0d45a.netlify.app/. Netlify se actualiza mediante carga manual de `dist`; los cambios en GitHub no se despliegan automáticamente.

`revision.js`, `revision.css` y `revision-assets.js` incorporan los artes de Web recursos 2, la portada rotativa, páginas por marca, Historia y preguntas frecuentes. Los precios incluyen impuestos y todas las ventas se facturan. El pago se realiza mediante el QR BNB suministrado. El equipo del 77226763 verifica el abono antes de facturar; el envío es gratuito.


## Recursos 3 — implementación en curso, 12 de octubre de 2026

`resources3.js/css` mantienen la identidad corporativa Multi en el encabezado, usan los iconos suministrados, temas de categoría y patrón de tienda, agregan el mapa regional y sustituyen imágenes de portada por familias sin cambiar variantes ni precios. Una tarjeta reúne todos los aromas (confirmado por el usuario). La selección de formato es explícita antes de añadir al carrito. Se conservan Biosilk y Supremo sin cambio tipográfico (confirmado). Fuentes suministradas: Montserrat institucional, Helvetica Neue para Archer e Isidora Alt para Classic.

`checkout-payment.js/css` muestran el QR estático original, sin modificación de píxeles, con total y envío gratis; la declaración del cliente NO confirma el pago. El comprobante se adjunta manualmente en WhatsApp. Los productos por cotizar bloquean el pago parcial. El QR vence el 27 de julio de 2027. El mapa de entrega usa Leaflet 1.9.4 y OpenStreetMap con atribución visible y geolocalización solo a solicitud del cliente.

Pendiente: comprobación visual móvil/tablet/escritorio, comprobación de interacciones de mapa y pago, y publicación de esta versión. No confundir los tests de datos con la revisión visual o una confirmación bancaria.
