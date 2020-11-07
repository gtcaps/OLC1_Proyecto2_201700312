# Translator in Docker!

Organizacion de Lenguajes y Compiladores 1
II Semestre 2020

[Ver descripción del proyecto](https://drive.google.com/file/d/1CLP08ncZoEr0st1dbavT5wnC8mj22cLb/view?usp=sharing)


# Requisitos para el funcionamiento

Se debe tener instalado Docker para poder ejecutar el proyecto. El proyecto cuenta con un archivo docker-compose.yml el cual se encargara de levantar los servicios e instalar los componentes necesarios para el funcionamiento de la aplicación web desarrollado en Go y Node JS con Express JS.

# Ejecutar el proyecto
### Descargar el proyecto
Ejecutar el siguiente comando en una terminal con git instalado

    git clone https://github.com/gtcaps/OLC1_Proyecto2_201700312 translatorInDocker

Acceder a la carpeta del proyecto

    cd translatorInDocker

### Ejecutar el Proyecto
Teniendo docker instalado, ejecutar el siguiente comando el cual levantara los 3 contenedores.  En caso de ser necesario cada una de las carpetas tiene un dockerfile para poder crear la imagen en caso de que falle en el archivo docker-compose y no se logre conectar al docker-hub y se vuelve a ejecutar el comando de docker-compose. 

Ejecutar el docker-compose

    docker-compose up -d

Ejecutar el dockerfile

    docker build -t <nombre_iamgen> <ruta_dockerfile>

 Para acceder al proyecto, usar un navegador y se accede a localhost en el puerto 8000, para los otros servicios que son las api, es la misma dirección pero en los puertos 4000 y 3000.
 

    localhost:8000

### Comandos útiles al utilizar Docker
Ver imágenes de Docker 

    docker images
Ver los procesos de los contenedores 

    docker ps -a
Parar un contenedor

    docker stop <ID_CONTENEDOR>
Levantar un contenedor ya existente

    docker container -i <ID_CONTENEDOR>
Ver los logs de un contenedor corriendo

    docker logs -f <ID_CONTENEDOR>
    