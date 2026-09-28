# Entrega para GitHub

Esta carpeta contiene el proyecto completo de la web Archer, con código e imágenes utilizados por el sitio.

## Cargar al repositorio

1. Descomprime el ZIP.
2. Crea o utiliza el repositorio de GitHub que corresponda. Para la revisión interna, utiliza un repositorio privado.
3. Carga el contenido de esta carpeta en la raíz del repositorio: dist, tests, README.md, NOTAS-CATALOGO.md, .gitignore y este archivo. No cargues el ZIP como sustituto del código.
4. Conserva la estructura de carpetas y los nombres de los archivos.

## Ejecutar localmente

Desde la carpeta del proyecto, con Python instalado:

```sh
python -m http.server 4173 --directory dist
```

Abre http://localhost:4173/ en el navegador.

## Qué contiene

- dist/index.html: entrada del sitio.
- dist/styles.css: diseño adaptable.
- dist/app.js: navegación, carrusel, tienda y formularios.
- dist/catalog.js: productos, variantes y precios.
- dist/shop-core.js: cálculo y generación del pedido.
- dist/assets.js y dist/assets/: imágenes y referencias.
- tests/shop.test.cjs: verificaciones del carrito y catálogo.

No necesita instalación de paquetes ni compilación. Para otro hosting estático, la carpeta de publicación es dist.

El pedido se prepara para WhatsApp 59177226763; el sitio no procesa pagos. El repositorio incluye precios y materiales de la empresa. Subir el código a GitHub no publica automáticamente la web.
