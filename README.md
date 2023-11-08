# Pagina de la Universidad Valle del Momboy (UVM)

## Descripción
Este repositorio contiene los archivos y recursos necesarios para la creación de la página web de la Universidad Valle del Momboy (UVM). El proyecto está siendo desarrollado por el equipo conformado por Yony Araujo, Diego Briceño y Jesús García.

## Estructura del Proyecto
El proyecto se estructura de la siguiente manera:
- `index.html`: El archivo HTML que contiene la página web principal.
- `css/estilos.css`: El archivo CSS que controla los estilos de la página.
- `img/`: Una carpeta que contiene las imágenes utilizadas en la página.
- `database.php`: El archivo PHP que se encarga de la interacción con la base de datos.

Aquí está la mejora en la sintaxis del README para GitHub:

## Instrucciones de Uso

Para utilizar este proyecto, sigue los siguientes pasos:

1. Clona este repositorio en tu máquina local:

   ```bash
   git clone https://github.com/tu-usuario/tu-proyecto.git
   ```

2. Asegúrate de tener WampServer instalado en tu máquina. WampServer es un servidor web para Windows que te permitirá ejecutar el proyecto de manera local.

   Puedes descargar WampServer desde su sitio web oficial. [Descargar WampServer](http://www.wampserver.com/)

3. Abre WampServer y asegúrate de que esté funcionando. Luego, dirígete a phpMyAdmin para iniciar sesión en la base de datos.

4. Copia el contenido de este repositorio en la carpeta "www" de WampServer. Esta es la carpeta donde debes colocar tus proyectos web para que puedas acceder a ellos localmente.

5. Crea la base de datos y la tabla en MySQL para almacenar los datos del formulario. Puedes utilizar la siguiente estructura de tabla como referencia:

   ```sql
   CREATE TABLE datos_formulario (
       id INT AUTO_INCREMENT PRIMARY KEY,
       nombre_completo VARCHAR(255) NOT NULL,
       correo_electronico VARCHAR(255) NOT NULL,
       ciudad VARCHAR(100) NOT NULL,
       telefono VARCHAR(20) NOT NULL,
       comentarios TEXT
   );
   ```

6. Crea un archivo llamado `config.php` en la raíz del proyecto y configura la conexión a tu base de datos.

7. Abre tu navegador web y accede al proyecto escribiendo `http://localhost/tu-proyecto` en la barra de direcciones, donde `tu-proyecto` es el nombre de la carpeta que contiene los archivos del proyecto.

8. Abre el archivo `index.html` en tu navegador web para visualizar la página principal.

9. Explora el código fuente de `index.html` y `css/estilos.css` para comprender la estructura y estilos de la página.

Con estos pasos, podrás configurar y ejecutar el proyecto en tu entorno local.

## Acerca del Proyecto
Este proyecto tiene como objetivo crear una página web para la Universidad Valle del Momboy (UVM) siguiendo los principios de diseño y usabilidad (UI/UX). El equipo de desarrollo está trabajando en la implementación de diferentes secciones y funcionalidades, incluyendo un formulario de contacto que se conecta a una base de datos MySQL.

## Consejos Adicionales
Utiliza este proyecto como punto de partida para tus propios proyectos web.
Experimenta con el diseño y los estilos para personalizar la apariencia de la página de acuerdo y
Asegúrate de seguir buenas prácticas de programación y documentación en tu desarrollo.

## Autores (Estudiantes de Ingenieria en Computación)

- Yony Araujo
- Diego Briceño
- Jesús García
