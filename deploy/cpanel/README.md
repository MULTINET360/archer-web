# Publicación cPanel y seguridad — 17 octubre 2026

Dominio: https://archer.com.bo/ — raíz /home/archer/public_html.
Publicar los archivos de dist y deploy/cpanel/.htaccess en esa raíz. No restaurar las reglas de WordPress sobre la configuración nueva.

WordPress, la carpeta web, oldweb.zip, archivos PHP y registros anteriores se movieron a /home/archer/web-anterior-privada-20261017, fuera del directorio público. La base de datos no fue modificada. Existe además el respaldo previo /home/archer/respaldo-web-antes-20261017.zip.

Configuración: sin listado de directorios, PHP/archivos de respaldo bloqueados, CSP con scripts locales y fuentes/mapa autorizados, anti-iframe, nosniff, política de referente, permisos limitados y HSTS de un año solo para este dominio (sin includeSubDomains ni preload).

Verificación HTTP: portada 200; oldweb.zip, wp-login.php, wp-admin/, web/, assets/, .htaccess, wp-config.php e index.php devuelven 403. Leaflet JS devuelve 200. Las fichas y selección de productos se comprobaron en el navegador. No se enviaron pedidos ni se realizaron pagos.

Restauración: conservar una copia de la versión actual; recuperar los archivos y .htaccess de la copia privada solo si se decide reactivar WordPress. No mover backups ZIP a public_html. No alterar correo, DNS ni bases de datos para una actualización estática.

Esto es un refuerzo básico; no acredita una auditoría completa del hosting ni confirmación bancaria automática. La comprobación de pagos sigue siendo manual.
