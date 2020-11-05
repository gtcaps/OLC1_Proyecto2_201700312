%{
    const Token = require('./token');
    const Nodo = require('./Nodo');
    let listaTokens = [];
    let listaErrores = [];
    let traduccion = "";
    let ident = "";  
%}

// ===================================== ANALISIS LEXICO ==============================================
%lex
%options case-sensitive
%%

// EXPRESIONES A OMITIR
\s+                                         %{ /* Omitir espacios en blanco */ %}
[\t\r]+                                     %{ /* Omitir saltos de linea, tabs y retornos*/ %}

// COMENTARIOS
"/""/".*                                    %{ listaTokens.push(new Token("Comentario", yytext, yylloc.first_line, yylloc.first_column)); return "tk_comentario";%}
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]         %{ listaTokens.push(new Token("Comentario Multilinea", yytext, yylloc.first_line, yylloc.first_column)); return "tk_multi_coment";%}

// TOKENS 
// TIPO DATO
"int"                                       %{ listaTokens.push(new Token("Tipo_Dato", yytext, yylloc.first_line, yylloc.first_column)); return "tk_int";%}
"char"                                      %{ listaTokens.push(new Token("Tipo_Dato", yytext, yylloc.first_line, yylloc.first_column)); return "tk_char";%}
"String"                                    %{ listaTokens.push(new Token("Tipo_Dato", yytext, yylloc.first_line, yylloc.first_column)); return "tk_string";%}
"double"                                    %{ listaTokens.push(new Token("Tipo_Dato", yytext, yylloc.first_line, yylloc.first_column)); return "tk_double";%}
"boolean"                                   %{ listaTokens.push(new Token("Tipo_Dato", yytext, yylloc.first_line, yylloc.first_column)); return "tk_boolean";%}

";"                                         %{ listaTokens.push(new Token("Punto_Coma", yytext, yylloc.first_line, yylloc.first_column)); return "tk_punto_coma";%}
","                                         %{ listaTokens.push(new Token("Coma", yytext, yylloc.first_line, yylloc.first_column)); return "tk_coma";%}
":"                                         %{ listaTokens.push(new Token("Dos_Puntos", yytext, yylloc.first_line, yylloc.first_column)); return "tk_dos_puntos";%}
// "."                                         %{ listaTokens.push(new Token("Punto", yytext, yylloc.first_line, yylloc.first_column)); return "tk_punto; %}

// INCREMENTO
"++"                                        %{ listaTokens.push(new Token("Incremento", yytext, yylloc.first_line, yylloc.first_column)); return "tk_incremento";%}
"--"                                        %{ listaTokens.push(new Token("Decremento", yytext, yylloc.first_line, yylloc.first_column)); return "tk_decremento";%}

// OPERADORES
">="                                        %{ listaTokens.push(new Token("Mayor_Igual", yytext, yylloc.first_line, yylloc.first_column)); return "tk_mayor_igual";%}
"<="                                        %{ listaTokens.push(new Token("Menor_Igual", yytext, yylloc.first_line, yylloc.first_column)); return "tk_menor_igual";%}
">"                                         %{ listaTokens.push(new Token("Mayor", yytext, yylloc.first_line, yylloc.first_column)); return "tk_mayor";%}
"<"                                         %{ listaTokens.push(new Token("Menor", yytext, yylloc.first_line, yylloc.first_column)); return "tk_menor";%}
"!="                                        %{ listaTokens.push(new Token("Diferente_De", yytext, yylloc.first_line, yylloc.first_column)); return "tk_diferente_de";%}
"=="                                        %{ listaTokens.push(new Token("Doble_Igual", yytext, yylloc.first_line, yylloc.first_column)); return "tk_doble_igual";%}
"!"                                         %{ listaTokens.push(new Token("Not", yytext, yylloc.first_line, yylloc.first_column)); return "tk_not";%}
"="                                         %{ listaTokens.push(new Token("Igual", yytext, yylloc.first_line, yylloc.first_column)); return "tk_igual";%}
"||"                                        %{ listaTokens.push(new Token("Or", yytext, yylloc.first_line, yylloc.first_column)); return "tk_and";%}
"&&"                                        %{ listaTokens.push(new Token("And", yytext, yylloc.first_line, yylloc.first_column)); return "tk_or";%}

"+"                                        %{ listaTokens.push(new Token("Mas", yytext, yylloc.first_line, yylloc.first_column)); return "tk_mas";%}
"-"                                        %{ listaTokens.push(new Token("Menos", yytext, yylloc.first_line, yylloc.first_column)); return "tk_menos";%}
"*"                                        %{ listaTokens.push(new Token("Multiplicacion", yytext, yylloc.first_line, yylloc.first_column)); return "tk_multiplicacion";%}
"/"                                        %{ listaTokens.push(new Token("Division", yytext, yylloc.first_line, yylloc.first_column)); return "tk_division";%}
"^"                                        %{ listaTokens.push(new Token("Xor", yytext, yylloc.first_line, yylloc.first_column)); return "tk_xor";%}

"("                                        %{ listaTokens.push(new Token("Parentesis_Izq", yytext, yylloc.first_line, yylloc.first_column)); return "tk_parentesis_izq";%}
")"                                        %{ listaTokens.push(new Token("Parentesis_Der", yytext, yylloc.first_line, yylloc.first_column)); return "tk_parentesis_der";%}
"["                                        %{ listaTokens.push(new Token("Corchete_Izq", yytext, yylloc.first_line, yylloc.first_column)); return "tk_corchete_izq";%}
"]"                                        %{ listaTokens.push(new Token("Corchete_Der", yytext, yylloc.first_line, yylloc.first_column)); return "tk_corchete_der";%}
"{"                                        %{ listaTokens.push(new Token("Llave_Izq", yytext, yylloc.first_line, yylloc.first_column)); return "tk_llave_izq";%}
"}"                                        %{ listaTokens.push(new Token("Llave_Der", yytext, yylloc.first_line, yylloc.first_column)); return "tk_llave_der";%}

// PALABRAS RESERVADAS
"public"                                   %{ listaTokens.push(new Token("Palabra_Reservada", yytext, yylloc.first_line, yylloc.first_column)); return "tk_public";%}
"class"                                    %{ listaTokens.push(new Token("Palabra_Reservada", yytext, yylloc.first_line, yylloc.first_column)); return "tk_class";%}
"interface"                                %{ listaTokens.push(new Token("Palabra_Reservada", yytext, yylloc.first_line, yylloc.first_column)); return "tk_interface";%}
"void"                                     %{ listaTokens.push(new Token("Palabra_Reservada", yytext, yylloc.first_line, yylloc.first_column)); return "tk_void";%}
"true"                                     %{ listaTokens.push(new Token("Palabra_Reservada", yytext, yylloc.first_line, yylloc.first_column)); return "tk_true";%}
"false"                                    %{ listaTokens.push(new Token("Palabra_Reservada", yytext, yylloc.first_line, yylloc.first_column)); return "tk_false";%}                    
"System.out.println"                       %{ listaTokens.push(new Token("Imprimir", yytext, yylloc.first_line, yylloc.first_column)); return "tk_imprimir";%}
"System.out.print"                         %{ listaTokens.push(new Token("Imprimir", yytext, yylloc.first_line, yylloc.first_column)); return "tk_imprimir";%}
"System.out.printf"                        %{ listaTokens.push(new Token("Imprimir", yytext, yylloc.first_line, yylloc.first_column)); return "tk_imprimir";%}
"break"                                    %{ listaTokens.push(new Token("Palabra_Reservada", yytext, yylloc.first_line, yylloc.first_column)); return "tk_break";%}
"continue"                                 %{ listaTokens.push(new Token("Palabra_Reservada", yytext, yylloc.first_line, yylloc.first_column)); return "tk_continue";%}
"return"                                   %{ listaTokens.push(new Token("Palabra_Reservada", yytext, yylloc.first_line, yylloc.first_column)); return "tk_return";%}
"static"                                   %{ listaTokens.push(new Token("Palabra_Reservada", yytext, yylloc.first_line, yylloc.first_column)); return "tk_static";%}
"main"                                     %{ listaTokens.push(new Token("Palabra_Reservada", yytext, yylloc.first_line, yylloc.first_column)); return "tk_main";%}
"for"                                      %{ listaTokens.push(new Token("Palabra_Reservada", yytext, yylloc.first_line, yylloc.first_column)); return "tk_for";%}
"while"                                    %{ listaTokens.push(new Token("Palabra_Reservada", yytext, yylloc.first_line, yylloc.first_column)); return "tk_while";%}
"do"                                       %{ listaTokens.push(new Token("Palabra_Reservada", yytext, yylloc.first_line, yylloc.first_column)); return "tk_do";%}
"if"                                       %{ listaTokens.push(new Token("Palabra_Reservada", yytext, yylloc.first_line, yylloc.first_column)); return "tk_if";%}
"else"                                     %{ listaTokens.push(new Token("Palabra_Reservada", yytext, yylloc.first_line, yylloc.first_column)); return "tk_else";%}

\"([^\\\"]|\\.)*\"                          %{ listaTokens.push(new Token("Cadena", yytext.substr(1, yyleng-2), yylloc.first_line, yylloc.first_column)); return "tk_cadena";%}
\'[^\']*\'                                  %{ listaTokens.push(new Token("Caracter", yytext.substr(1, yyleng-2), yylloc.first_line, yylloc.first_column)); return "tk_caracter";%}
[0-9]+("."[0-9]+)?\b                        %{ listaTokens.push(new Token("Numero", yytext, yylloc.first_line, yylloc.first_column)); return "tk_numero";%}
[a-zA-Z]([a-zA-Z0-9_])*                     %{ listaTokens.push(new Token("Identificador", yytext, yylloc.first_line, yylloc.first_column)); return "tk_identificador";%}


// FIN DEL ARCHIVO
<<EOF>>                                     %{ return "EOF"; %}

// ERRORES LEXICOS
.                                           %{ listaErrores.push(new Token("ERROR LEXICO", yytext, yylloc.first_line, yylloc.first_column )); %}

/lex

// ===================================== ANALISIS SINTACTICO ==============================================

// ASOCIACIÓN Y PRECEDENCIA
%left 'tk_and' 'tk_or' 'tk_xor'
%left 'tk_doble_igual' 'tk_diferente_de'
%left 'tk_menor' 'tk_menor_igual' 'tk_mayor' 'tk_mayor_igual'
%left 'tk_mas' 'tk_menos'
%left 'tk_multiplicacion' 'tk_division'
%left UMENOS
%right 'tk_not'
%right 'tk_incremento' 'tk_decremento'

%start INICIO
%%

INICIO: LISTA_PLANTILLAS EOF 
        { 
            let nodoRaiz = new Nodo("INICIO", "INICIO");
            nodoRaiz.agregarHijo($1.nodo);


            return {
                listaTokens: listaTokens, 
                listaErrores: listaErrores, 
                ast: nodoRaiz,
                traduccion: $1.traduccion
                };

            
        };

LISTA_PLANTILLAS: PLANTILLA LISTA_PLANTILLAS_P   {  $$ = new Nodo("LISTA_PLANT", "LISTA_PLANT 1");
                                                    $$.agregarHijo($1.nodo);

                                                    traduccion = `${$1.traduccion}\n`;
                                                    if ($2) {
                                                        $$.agregarHijo($2.nodo);
                                                        traduccion += `${$2.traduccion}`;
                                                    }
                                                    $$ = {nodo: $$, traduccion: traduccion}
                                                 }
                | tk_comentario LISTA_PLANTILLAS_P 
                    {
                        $$ = new Nodo("LISTA_PLANT","LISTA_PLANT");

                        traduccion = `${$1}\n`;
                        if ($2) {
                            $$.agregarHijo($2.nodo);
                            traduccion += `${$2.traduccion}\n`;
                        }
                        $$ = {nodo: $$, traduccion: traduccion};

                    }
                | tk_multi_coment LISTA_PLANTILLAS_P 
                    {
                        $$ = new Nodo("LISTA_PLANT","LISTA_PLANT");

                        traduccion = `${$1}\n`;
                        if ($2) {
                            $$.agregarHijo($2.nodo);
                            traduccion += `${$2.traduccion}\n`;
                        }
                        $$ = {nodo: $$, traduccion: traduccion};

                    }
                | ;

LISTA_PLANTILLAS_P: PLANTILLA LISTA_PLANTILLAS_P {  $$ = new Nodo("LISTA_PLANT", "LISTA_PLANT 2");
                                                    $$.agregarHijo($1.nodo);

                                                    traduccion = `${$1.traduccion}\n`;
                                                    if ($2) {
                                                        $$.agregarHijo($2.nodo);
                                                        traduccion += `${$2.traduccion}`;
                                                    }
                                                    $$ = {nodo: $$, traduccion: traduccion}


                                                 }
                | tk_comentario LISTA_PLANTILLAS_P 
                    {
                        $$ = new Nodo("LISTA_PLANT","LISTA_PLANT");

                        traduccion = `${$1}\n`;
                        if ($2) {
                            $$.agregarHijo($2.nodo);
                            traduccion += `${$2.traduccion}\n`;
                        }
                        $$ = {nodo: $$, traduccion: traduccion};

                    }
                | tk_multi_coment LISTA_PLANTILLAS_P 
                    {
                        $$ = new Nodo("LISTA_PLANT","LISTA_PLANT");

                        traduccion = `${$1}\n`;
                        if ($2) {
                            $$.agregarHijo($2.nodo);
                            traduccion += `${$2.traduccion}\n`;
                        }
                        $$ = {nodo: $$, traduccion: traduccion};

                    }
                |  ;

PLANTILLA: tk_public TIPO_PLANTILA 
    {
        $$ = new Nodo("PLANTILLA", "PLANTILLA");
        $$.agregarHijo(new Nodo("public", $1));
        $$.agregarHijo($2.nodo);

        $$ = {nodo: $$, traduccion: $2.traduccion};
        
        
    };

TIPO_PLANTILA: tk_class tk_identificador tk_llave_izq INSTRUCCIONES_CLASE tk_llave_der
                {
                    $$ = new Nodo("CLASE", "CLASE");
                    $$.agregarHijo(new Nodo("class", $1));
                    $$.agregarHijo(new Nodo("id", $2));
                    
                    


                    traduccion = "class " + $2 + "{ \n";
                    traduccion += "    constructor(){\n"
                    traduccion += "    }\n\n"
                    if ($4) {
                        $$.agregarHijo($4.nodo);
                        $4.traduccion.split("\n").forEach(linea => {
                            traduccion += "    " + linea + "\n";
                        });
                    }
                    


                    traduccion += "\n}\n";
                    $$ = {nodo: $$, traduccion: traduccion};

                    

                }
             | tk_interface tk_identificador tk_llave_izq LISTA_FUNCIONES tk_llave_der
                {
                    $$ = new Nodo("INTERFAZ", "INTERFACE");
                    $$.agregarHijo(new Nodo("interface", $1));
                    $$.agregarHijo(new Nodo("id", $2));


                    traduccion = `class ${$2} { \n`;
                    if ($4) { 
                        $$.agregarHijo($4.nodo);
                        traduccion += `${$4.traduccion}`;
                    }
                    traduccion += `}\n`;
                    
                    $$ = {nodo: $$, traduccion: traduccion};

                }
             | error tk_llave_der 
                {   
                    console.log("ERROR SINTACTICO 1 -> LINEA: " + this._$.first_line);
                    $$ = {nodo: new Nodo("",""), traduccion: ""}; 
                    listaErrores.push(new Token("ERROR SINTACTICO", yytext, this._$.first_line, this._$.first_column)); 
                };
            

LISTA_FUNCIONES: FUNCION LISTA_FUNCIONES_P { $$ = new Nodo("LISTA_FUNC", "LISTA_FUNC");
                                             $$.agregarHijo($1.nodo);
                                            
                                             traduccion = `${$1.traduccion}`;
                                             if ($2) {
                                                   $$.agregarHijo($2.nodo);
                                                   traduccion += `${$2.traduccion}`;
                                             }
                                             $$ = {nodo: $$, traduccion: traduccion}

                                           }
                | tk_comentario LISTA_FUNCIONES_P 
                    {
                        $$ = new Nodo("LISTA_FUNC","LISTA_FUNC");

                        traduccion = `   ${$1}\n`;
                        if ($2) {
                            $$.agregarHijo($2.nodo);
                            traduccion += `${$2.traduccion}\n`;
                        }
                        $$ = {nodo: $$, traduccion: traduccion};

                    }
                | tk_multi_coment LISTA_FUNCIONES_P 
                    {
                        $$ = new Nodo("LISTA_FUNC","LISTA_FUNC");

                        traduccion = `   ${$1}\n`;
                        if ($2) {
                            $$.agregarHijo($2.nodo);
                            traduccion += `${$2.traduccion}\n`;
                        }
                        $$ = {nodo: $$, traduccion: traduccion};

                    }
               | ;

LISTA_FUNCIONES_P: FUNCION LISTA_FUNCIONES_P { $$ = new Nodo("LISTA_FUNC", "LISTA_FUNC");
                                               $$.agregarHijo($1.nodo);


                                               traduccion = `${$1.traduccion}`;
                                               if ($2) {
                                                   $$.agregarHijo($2.nodo);
                                                   traduccion += `${$2.traduccion}`;
                                               }
                                               $$ = {nodo: $$, traduccion: traduccion}
                                             }
                | tk_comentario LISTA_FUNCIONES_P 
                    {
                        $$ = new Nodo("LISTA_FUNC","LISTA_FUNC");

                        traduccion = `   ${$1}\n`;
                        if ($2) {
                            $$.agregarHijo($2.nodo);
                            traduccion += `${$2.traduccion}\n`;
                        }
                        $$ = {nodo: $$, traduccion: traduccion};

                    }
                | tk_multi_coment LISTA_FUNCIONES_P 
                    {
                        $$ = new Nodo("LISTA_FUNC","LISTA_FUNC");

                        traduccion = `   ${$1}\n`;
                        if ($2) {
                            $$.agregarHijo($2.nodo);
                            traduccion += `${$2.traduccion}\n`;
                        }
                        $$ = {nodo: $$, traduccion: traduccion};

                    }    
                | ;

FUNCION: tk_public TIPO tk_identificador tk_parentesis_izq LISTA_PARAMETROS tk_parentesis_der tk_punto_coma
    {
        $$ = new Nodo("FUNCION", "FUNCION");
        $$.agregarHijo(new Nodo("public", $1));
        $$.agregarHijo(new Nodo("TIPO", $2));
        $$.agregarHijo(new Nodo("id", $3));
        $$.agregarHijo($5.nodo);


        traduccion = `   function ${$3} (`;
        if($5){
            traduccion += `${$5.traduccion}`
        }
        traduccion += `){} \n\n`;
        $$ =  {nodo: $$, traduccion: traduccion}
    };

TIPO: tk_string   {$$ = $1}
    | tk_int      {$$ = $1}
    | tk_char     {$$ = $1}
    | tk_double   {$$ = $1}
    | tk_boolean  {$$ = $1}
    | tk_void     {$$ = $1};

LISTA_PARAMETROS: PARAMETRO LISTA_PARAMETROS_P { $$ = new Nodo("LISTA_PARAMS", "LISTA_PARAMS 1");
                                                 $$.agregarHijo($1.nodo);

                                                 traduccion = `${$1.traduccion}`;
                                                 if($2) {
                                                    $$.agregarHijo($2.nodo);
                                                    traduccion += `${$2.traduccion}`;
                                                 }
                                                 $$ =  {nodo: $$, traduccion: traduccion};
                                               }
                | ;

LISTA_PARAMETROS_P: tk_coma PARAMETRO LISTA_PARAMETROS_P { $$ = new Nodo("LISTA_PARAMS", "LISTA_PARAMS 2");
                                                           $$.agregarHijo($2.nodo);

                                                           traduccion = `,${$2.traduccion}`;
                                                           if($3) {
                                                               $$.agregarHijo($3.nodo);
                                                               traduccion += `${$3.traduccion}`;
                                                           }
                                                           $$ =  {nodo: $$, traduccion: traduccion}
                                                         }
                  | ;

PARAMETRO: TIPO_DATO tk_identificador { $$ = new Nodo("PARAMETRO", "PARAMETRO");
                                        $$.agregarHijo(new Nodo("TIPO DATO", $1));
                                        $$.agregarHijo(new Nodo("ID", $2));

                                        traduccion = `${$2}`;
                                        $$ =  {nodo: $$, traduccion: traduccion};
                                      };

TIPO_DATO: tk_string  {$$ = $1}
         | tk_int     {$$ = $1}
         | tk_char    {$$ = $1}
         | tk_double  {$$ = $1}
         | tk_boolean {$$ = $1};

INSTRUCCIONES_CLASE: DECLARACION_METODO INSTRUCCIONES_CLASE { $$ = new Nodo("INSTR_CLASS", "INSTR_CLASS");
                                                              $$.agregarHijo($1.nodo);

                                                              traduccion = $1.traduccion;
                                                              if ($2) {
                                                                  $$.agregarHijo($2.nodo);
                                                                  traduccion += $2.traduccion;
                                                              }
                                                              $$ = {nodo: $$, traduccion: traduccion};
                                                              
                                                            }
                    | DECLARACION_VARIABLES INSTRUCCIONES_CLASE { $$ = new Nodo("INSTR_CLASS", "INSTR_CLASS");
                                                                  $$.agregarHijo($1.nodo);

                                                                 traduccion = $1.traduccion;
                                                                 
                                                                 if ($2) {
                                                                    $$.agregarHijo($2.nodo);
                                                                    traduccion += $2.traduccion;
                                                                    
                                                                 }
                                                                $$ = {nodo: $$, traduccion: traduccion};
                                                              

                                                                }
                    | tk_comentario INSTRUCCIONES_CLASE 
                        {
                            $$ = new Nodo("INSTR_CLASS","INSTR_CLASS");

                            traduccion = `\n${$1}\n`;
                            if ($2) {
                                $$.agregarHijo($2.nodo);
                                traduccion += `${$2.traduccion}`;
                            }
                            $$ = {nodo: $$, traduccion: traduccion};

                    }
                    | tk_multi_coment INSTRUCCIONES_CLASE 
                        {
                            $$ = new Nodo("INSTR_CLASS","INSTR_CLASS");

                            traduccion = `\n${$1}\n`;
                            if ($2) {
                                $$.agregarHijo($2.nodo);
                                traduccion += `${$2.traduccion}`;
                            }
                            $$ = {nodo: $$, traduccion: traduccion};

                    }
                    
                   | ;

DECLARACION_METODO: tk_public METODO { $$ = new Nodo("DECL_METODO", "DECL_METODO");
                                       $$.agregarHijo(new Nodo("public", $1));
                                       $$.agregarHijo($2.nodo);

                                       $$ = {nodo: $$, traduccion: $2.traduccion};
                                     };

METODO: tk_static tk_void tk_main tk_parentesis_izq tk_string tk_corchete_izq tk_corchete_der tk_identificador tk_parentesis_der tk_llave_izq INSTRUCCIONES tk_llave_der
        {
            $$ = new Nodo("MAIN", "MAIN");
            $$.agregarHijo(new Nodo("static", $1));
            $$.agregarHijo(new Nodo("void", $2));
            $$.agregarHijo(new Nodo("main", $3));
            $$.agregarHijo(new Nodo("String", $5));
            $$.agregarHijo(new Nodo("ID", $8));

            traduccion = `function main (args) {\n`; 
            if($11) {
                $$.agregarHijo($11.nodo);
                $11.traduccion.split("\n").forEach(linea => {
                    if (linea != ""){
                        traduccion += "   " + linea + "\n";
                    }
                });
            }
            traduccion += `}\n\n`
            $$ = {nodo: $$, traduccion: traduccion}

        }
      | TIPO tk_identificador tk_parentesis_izq LISTA_PARAMETROS tk_parentesis_der tk_llave_izq INSTRUCCIONES tk_llave_der 
        {
            $$ = new Nodo("METODO", "METODO");
            $$.agregarHijo(new Nodo("TIPO",$1));
            $$.agregarHijo(new Nodo("ID", $2));

            traduccion = `function ${$2} (`; 
            if ($4) {
                $$.agregarHijo($4.nodo);
                traduccion += $4.traduccion;
            }
            traduccion += `) {\n`;
            if($7) {
                $$.agregarHijo($7.nodo);
                $7.traduccion.split("\n").forEach(linea => {
                    if (linea != ""){
                        traduccion += "   " + linea + "\n";
                    }
                });
            }
            traduccion += `}\n\n`
            $$ = {nodo: $$, traduccion: traduccion}

        }
        |   error tk_llave_der
        {   console.log("ERROR SINTACTICO 2-> LINEA: " + this._$.first_line);
            $$ = {nodo: new Nodo("",""), traduccion: ""}; 
            listaErrores.push(new Token("ERROR SINTACTICO", yytext, this._$.first_line, this._$.first_column)); 
        };


INSTRUCCIONES: DECLARACION_VARIABLES INSTRUCCIONES { $$ = new Nodo("INSTRUC", "INSTRUC");
                                                     $$.agregarHijo($1.nodo);
                                                     

                                                     traduccion = $1.traduccion;
                                                                 
                                                     if ($2) {
                                                        $$.agregarHijo($2.nodo);
                                                        traduccion += $2.traduccion;
                                                                    
                                                     }
                                                     $$ = {nodo: $$, traduccion: traduccion};

                                                   }    
             | IF INSTRUCCIONES                    { $$ = new Nodo("INSTRUC", "INSTRUC");
                                                     $$.agregarHijo($1.nodo);

                                                     traduccion = $1.traduccion;
                                                                 
                                                     if ($2) {
                                                        $$.agregarHijo($2.nodo);
                                                        traduccion += $2.traduccion;
                                                                    
                                                     }
                                                     $$ = {nodo: $$, traduccion: traduccion};

                                                   }
             | FOR INSTRUCCIONES                   { $$ = new Nodo("INSTRUC", "INSTRUC");
                                                     $$.agregarHijo($1.nodo);

                                                     traduccion = $1.traduccion;
                                                                 
                                                     if ($2) {
                                                        $$.agregarHijo($2.nodo);
                                                        traduccion += $2.traduccion;
                                                                    
                                                     }
                                                     $$ = {nodo: $$, traduccion: traduccion};
                                                   }
             | WHILE INSTRUCCIONES                 { $$ = new Nodo("INSTRUC", "INSTRUC");
                                                     $$.agregarHijo($1.nodo);

                                                     traduccion = $1.traduccion;
                                                                 
                                                     if ($2) {
                                                        $$.agregarHijo($2.nodo);
                                                        traduccion += $2.traduccion;
                                                                    
                                                     }
                                                     $$ = {nodo: $$, traduccion: traduccion};
                                                   }
             | DO INSTRUCCIONES                    { $$ = new Nodo("INSTRUC", "INSTRUC");
                                                     $$.agregarHijo($1.nodo);

                                                     traduccion = $1.traduccion;
                                                                 
                                                     if ($2) {
                                                        $$.agregarHijo($2.nodo);
                                                        traduccion += $2.traduccion;
                                                                    
                                                     }
                                                     $$ = {nodo: $$, traduccion: traduccion};
                                                   }
             | IMPRIMIR INSTRUCCIONES              { $$ = new Nodo("INSTRUC", "INSTRUC");
                                                     $$.agregarHijo($1.nodo);

                                                     traduccion = $1.traduccion;
                                                                 
                                                     if ($2) {
                                                        $$.agregarHijo($2.nodo);
                                                        traduccion += $2.traduccion;
                                                                    
                                                     }
                                                     $$ = {nodo: $$, traduccion: traduccion};
                                                   }
             | ASIGNACION INSTRUCCIONES            { $$ = new Nodo("INSTRUC", "INSTRUC");
                                                     $$.agregarHijo($1.nodo);

                                                     traduccion = $1.traduccion;
                                                                 
                                                     if ($2) {
                                                        $$.agregarHijo($2.nodo);
                                                        traduccion += $2.traduccion;
                                                                    
                                                     }
                                                     $$ = {nodo: $$, traduccion: traduccion};
                                                   }
             | LLAMAR_FUNCION tk_punto_coma INSTRUCCIONES { $$ = new Nodo("INSTRUC", "INSTRUC");
                                                            $$.agregarHijo($1.nodo);

                                                            traduccion = $1.traduccion + ";";
                                                                 
                                                            if ($3) {
                                                                $$.agregarHijo($3.nodo);
                                                                traduccion += $3.traduccion;
                                                                    
                                                            }

                                                            $$ = {nodo: $$, traduccion: traduccion};
                                                          }
             | tk_break tk_punto_coma   {   $$ = new Nodo("break", $1); 

                                            traduccion = `break;\n`;
                                            $$ = {nodo: $$, traduccion: traduccion};
                                        }
             | tk_continue tk_punto_coma{   $$ = new Nodo("continue", $1); 

                                            traduccion = `continue;\n`;
                                            $$ = {nodo: $$, traduccion: traduccion};
                                        }
             | RETURN
             | tk_comentario INSTRUCCIONES 
                        {
                            $$ = new Nodo("INSTRUCC","INSTRUCC");

                            traduccion = `\n${$1}\n`;
                            if ($2) {
                                $$.agregarHijo($2.nodo);
                                traduccion += `${$2.traduccion}`;
                            }
                            $$ = {nodo: $$, traduccion: traduccion};

                        }
            // | error tk_llave_der {console.log("ERROR DE M"); $$ = {nodo: new Nodo("",""), traduccion: ""}; listaErrores.push(new Token("ERROR", yytext)); }
             | ;

DECLARACION_VARIABLES: TIPO_DATO DECLARACION_VARIABLES_P tk_punto_coma { $$ = new Nodo("DECLA_VARIABLES", "DECLA_VARIABLES");
                                                                         $$.agregarHijo(new Nodo("TIPO DATO", $1));
                                                                         $$.agregarHijo($2.nodo);

                                                                         traduccion = `var ${$2.traduccion}; \n`;
                                                                         $$ = {nodo: $$, traduccion: traduccion};
                                                                         
                                                                        }
                                                                        | error tk_llave_der {
                                                                           console.log("ERROR SINTACTICO 3-> LINEA: " + this._$.first_line);
                                                                           $$ = {nodo: new Nodo("",""), traduccion: ""}; 
                                                                           listaErrores.push(new Token("ERROR SINTACTICO", yytext, this._$.first_line, this._$.first_column )); 
                                                                        }
                                                                       ;
                     

DECLARACION_VARIABLES_P: DECLARACION_VARIABLES_P tk_coma DECLARACION_VARIABLES_SP { $$ = new Nodo("DECLA_VARIABLES", "DECLA_VARIABLES");
                                                                                    $$.agregarHijo($1.nodo);
                                                                                    $$.agregarHijo($3.nodo);

                                                                                    traduccion = "";
                                                                                    if ($1) {
                                                                                        traduccion += $1.traduccion;
                                                                                    }
                                                                                    traduccion += ","
                                                                                    if($3){
                                                                                        traduccion += $3.traduccion;
                                                                                    }
                                                                                    $$ = {nodo: $$, traduccion: traduccion};
                                                                                  }
                       | DECLARACION_VARIABLES_SP { $$ = $1.nodo;

                                                    $$ = {nodo: $$, traduccion: $1.traduccion}
                                                  };

DECLARACION_VARIABLES_SP: tk_identificador tk_igual EXPRESION { $$ = new Nodo("DECLA_VARIABLES", "DECLA_VARIABLES"); 
                                                                $$.agregarHijo(new Nodo("ID", $1));
                                                                $$.agregarHijo($3.nodo);

                                                                traduccion = `${$1} = ${$3.traduccion}`
                                                                $$ = {nodo: $$, traduccion: traduccion};
                                                                
                                                              }
                        | tk_identificador { $$ = new Nodo("ID", $1);
                                             
                                             traduccion = `${$1}`;
                                             $$ = {nodo: $$, traduccion: traduccion};
                                           };


ASIGNACION: tk_identificador tk_igual EXPRESION tk_punto_coma { $$ = new Nodo("ASIGNACION", "ASIGNACION");
                                                                $$.agregarHijo(new Nodo("ID", $1));
                                                                $$.agregarHijo(new Nodo("IGUAL", $2));
                                                                $$.agregarHijo($3.nodo);

                                                                traduccion = `${$1} = ${$3.traduccion};\n`;
                                                                $$ = {nodo: $$, traduccion: traduccion};
                                                              }
          | tk_identificador tk_incremento tk_punto_coma      { $$ = new Nodo("INCREMENTO", "INCREMENTO");
                                                                $$.agregarHijo(new Nodo("ID", $1));
                                                                $$.agregarHijo(new Nodo("INCREMENTO", $2));

                                                                traduccion = `${$1}++;\n`;
                                                                $$ = {nodo: $$, traduccion: traduccion};
                                                              }
          | tk_identificador tk_decremento tk_punto_coma      { $$ = new Nodo("DECREMENTO", "DECREMENTO");
                                                                $$.agregarHijo(new Nodo("ID", $1));
                                                                $$.agregarHijo(new Nodo("DECREMENTO", $2));

                                                                traduccion = `${$1}--;\n`;
                                                                $$ = {nodo: $$, traduccion: traduccion};
                                                              };
          

IMPRIMIR: tk_imprimir tk_parentesis_izq EXPRESION tk_parentesis_der tk_punto_coma 
        {   $$ = new Nodo("IMPRIMIR", "IMPRIMIR");
            $$.agregarHijo(new Nodo("PRINT",$1));
            $$.agregarHijo($3.nodo);

            traduccion = `console.log(${$3.traduccion});\n`;
            $$ = {nodo: $$, traduccion: traduccion};

        };

RETURN: tk_return EXPRESION tk_punto_coma { $$ = new Nodo("RETURN", "RETURN");
                                            $$.agregarHijo(new Nodo("RETURN", $1));
                                            $$.agregarHijo($2.nodo);

                                            traduccion = `return ${$2.traduccion};\n`;
                                            $$ = {nodo: $$, traduccion: traduccion};
                                          }
      | tk_return tk_punto_coma           { $$ = new Nodo("RETURN", "RETURN");
                                            $$.agregarHijo(new Nodo("RETURN", $1));

                                            traduccion = `return;\n`;
                                            $$ = {nodo: $$, traduccion: traduccion};
                                          };  

IF: tk_if tk_parentesis_izq EXPRESION tk_parentesis_der tk_llave_izq INSTRUCCIONES tk_llave_der ELSE 
    {
        $$ = new Nodo("IF", "IF");
        $$.agregarHijo(new Nodo("if", $1));
        $$.agregarHijo($3.nodo);

        traduccion = `if (${$3.traduccion}) {\n`;
        if($6){
            $6.traduccion.split("\n").forEach(linea => {
                if (linea != ""){
                    traduccion += `   ${linea}\n`;
                }
            });
        }
        traduccion += `} `;
        if($8){
            traduccion += $8.traduccion;
        }
        $$ = {nodo: $$, traduccion: traduccion};

    };

ELSE: tk_else ELSE_IF { $$ = new Nodo("ELSE", "ELSE");
                        $$.agregarHijo(new Nodo("else", $1));
                        $$.agregarHijo($2.nodo);

                        traduccion = `${$1} ${$2.traduccion}`;
                        $$ = {nodo: $$, traduccion: traduccion};
                      }
    | ;

ELSE_IF: IF { $$ = $1.nodo;
            
              traduccion = $1.traduccion;
              $$ = {nodo: $$, traduccion: traduccion};
            }   
       | tk_llave_izq INSTRUCCIONES tk_llave_der { $$ = $2.nodo;
                                                   
                                                   traduccion = `{\n`;
                                                   if($2) {
                                                       $2.traduccion.split("\n").forEach(linea => {
                                                            if (linea != ""){
                                                                traduccion += `   ${linea}\n`;
                                                            }
                                                        });
                                                   }
                                                   traduccion += `}`;
                                                   $$ = {nodo: $$, traduccion: traduccion};
                                                 };

FOR: tk_for tk_parentesis_izq DECLARACION_VARIABLES EXPRESION tk_punto_coma tk_identificador INCREMENTO tk_parentesis_der tk_llave_izq INSTRUCCIONES tk_llave_der
    {
        $$ = new Nodo("FOR", "FOR");
        $$.agregarHijo(new Nodo("for", $1));
        $$.agregarHijo($3.nodo);
        $$.agregarHijo($4.nodo);
        $$.agregarHijo(new Nodo(";", $5));
        $$.agregarHijo(new Nodo("ID", $6));
        $$.agregarHijo($7.nodo);
        $$.agregarHijo($10.nodo);

        traduccion =  `for (${$3.traduccion.replace("\n","")}${$4.traduccion}; ${$6}${$7.traduccion}) {\n`;
        if($10) {
            $10.traduccion.split("\n").forEach(linea => {
                if (linea != ""){
                    traduccion += `   ${linea}\n`;
                }
            });
        }
        traduccion += `}\n`;
        $$ = {nodo: $$, traduccion: traduccion};

    };

WHILE: tk_while tk_parentesis_izq EXPRESION tk_parentesis_der tk_llave_izq INSTRUCCIONES tk_llave_der
    {
        $$ = new Nodo("WHILE", "WHILE");
        $$.agregarHijo(new Nodo("while", $1));
        $$.agregarHijo($3.nodo);
        $$.agregarHijo($6.nodo);

        traduccion = `while (${$3.traduccion}) {\n`;
        if($6) {
            $6.traduccion.split("\n").forEach(linea => {
                if (linea != ""){
                    traduccion += `   ${linea}\n`;
                }
            });
        }
        traduccion += `}\n`;
        $$ = {nodo: $$, traduccion: traduccion};
    };
    

DO: tk_do tk_llave_izq INSTRUCCIONES tk_llave_der tk_while tk_parentesis_izq EXPRESION tk_parentesis_der tk_punto_coma
    {
        $$ = new Nodo("DO", "DO");
        $$.agregarHijo(new Nodo("do", $1));
        $$.agregarHijo($3.nodo);
        $$.agregarHijo(new Nodo("while", $5));
        $$.agregarHijo($7.nodo);

        traduccion = `do {\n`;
        if($3) {
            $3.traduccion.split("\n").forEach(linea => {
                if (linea != ""){
                    traduccion += `   ${linea}\n`;
                }
            });
        }
        traduccion += `} while (${$7.traduccion});\n`;
        $$ = {nodo: $$, traduccion: traduccion};
    };

INCREMENTO: tk_incremento { $$ = new Nodo("INCREMENTO", "INCREMENTO"); 
                            $$.agregarHijo(new Nodo("incremento", $1));

                            traduccion = $1;
                            $$ = {nodo: $$, traduccion: traduccion};
                          }
          | tk_decremento { $$ = new Nodo("DECREMENTO", "DECREMENTO"); 
                            $$.agregarHijo(new Nodo("decremento", $1));

                            traduccion = $1;
                            $$ = {nodo: $$, traduccion: traduccion};
                          };

EXPRESION: tk_not EXPRESION                               { $$ = new Nodo("E", "E");
                                                            $$.agregarHijo(new Nodo("NOT", $1));
                                                            $$.agregarHijo($2.nodo);

                                                            traduccion = `!${$1.traduccion}`;
                                                            $$ = {nodo: $$, traduccion: traduccion};

                                                          }
         | tk_menos EXPRESION %prec UMENOS                { $$ = new Nodo("E", "E");
                                                            $$.agregarHijo(new Nodo("MENOS", $1));
                                                            $$.agregarHijo($2.nodo);

                                                            traduccion = `-${$1.traduccion}`;
                                                            $$ = {nodo: $$, traduccion: traduccion};
                                                          }
         | EXPRESION tk_mas EXPRESION                     { $$ = new Nodo("E", "E");
                                                            $$.agregarHijo($1.nodo);
                                                            $$.agregarHijo(new Nodo("MAS", $2));
                                                            $$.agregarHijo($3.nodo);

                                                            traduccion = `${$1.traduccion} + ${$3.traduccion}`;
                                                            $$ = {nodo: $$, traduccion: traduccion};
                                                          }
         | EXPRESION tk_menos EXPRESION                   { $$ = new Nodo("E", "E");
                                                            $$.agregarHijo($1.nodo);
                                                            $$.agregarHijo(new Nodo("MENOS", $2));
                                                            $$.agregarHijo($3.nodo);

                                                            traduccion = `${$1.traduccion} - ${$3.traduccion}`;
                                                            $$ = {nodo: $$, traduccion: traduccion};
                                                          }
         | EXPRESION tk_multiplicacion EXPRESION          { $$ = new Nodo("E", "E");
                                                            $$.agregarHijo($1.nodo);
                                                            $$.agregarHijo(new Nodo("MULTIPLICACION", $2));
                                                            $$.agregarHijo($3.nodo);

                                                            traduccion = `${$1.traduccion} * ${$3.traduccion}`;
                                                            $$ = {nodo: $$, traduccion: traduccion};
                                                          }
         | EXPRESION tk_division EXPRESION                { $$ = new Nodo("E", "E");
                                                            $$.agregarHijo($1.nodo);
                                                            $$.agregarHijo(new Nodo("DIVISION", $2));
                                                            $$.agregarHijo($3.nodo);

                                                            traduccion = `${$1.traduccion} / ${$3.traduccion}`;
                                                            $$ = {nodo: $$, traduccion: traduccion};
                                                          }
         | EXPRESION tk_xor EXPRESION                     { $$ = new Nodo("E", "E");
                                                            $$.agregarHijo($1.nodo);
                                                            $$.agregarHijo(new Nodo("XOR", $2));
                                                            $$.agregarHijo($3.nodo);

                                                            traduccion = `${$1.traduccion} ^ ${$3.traduccion}`;
                                                            $$ = {nodo: $$, traduccion: traduccion};
                                                          }
         | EXPRESION tk_and EXPRESION                     { $$ = new Nodo("E", "E");
                                                            $$.agregarHijo($1.nodo);
                                                            $$.agregarHijo(new Nodo("AND", $2));
                                                            $$.agregarHijo($3.nodo);

                                                            traduccion = `${$1.traduccion} && ${$3.traduccion}`;
                                                            $$ = {nodo: $$, traduccion: traduccion};
                                                          }
         | EXPRESION tk_or EXPRESION                      { $$ = new Nodo("E", "E");
                                                            $$.agregarHijo($1.nodo);
                                                            $$.agregarHijo(new Nodo("OR", $2));
                                                            $$.agregarHijo($3.nodo);

                                                            traduccion = `${$1.traduccion} || ${$3.traduccion}`;
                                                            $$ = {nodo: $$, traduccion: traduccion};
                                                          }
         | EXPRESION tk_doble_igual EXPRESION             { $$ = new Nodo("E", "E");
                                                            $$.agregarHijo($1.nodo);
                                                            $$.agregarHijo(new Nodo("DOBLE IGUAL", $2));
                                                            $$.agregarHijo($3.nodo);

                                                            traduccion = `${$1.traduccion} == ${$3.traduccion}`;
                                                            $$ = {nodo: $$, traduccion: traduccion};
                                                          }
         | EXPRESION tk_diferente_de EXPRESION            { $$ = new Nodo("E", "E");
                                                            $$.agregarHijo($1.nodo);
                                                            $$.agregarHijo(new Nodo("DIFERENTE DE", $2));
                                                            $$.agregarHijo($3.nodo);

                                                            traduccion = `${$1.traduccion} != ${$3.traduccion}`;
                                                            $$ = {nodo: $$, traduccion: traduccion};
                                                          }
         | EXPRESION tk_menor_igual EXPRESION             { $$ = new Nodo("E", "E");
                                                            $$.agregarHijo($1.nodo);
                                                            $$.agregarHijo(new Nodo("MENOR O IGUAL", $2));
                                                            $$.agregarHijo($3.nodo);

                                                            traduccion = `${$1.traduccion} <= ${$3.traduccion}`;
                                                            $$ = {nodo: $$, traduccion: traduccion};
                                                          }
         | EXPRESION tk_mayor_igual EXPRESION             { $$ = new Nodo("E", "E");
                                                            $$.agregarHijo($1.nodo);
                                                            $$.agregarHijo(new Nodo("MAYOR O IGUAL", $2));
                                                            $$.agregarHijo($3.nodo);

                                                            traduccion = `${$1.traduccion} >= ${$3.traduccion}`;
                                                            $$ = {nodo: $$, traduccion: traduccion};
                                                          }
         | EXPRESION tk_menor EXPRESION                   { $$ = new Nodo("E", "E");
                                                            $$.agregarHijo($1.nodo);
                                                            $$.agregarHijo(new Nodo("MENOR", $2));
                                                            $$.agregarHijo($3.nodo);

                                                            traduccion = `${$1.traduccion} < ${$3.traduccion}`;
                                                            $$ = {nodo: $$, traduccion: traduccion};
                                                          }
         | EXPRESION tk_mayor EXPRESION                   { $$ = new Nodo("E", "E");
                                                            $$.agregarHijo($1.nodo);
                                                            $$.agregarHijo(new Nodo("MAYOR", $2));
                                                            $$.agregarHijo($3.nodo);

                                                            traduccion = `${$1.traduccion} > ${$3.traduccion}`;
                                                            $$ = {nodo: $$, traduccion: traduccion};
                                                          }
         | tk_numero                                      { $$ = {nodo: new Nodo("NUMERO", $1), traduccion: $1}; }
         | tk_true                                        { $$ = {nodo: new Nodo("TRUE", $1), traduccion: $1}; }
         | tk_false                                       { $$ = {nodo: new Nodo("FALSE", $1), traduccion: $1}; }
         | tk_cadena                                      { $$ = {nodo: new Nodo("CADENA", $1), traduccion: $1}; }
         | tk_caracter                                    { $$ = {nodo: new Nodo("CARACTER", $1), traduccion: $1}; } 
         | tk_identificador                               { $$ = {nodo: new Nodo("IDENTIFICADOR", $1), traduccion: $1}; }
         | LLAMAR_FUNCION                                 { $$ = new Nodo("E", "E");
                                                            $$.agregarHijo($1.nodo);

                                                            $$ = {nodo: $$, traduccion: $1.traduccion};
                                                          }
         | tk_parentesis_izq EXPRESION tk_parentesis_der  { $$ = new Nodo("E", "E");
                                                            $$.agregarHijo($2.nodo);

                                                            traduccion = `(${$2.traduccion})`;
                                                            $$ = {nodo: $$, traduccion: traduccion}; 
                                                          };

LLAMAR_FUNCION: tk_identificador tk_parentesis_izq LISTA_EXPRESIONES tk_parentesis_der { $$ = new Nodo("LLAMAR_FUNCION", "LLAMAR_FUNCION");
                                                                                         $$.agregarHijo(new Nodo("ID",$1));

                                                                                         traduccion = `${$1}(`;
                                                                                         if($3){
                                                                                            $$.agregarHijo($3.nodo);
                                                                                             traduccion += $3.traduccion;
                                                                                         } 
                                                                                         traduccion  += `)`;
                                                                                         $$ = {nodo: $$, traduccion: traduccion};
                                                                                         
                                                                                       };

LISTA_EXPRESIONES: EXPRESION LISTA_EXPRESIONES_P  { $$ = new Nodo("L_EXPRESIONES", "L_EXPRESIONES");
                                                    $$.agregarHijo($1.nodo);

                                                    traduccion = $1.traduccion;
                                                    if ($2){
                                                        $$.agregarHijo($2.nodo);
                                                        traduccion += $2.traduccion;
                                                    }
                                                    $$ = {nodo: $$, traduccion: traduccion};
                                                  }
                 | ;

LISTA_EXPRESIONES_P: tk_coma EXPRESION LISTA_EXPRESIONES_P { 
                                                                $$ = new Nodo("L_EXPRESIONES", "L_EXPRESIONES");
                                                                $$.agregarHijo($2.nodo);

                                                                traduccion = `,${$2.traduccion}`;
                                                                if ($3) {
                                                                    $$.agregarHijo($3.nodo);
                                                                    traduccion += $3.traduccion;
                                                                }
                                                                $$ = {nodo: $$, traduccion: traduccion};
                                                           }
                   | ;
