# Manual Técnico!

Hoy en día, el uso de los lenguajes de programación es muy importante en el desarrollo de cualquier software, ya sea web, escritorio o cualquier entorno. La programación llega a tomar tal relevancia que a lo largo de la historia de la computación, surgen nuevos lenguajes para dar solución a distintas problemáticas, actualmente existe un sin fin de lenguajes. 

Muchas veces conocemos un lenguaje y es necesario hacer el cambio a otro, lo que requiere invertir tiempo en aprendizaje del nuevo lenguaje. Para facilitar esto, en el siguiente proyecto se implementa una aplicación web que permita al usuario ingresar un archivo java y traducirlo a Python o JavaScript. 

El presente manual pretende proporcionar a detalle el funcionamiento del código con el cual fue posible todo el flujo de trabajo de la aplicación web al realizar el análisis léxico y  sintáctico de un archivo de entrada para su posterior traducción a Python o JavaScript. 


## Objetivo

Brindar al usuario una aplicación web moderna, que le permita la traducción de archivos .java a lenguaje de programación Python y JavaScript, realizando una verificación léxica y sintáctica del archivo.

## Herramientas Utilizadas
* **Frontend**
    * HTML
    * CSS
    * JavaScript
    * Go
 * **Backend**
      * Traductor JS
	      * NodeJS
	      * JavaScript 
      * Traductor Python
	      * NodeJS
	       * Jison
	       * JavaScript


## Alcance del sistema

Brindar apoyo informático en la traducción de archivos del lenguaje Java a Python y JavaScript, que serán analizados léxica y sintactamente  para asegurarse de una traducción correcta.

## Analisis Lexico - Tokens a Reconocer
| Tokens a Reconocer |  | 	|
|--|--|--|
| Comentarios | + | out |
|int|-|print|
|char| * |println|
|String|/|break|
|double |^ |continue|
|boolean|(|return|
|Comentarios | ) |static|
|;|[|main|
|,|]|for|
|:|{|while|
|++|}|do|
|--|public|if|
|>=|class|else|
|<=|interface|CADENA|
|!=|void|IDENTIFICADORE|
|==|true|NUMERO|
|\|\||false|
|&&|System|



## Gramática Utilizada

    <INICIO> -> <LISTA_PLANTILLAS>

	<LISTA_PLANTILLAS> -> <PLANTILLA> <LISTA_PLANTILLAS_P>

	<LISTA_PLANTILLAS_P> -> <PLANTILLA> <LISTA_PLANTILLAS_P>
                       | ε                      
      
	<PLANTILLA> -> public <TIPO_PLANTILLA>

	<TIPO_PLANTILLA> -> class id  { <INSTRUCCIONES_CLASE> }
                  | interface id { <LISTA_FUNCIONES> }

	<LISTA_FUNCIONES> -> <FUNCION> <LISTA_FUNCIONES_P>
                  |  ε

	<LISTA_FUNCIONES_P> -> <FUNCION> <LISTA_FUNCIONES_P>
                     | ε

	<FUNCION> -> public <TIPO> id ( <LISTA_PARAMETROS> );

	<INSTRUCCIONES_CLASE> -> <DECLARACION_METODO> <INSTRUCCIONES_CLASE>
                       | <DECLARACION__VARIABLES> <INSTRUCCIONES_CLASE>
                       | <ASIGN_LLAMADA> <INSTRUCCIONES_CLASE>
                       | ε

	<DECLARACION_METODO> -> public <METODO>

	<METODO> -> static void main (String [] id) { <INSTRUCCIONES> }
          | <TIPO> id (<LISTA_PARAMETROS>) { <INSTRUCCIONES> }

	<TIPO> -> String
        | int
        | char
        | double
        | boolean
        | void

	<ASIGN_LLAMADA> -> id <CAR>
                 | ε

	<CAR> -> = <EXPRESION>;
       | ( <LISTA_PARAMETROS> );
       | ++;
       | --;

	<INSTRUCCIONES> -> <DECLARACION__VARIABLES> <INSTRUCCIONES>
                 | <IF> <INSTRUCCIONES>
                 | <FOR> <INSTRUCCIONES>
                 | <WHILE> <INSTRUCCIONES>
                 | <DO> <INSTRUCCIONES>
                 | <IMPRIMIR> <INSTRUCCIONES>
                 | return <EXPRESION>; <INSTRUCCIONES>
                 | break;  
                 | continue;
                 | ε

	<DECLARACION__VARIABLES> -> <TIPO_DATO> id <ASIGNACION> <LISTA_VARIABLES> ;
	<ASIGNACION> -> = <EXPRESION>
              | ε
	<LISTA_VARIABLES> -> , id <ASIGNACION> <LISTA_VARIABLES>
                   | ε

	<LISTA_PARAMETROS> -> <PARAMETRO> <LISTA_PARAMETROS_P>
                    | ε
	<PARAMETRO> -> <TIPO_DATO> id
	<LISTA_PARAMETROS_P> -> , <PARAMETRO> <LISTA_PARAMETROS_P>
                      | ε
	<TIPO_DATO> -> int
             | char
             | String
             | double
             | boolean


    
	<IF> -> if ( <EXPRESION> ) { <INSTRUCCIONES> } <ELSE>
	<ELSE> -> else <ELSE_P>
        | ε
	<ELSE_P> -> <IF>
          | { INSTRUCCIONES }

	<FOR> -> for (<DECLARACION__VARIABLES>; <EXPRESION>; id<INCREMENTO>) { <INSTRUCCIONES> }

	<INCREMENTO> -> ++
              | --

	<WHILE> -> while ( <EXPRESION> ) { <INSTRUCCIONES> }

	<DO> -> do { INSTRUCCIONES } while (<EXPRESION>);



	<IMPRIMIR> -> System . out . println ( <EXPRESION> ) ; ---

	<EXPRESION> -> <E> <LOGICO_RELACIONAL>
	<LOGICO_RELACIONAL> -> && <EXPRESION>
                     | || <EXPRESION>
                     | ! <EXPRESION>
                     | ^ <EXPRESION>
                     | > <EXPRESION>
                     | < <EXPRESION>
                     | >= <EXPRESION>
                     | <= <EXPRESION>
                     | = = <EXPRESION>
                     | != <EXPRESION>
                     | ε
	<E> -> <T> <EP>
	<EP> -> + <T> <EP>
      | - <T> <EP>
      | ε
	<T> -> <F> <TP>
	<TP> -> * <F> <TP>
      | / <F> <TP>
      | ε
	<F> -> <NAME>
     | numero
     | cadena
     | true
     | false
     | - <EXPRESION>
     | ! <EXPRESION>
     | ( <EXPRESION> )

	<NAME> -> id <NAME_P>
	<NAME_P> -> ( <LISTA_EXPRESIONES> )
          | ++;
          | --;
          | ε
	<LISTA_EXPRESIONES> -> <EXPRESION> <LISTA_EXPRESIONES_P>
                     | ε
	<LISTA_EXPRESIONES_P> -> , <EXPRESION> <LISTA_EXPRESIONES_P>
                       | ε

