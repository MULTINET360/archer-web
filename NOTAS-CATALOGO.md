# Notas de carga del catálogo

Fuente: CATALOGO-Agosto-2026.pdf entregado por el usuario. Datos extraídos de texto y comprobados visualmente en las páginas relevantes. Los precios son unitarios por presentación, no por caja, excepto variantes que explícitamente representan packs.

- La extracción textual del PDF puede contener precios antiguos ocultos: se tomó el precio visible en la página. Ejemplo: Classic doypack de 900 mL (Baby, Manzanilla, Aloe Vera) figura a Bs 18,50 en la página 28.
- Archer Limpia Vidrios: se usa 970 mL según página 4, aunque el archivo de foto menciona 860 mL.
- Biosilk doypack: 800 mL para Baby, Sábila y Coco, Manzanilla y Miel; 1 L para Anticaspa, según página 42. Algunos archivos de imagen dicen 1 L para todas las variantes.
- El código 70374 se repite en el PDF para Classic For Men y Biosilk doypack Anticaspa. Se conserva como referencia publicada; los identificadores internos de la tienda son distintos.
- Lavandina normal Archer 1 L / 5 L: página 18 sin precio visible junto al producto. Se ofrece consulta.
- Silicona protectora 5 L: página 24 sin correspondencia inequívoca de precio. Se ofrece consulta.
- Los packs Biosilk de 48 unidades tienen precios por presentación (caja, balde, handy box).
- Las variantes con imágenes de la familia comparten una imagen representativa. El nombre y volumen seleccionados son los que se envían en el pedido.
- No se inventan porcentajes de concentración, diluciones ni tiempos de contacto para formatos institucionales. Se invita a solicitar la ficha técnica.

La estructura está lista para actualizar precios, disponibilidad e imágenes desde `dist/catalog.js`.


## Revisión visual y comercial de septiembre de 2026

- Precio cobrado = precio de lista del PDF. Referencia comparativa = lista × 1,30. No se publica como un precio anterior de venta ni como 30 % de descuento; la diferencia matemática respecto de esa referencia sería aproximadamente 23,08 %.
- Se sustituyeron recortes de página por imágenes referenciales restauradas con la herramienta integrada image_gen, con fondo transparente y productos completos. Se preservaron los PNG originales proporcionados para las variantes donde existían.
- Los detalles diminutos de etiquetas restauradas pueden ser aproximados: estas imágenes son ilustrativas; composición, concentración, dosis y precauciones deben consultarse en las etiquetas y fichas originales.
- Se conservaron las imágenes originales de Cera autobrillo y Alcohol Classic para evitar versiones con etiquetas alteradas.
- Carrusel: cambio automático cada 4 segundos, selección de marca, flechas, clic en imagen y control de pausa. Continúa después del clic y al pasar el cursor. Respeta la preferencia del dispositivo de reducir movimiento.
- Prompts: extracción de la familia indicada del PDF, eliminación de fondos/precios/copy, conservación de envases/colores/etiquetas, transparencia real, tapas y bases completas con margen; mejora moderada de claridad sin rediseñar el producto.
