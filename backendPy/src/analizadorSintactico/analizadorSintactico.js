const TipoToken = require('../analizadorLexico/tipoToken');
const Nodo = require('./nodoArbol');

class AnalizadorSintactico {

    constructor() {
        this.numToken = 0;
        this.tokenActual  = null;
        this.listaTokens = [];
        this.listaErrores = [];
        this.listaConsola = [];
        this.existeError = false;
        this.errorSintactico = false;
        this.txtTraducido = [];
        this.auxTraductor = "";
        this.ident = "";
        this.for = false;
        this.raiz = new Nodo("INICIO", "INICIO");
        this.arbolGraphviz = "";
        this.traduccion = "";
    }

    comparar(tipo) {
        return this.tokenActual.tipo == tipo;
    }

    match(tipo, lexema = this.tokenActual.lexema) {
        let str = "";
        if (this.errorSintactico) {
            // Modo Panico
            if (this.numToken < this.listaTokens.length - 1) {
                this.listaConsola.push(`[Modo Panico] Token: ${this.tokenActual.lexema} Linea: ${this.tokenActual.linea} `);
                this.numToken++;
                this.tokenActual = this.listaTokens[this.numToken];

                if (this.tokenActual.tipo == TipoToken.PUNTO_Y_COMA) {
                    this.errorSintactico = false;
                    this.listaConsola.push(`[Modo Panico] RECUPERADO CON ; en la linea ${this.tokenActual.linea}`);
                }
            }
        } else {
            // Metodo Parea
            if (this.comparar(tipo) && lexema == this.tokenActual.lexema) {
                // console.log(`${lexema} === ${this.tokenActual.lexema}`);
                if (this.numToken < this.listaTokens.length - 1) {
                    this.numToken++;
                    this.tokenActual = this.listaTokens[this.numToken];
                    while((this.comparar(TipoToken.COMENTARIO_MULTILINEA) || this.comparar(TipoToken.COMENTARIO_UNILINEA)) && this.numToken < this.listaTokens.length - 1) {
                        if (this.comparar(TipoToken.COMENTARIO_UNILINEA)) {
                            str += this.tokenActual.lexema.replace("//","#") + "\n\n";
                        } else if (this.comparar(TipoToken.COMENTARIO_MULTILINEA)) { 
                            str += this.tokenActual.lexema.replace("/*","'''").replace("*/","'''") + "\n\n";
                        }
                        this.numToken++;
                        this.tokenActual = this.listaTokens[this.numToken];
                    }  
                }
            } else {
                this.errorSintact(this.tipoError(tipo));
            }
        }
        return str;
    }

    errorSintact(msg) {
        // console.log(`<<<Error Sintactico>>> Caracter: ${this.tokenActual.lexema} se esperaba ${this.tipoError(tipo)}`)
        this.listaConsola.push(`<<<Error Sintactico>>> Se encontro ${this.tokenActual.lexema} y se esperaba ${msg} en la linea ${this.tokenActual.linea - 1}`);
        this.listaErrores.push({
            linea: this.tokenActual.linea,
            columna: this.tokenActual.columna,
            descripcion: `Se encontro ${this.tokenActual.lexema} y se esperaba ${msg}`
        });
        this.errorSintactico = true;
        this.existeError = true;
    }


    analizar(listaTokens) {
        this.listaTokens = listaTokens;
        this.numToken = 0;
        this.tokenActual = this.listaTokens[this.numToken];

        this.traduccion = this.INICIO(this.raiz);
        this.arbolGraphviz += `digraph reporte { \n${this.generarArbol(this.raiz)} \n}`;

        this.listaConsola.push(this.existeError ? "El analisis sintactico es incorrecto" : "El analisis sintactico fue correcto");
        console.log(this.existeError ? "El analisis sintactico es incorrecto" : "El analisis sintactico fue correcto")
    
        console.log(this.arbolGraphviz);
    }

    generarArbol(raiz) {
        let pila = [raiz]
        let cont = 0;
        let i = 1;
        let str = "";

        while (pila.length > 0) {
            let n = pila.shift();
            // console.log(`   nodo_${cont}[label="${n.valor}"];`);
            str += `   nodo_${cont}[label="${n.valor}"]; \n`;
            
            if (n.hijos) {
                n.hijos.forEach(hijo => {
                    // console.log(`   nodo_${cont} -> nodo_${i++}`);
                    str += `   nodo_${cont} -> nodo_${i++}; \n`
                });
                pila.push(...n.hijos);
            }
            cont++;
            
        }

        return str;

    }

    INICIO(raiz) {
        let str = "";

        if (this.comparar(TipoToken.COMENTARIO_UNILINEA)) {
            let nodo = new Nodo("Comentario", this.tokenActual.lexema);
            raiz.agregarHijo(nodo);

            str += `${this.ident}${this.tokenActual.lexema.replace("//","#") + "\n"}`;
            str += this.match(TipoToken.COMENTARIO_UNILINEA);
        } else if (this.comparar(TipoToken.COMENTARIO_MULTILINEA)) {
            let nodo = new Nodo("Comentario", this.tokenActual.lexema);
            raiz.agregarHijo(nodo);

            str += `${this.ident}${this.tokenActual.lexema.replace("/*","'''").replace("*/","'''")  + "\n"}`;
            str += this.match(TipoToken.COMENTARIO_MULTILINEA);
        }

        str += this.LISTA_PLANTILLAS(raiz);

        return str;
    }

    LISTA_PLANTILLAS(raiz) {
        let str = "";

        str += this.PLANTILLA(raiz);
        str += this.LISTA_PLANTILLAS_P(raiz);

        return str;
    }

    LISTA_PLANTILLAS_P(raiz) {
        let str = "";

        if (this.comparar(TipoToken.MODIFICADOR)) {
            str += this.PLANTILLA(raiz);
            str += this.LISTA_PLANTILLAS_P(raiz);
        } else {
            // epsilon
        }

        return str;
    }

    PLANTILLA(raiz) {
        let str = "";

        let nodo = new Nodo("PLANTILLA", "PLANTILLA");
        
        nodo.agregarHijo(new Nodo("MODIFICADOR", this.tokenActual.lexema));
        str += this.match(TipoToken.MODIFICADOR);
        str += this.TIPO_PLANTILLA(nodo) + "\n";
        
        if (nodo.hijos.length > 0) {
            raiz.agregarHijo(nodo);
        }

        return str;
    }

    TIPO_PLANTILLA(raiz) {
        let str = "";
        // let nodo = new Nodo("TIPO PLANTILLA", "TIPO PLANTILLA", this.tokenActual.fila, this.tokenActual.columna);

        if (this.tokenActual.lexema == "class") { 
            raiz.agregarHijo(new Nodo("PALABRA RESERVADA", this.tokenActual.lexema));
            str += `${this.ident}${this.tokenActual.lexema} `;
            str += this.match(TipoToken.PALABRA_RESERVADA, "class");

            let nodoID = new Nodo("ID", "ID");
            nodoID.agregarHijo(new Nodo("ID", this.tokenActual.lexema));
            raiz.agregarHijo(nodoID);
            str += `${this.tokenActual.lexema}: \n`
            str += this.match(TipoToken.IDENTIFICADOR);

            raiz.agregarHijo(new Nodo("LLAVE IZQUIERDA", this.tokenActual.lexema));
            str += this.match(TipoToken.LLAVE_IZQUIERDA);

            let nodoInstrucciones = new Nodo("INSTRUCCIONES CLASE", "INSTRUCCIONES CLASE");
            this.ident += "  ";
            str += this.INSTRUCCIONES_CLASE(nodoInstrucciones);
            this.ident = this.ident.slice(2);
            raiz.agregarHijo(nodoInstrucciones);

            str += `\n`
            raiz.agregarHijo(new Nodo("LLAVE DERECHA", this.tokenActual.lexema));
            str += this.match(TipoToken.LLAVE_DERECHA);
        } else if (this.tokenActual.lexema == "interface") {
            raiz.agregarHijo(new Nodo("PALABRA RESERVADA", this.tokenActual.lexema));
            str += `${this.ident}class `;
            str += this.match(TipoToken.PALABRA_RESERVADA, "interface");

            let nodoID = new Nodo("ID", "ID");
            nodoID.agregarHijo(new Nodo("ID", this.tokenActual.lexema));
            raiz.agregarHijo(nodoID);
            str += `${this.tokenActual.lexema}: \n`
            str += this.match(TipoToken.IDENTIFICADOR);

            raiz.agregarHijo(new Nodo("LLAVE IZQUIERDA", this.tokenActual.lexema));
            str += this.match(TipoToken.LLAVE_IZQUIERDA);

            let nodoListaFunciones = new Nodo("LISTA FUNCIONES", "LISTA FUNCIONES");
            this.ident += "  ";
            str += this.LISTA_FUNCIONES(nodoListaFunciones);
            this.ident = this.ident.slice(2);
            raiz.agregarHijo(nodoListaFunciones);

            str += `\n`
            raiz.agregarHijo(new Nodo("LLAVE DERECHA", this.tokenActual.lexema));
            str += this.match(TipoToken.LLAVE_DERECHA);
        } else {
            this.errorSintact();
            str = "";
        } 

        return str;
    }

    LISTA_FUNCIONES(nodo) {
        let str = ""
        if (this.comparar(TipoToken.MODIFICADOR)) {
            str += this.FUNCION(nodo);
            str += this.LISTA_FUNCIONES_P(nodo);
        } else {
            // epsilon
        }
        return str;
    }

    LISTA_FUNCIONES_P(nodo) {
        let str = "";
        if (this.comparar(TipoToken.MODIFICADOR)) {
            str += this.FUNCION(nodo);
            str += this.LISTA_FUNCIONES_P(nodo);
        } else {
            // epsilon
        }
        return str;
    }

    FUNCION(nodo) {
        let str = "";
        let nodoFuncion = new Nodo("FUNCION", "FUNCION");

        nodoFuncion.agregarHijo(new Nodo("MODIFICADOR", this.tokenActual.lexema));
        str += `${this.ident}def `
        str += this.match(TipoToken.MODIFICADOR);

        let nodoTipo = new Nodo("TIPO", "TIPO");
        str += this.TIPO(nodoTipo);
        nodoFuncion.agregarHijo(nodoTipo);

        let nodoID = new Nodo("ID", "ID");
        nodoID.agregarHijo(new Nodo("IDENTIFICADOR", this.tokenActual.lexema));
        nodoFuncion.agregarHijo(nodoID);
        str += `${this.tokenActual.lexema}`
        str += this.match(TipoToken.IDENTIFICADOR);

        nodoFuncion.agregarHijo(new Nodo("PARENTESIS IZQUIERDO", this.tokenActual.lexema));
        str += `${this.tokenActual.lexema}`
        str += this.match(TipoToken.PARENTESIS_IZQUIERDO);

        let nodoListaParametros = new Nodo("LISTA PARAMETROS", "LISTA PARAMETROS");
        str += this.LISTA_PARAMETROS(nodoListaParametros);
        nodoFuncion.agregarHijo(nodoListaParametros);

        nodoFuncion.agregarHijo(new Nodo("PARENTESIS DERECHO", this.tokenActual.lexema));
        str += `${this.tokenActual.lexema} `
        str += this.match(TipoToken.PARENTESIS_DERECHO);

        nodoFuncion.agregarHijo(new Nodo("PUNTO Y COMA", this.tokenActual.lexema));
        str += `\n\n`
        str += this.match(TipoToken.PUNTO_Y_COMA);

        if (nodoFuncion.hijos.length > 0) {
            nodo.agregarHijo(nodoFuncion);
        }

        return str;
    }

    INSTRUCCIONES_CLASE(nodo) {
        let str = "";
        if (this.comparar(TipoToken.MODIFICADOR)) {
            str += this.DECLARACION_METODO(nodo);
            str += this.INSTRUCCIONES_CLASE(nodo);
        } else if (this.comparar(TipoToken.TIPO)) {
            str += this.DECLARACION_VARIABLES(nodo) + "\n";
            str += this.INSTRUCCIONES_CLASE(nodo);
        }  else if (this.comparar(TipoToken.IDENTIFICADOR)) {
            str += this.ASIGN_LLAMADA(nodo);
            str += this.INSTRUCCIONES_CLASE(nodo);
        } else {
            str += this.INSTRUCCIONES(nodo);
        }
        return str ;
    }

    DECLARACION_METODO(nodo) {
        let str = "";

        let nodoMetodo = new Nodo("METODO", "METODO");
        nodoMetodo.agregarHijo(new Nodo("MODIFICADOR", this.tokenActual.lexema));
        str += this.match(TipoToken.MODIFICADOR);
        str += this.METODO(nodoMetodo);

        if (nodoMetodo.hijos.length > 0) {
            nodo.agregarHijo(nodoMetodo)
        }
        

        return str;
    }

    METODO(nodo) {
        let str = "";
        if (this.tokenActual.lexema == "static") {
            nodo.agregarHijo(new Nodo("PALABRA RESERVADA", this.tokenActual.lexema));
            str += this.match(TipoToken.PALABRA_RESERVADA, "static");

            nodo.agregarHijo(new Nodo("PALABRA RESERVADA", this.tokenActual.lexema));
            str += this.match(TipoToken.PALABRA_RESERVADA, "void");

            nodo.agregarHijo(new Nodo("PALABRA RESERVADA", this.tokenActual.lexema));
            str += `${this.ident}def ${this.tokenActual.lexema}`
            str += this.match(TipoToken.PALABRA_RESERVADA, "main");

            nodo.agregarHijo(new Nodo("(", this.tokenActual.lexema));
            str += `${this.tokenActual.lexema}`
            str += this.match(TipoToken.PARENTESIS_IZQUIERDO);

            nodo.agregarHijo(new Nodo("TIPO", this.tokenActual.lexema));
            str += this.match(TipoToken.TIPO, "String");

            nodo.agregarHijo(new Nodo("[", this.tokenActual.lexema));
            str += this.match(TipoToken.CORCHETE_IZQUIERDO);

            nodo.agregarHijo(new Nodo("]", this.tokenActual.lexema));
            str += this.match(TipoToken.CORCHETE_DERECHO);

            let nodoID = new Nodo("ID", "ID");
            nodoID.agregarHijo(new Nodo("PALABRA RESERVADA", this.tokenActual.lexema));
            nodo.agregarHijo(nodoID);
            str += this.match(TipoToken.IDENTIFICADOR);

            str += `${this.tokenActual.lexema}: \n`;
            nodo.agregarHijo(new Nodo(")", this.tokenActual.lexema));
            str += this.match(TipoToken.PARENTESIS_DERECHO);

            nodo.agregarHijo(new Nodo("{", this.tokenActual.lexema));
            str += this.match(TipoToken.LLAVE_IZQUIERDA);

            
            this.ident += "  ";
            let ins = this.INSTRUCCIONES(nodo);
            if (ins) {
                str += `${ins}`;
            } else {
                str += `${this.ident}pass\n`;
            }
            this.ident = this.ident.slice(2);

            str += `\n`;
            nodo.agregarHijo(new Nodo("}", this.tokenActual.lexema));
            str += this.match(TipoToken.LLAVE_DERECHA);
        } else if (this.comparar(TipoToken.TIPO) || this.tokenActual.lexema == "void") {
            this.TIPO(nodo);

            let nodoID = new Nodo("ID", "ID");
            nodoID.agregarHijo(new Nodo("PALABRA RESERVADA", this.tokenActual.lexema));
            nodo.agregarHijo(nodoID);
            str += `${this.ident}def ${this.tokenActual.lexema}`
            str += this.match(TipoToken.IDENTIFICADOR);

            nodo.agregarHijo(new Nodo("(", this.tokenActual.lexema));
            str += `${this.tokenActual.lexema}`
            str += this.match(TipoToken.PARENTESIS_IZQUIERDO);

            let nodoListaParametros = new Nodo("LISTA PARAMETROS", "LISTA PARAMETROS");
            str += this.LISTA_PARAMETROS(nodoListaParametros);
            nodo.agregarHijo(nodoListaParametros);

            str += `${this.tokenActual.lexema}: \n`
            nodo.agregarHijo(new Nodo(")", this.tokenActual.lexema));
            str += this.match(TipoToken.PARENTESIS_DERECHO);

            nodo.agregarHijo(new Nodo("{", this.tokenActual.lexema));
            str += this.match(TipoToken.LLAVE_IZQUIERDA);

            
            this.ident += "  ";
            let ins = this.INSTRUCCIONES(nodo);
            if (ins) {
                str += `${ins}`;
            } else {
                str += `${this.ident}pass\n`;
            }
            this.ident = this.ident.slice(2);


            str += `\n`;
            nodo.agregarHijo(new Nodo("}", this.tokenActual.lexema));
            str += this.match(TipoToken.LLAVE_DERECHA);
        } else {
            this.errorSintact();
            str = "";
        }
        return str; 
    }

    TIPO(nodoTipo) {
        let str = "";
        if (this.comparar(TipoToken.TIPO)) {
            nodoTipo.agregarHijo(new Nodo("TIPO", this.tokenActual.lexema));
            str += this.match(TipoToken.TIPO)
        } else if (this.tokenActual.lexema == "void") {
            nodoTipo.agregarHijo(new Nodo("TIPO", this.tokenActual.lexema));
            str += this.match(TipoToken.PALABRA_RESERVADA, "void")
        } else {
            this.errorSintact();
        }
        return str;
    }

    ASIGN_LLAMADA(nodo) {
        let str = "";
        let nodoAsing = new Nodo("ASIGN_LLAMADA","ASIGN_LLAMADA");

        if (this.comparar(TipoToken.IDENTIFICADOR)) {
            let nodoID = new Nodo("ID", "ID");
            nodoID.agregarHijo(new Nodo("ID", this.tokenActual.lexema));
            nodoAsing.agregarHijo(nodoID);
            str += `${this.ident}${this.tokenActual.lexema}`
            str += this.match(TipoToken.IDENTIFICADOR);

            str += this.CAR(nodoAsing);
        } else {
            // epsilon
        }

        if (nodoAsing.hijos.length > 0) {
            nodo.agregarHijo(nodoAsing);
        }

        return str;
    }

    CAR(nodo) {
        let str = "";
        if (this.comparar(TipoToken.IGUAL)) {
            nodo.agregarHijo(new Nodo("=", this.tokenActual.lexema));
            str += ` ${this.tokenActual.lexema} `
            str += this.match(TipoToken.IGUAL);

            str += this.EXPRESION(nodo);

            str += `\n\n`
            nodo.agregarHijo(new Nodo("=", this.tokenActual.lexema));
            str += this.match(TipoToken.PUNTO_Y_COMA);
        } else if (this.comparar(TipoToken.PARENTESIS_IZQUIERDO)) {

            nodo.agregarHijo(new Nodo("(", this.tokenActual.lexema));
            str += `${this.tokenActual.lexema}`
            str += this.match(TipoToken.PARENTESIS_IZQUIERDO);

            str += this.LISTA_EXPRESIONES(nodo);

            nodo.agregarHijo(new Nodo(")", this.tokenActual.lexema));
            str += `${this.tokenActual.lexema}`
            str += this.match(TipoToken.PARENTESIS_DERECHO);

            str += `\n\n`
            nodo.agregarHijo(new Nodo(";", this.tokenActual.lexema));
            str += this.match(TipoToken.PUNTO_Y_COMA);
        } else if (this.comparar(TipoToken.MAS)) {
            nodo.agregarHijo(new Nodo("+", this.tokenActual.lexema));
            str += `${this.tokenActual.lexema}`
            str += this.match(TipoToken.MAS);

            nodo.agregarHijo(new Nodo("+", this.tokenActual.lexema));
            str += `${this.tokenActual.lexema}`
            str += this.match(TipoToken.MAS);

            nodo.agregarHijo(new Nodo(";", this.tokenActual.lexema));
            str += `\n\n`
            str += this.match(TipoToken.PUNTO_Y_COMA);
        } else if (this.comparar(TipoToken.MENOS)) {
            nodo.agregarHijo(new Nodo("-", this.tokenActual.lexema));
            str += `${this.tokenActual.lexema}`
            str += this.match(TipoToken.MENOS);

            nodo.agregarHijo(new Nodo("-", this.tokenActual.lexema));
            str += `${this.tokenActual.lexema}`
            str += this.match(TipoToken.MENOS);

            nodo.agregarHijo(new Nodo(";", this.tokenActual.lexema));
            str += `\n\n`
            str += this.match(TipoToken.PUNTO_Y_COMA);
        } else {
            this.errorSintact();
        }
        return str;
    }

    INSTRUCCIONES(nodo) {
        let str = "";
        let nodoInstrucciones = new Nodo("INSTRUCCIONES", "INSTRUCCIONES");

        if (this.comparar(TipoToken.TIPO)) {
            str += this.DECLARACION_VARIABLES(nodoInstrucciones);
            str += this.INSTRUCCIONES(nodoInstrucciones);
        } else if (this.comparar(TipoToken.MODIFICADOR)) {
            str += this.DECLARACION_METODO(nodoInstrucciones);
            str += this.INSTRUCCIONES(nodoInstrucciones);
        } else if (this.tokenActual.lexema == "if") {
            str += this.IF(nodoInstrucciones);
            str += this.INSTRUCCIONES(nodoInstrucciones);
        } else if (this.tokenActual.lexema == "for") {
            str += this.FOR(nodoInstrucciones);
            str += this.INSTRUCCIONES(nodoInstrucciones);
        } else if (this.tokenActual.lexema == "while") {
            str += this.WHILE(nodoInstrucciones);
            str += this.INSTRUCCIONES(nodoInstrucciones);
        } else if (this.tokenActual.lexema == "do") {
            str += this.DO(nodoInstrucciones);
            str += this.INSTRUCCIONES(nodoInstrucciones);
        } else if (this.tokenActual.lexema == "System") {
            str += this.IMPRIMIR(nodoInstrucciones);
            str += this.INSTRUCCIONES(nodoInstrucciones);
        } else if (this.tokenActual.lexema == "return") {
            nodoInstrucciones.agregarHijo(new Nodo("return", this.tokenActual.lexema));
            str += `${this.ident}${this.tokenActual.lexema} `
            str += this.match(TipoToken.PALABRA_RESERVADA, "return");

            str += this.EXPRESION(nodoInstrucciones);

            str += "\n";
            nodoInstrucciones.agregarHijo(new Nodo(";", this.tokenActual.lexema));
            str += this.match(TipoToken.PUNTO_Y_COMA);

        } else if (this.tokenActual.lexema == "break") {
            nodoInstrucciones.agregarHijo(new Nodo("break", this.tokenActual.lexema));
            str += `${this.ident}${this.tokenActual.lexema}\n`
            str += this.match(TipoToken.PALABRA_RESERVADA, "break");

            nodoInstrucciones.agregarHijo(new Nodo(";", this.tokenActual.lexema));
            str += this.match(TipoToken.PUNTO_Y_COMA);
        } else if (this.tokenActual.lexema == "continue") {
            nodoInstrucciones.agregarHijo(new Nodo("continue", this.tokenActual.lexema));
            str += `${this.ident}${this.tokenActual.lexema}\n`
            str += this.match(TipoToken.PALABRA_RESERVADA, "continue");

            nodoInstrucciones.agregarHijo(new Nodo(";", this.tokenActual.lexema));
            str += this.match(TipoToken.PUNTO_Y_COMA);
        } else if (this.comparar(TipoToken.IDENTIFICADOR)) {
            str += this.ASIGN_LLAMADA(nodoInstrucciones);
            str += this.INSTRUCCIONES(nodoInstrucciones);
        } else {
            // epsilon
        }

        if (nodoInstrucciones.hijos.length > 0) {
            nodo.agregarHijo(nodoInstrucciones);
        }

        return str;
    }

    DECLARACION_VARIABLES(nodo) {
        let str = "";
        let nodoDeclaracionVar = new Nodo("DECLARACION VARIABLES", "DECLARACION VARIABLES");

        if (!this.for) {
            str += `${this.ident}var `
        }

        let nodoTipoDato = new Nodo("TIPO DATO", "TIPO DATO");
        this.TIPO_DATO(nodoTipoDato);
        nodoDeclaracionVar.agregarHijo(nodoTipoDato);

        let nodoID = new Nodo("ID", "ID");
        nodoID.agregarHijo(new Nodo("PALABRA RESERVADA", this.tokenActual.lexema));
        nodoDeclaracionVar.agregarHijo(nodoID);
        str += `${this.tokenActual.lexema} `
        str += this.match(TipoToken.IDENTIFICADOR);

        str += this.ASIGNACION(nodoDeclaracionVar);

        let nodoListaVariables = new Nodo("LISTA VARIABLES","LISTA VARIABLES");
        str += this.LISTA_VARIABLES(nodoListaVariables);
        if (nodoListaVariables.hijos.length > 0) {
            nodoDeclaracionVar.agregarHijo(nodoListaVariables);
        }
        
        if (!this.for) {
            nodoDeclaracionVar.agregarHijo(new Nodo(";", this.tokenActual.lexema));
            str += `\n`;
            str += this.match(TipoToken.PUNTO_Y_COMA);
        }
        
        if (nodoDeclaracionVar.hijos.length > 0) {
            nodo.agregarHijo(nodoDeclaracionVar);
        }

        return str;
    }

    ASIGNACION(nodo) {
        let str = "";

        if (this.comparar(TipoToken.IGUAL)) {
            let nodoAsignacion = new Nodo("ASIGNACION", "ASIGNACION");
            nodoAsignacion.agregarHijo(new Nodo("=", this.tokenActual.lexema));
            
            str += `${this.tokenActual.lexema} `;
            str += this.match(TipoToken.IGUAL);

            str += this.EXPRESION(nodoAsignacion);

            if (nodoAsignacion.hijos.length > 0) {
                nodo.agregarHijo(nodoAsignacion);
            }

        } else {
            // epsilon
        }

        return str;
    }

    LISTA_VARIABLES(nodo) {
        let str = "";

        if (this.comparar(TipoToken.COMA)) {
            str += `${this.tokenActual.lexema} `
            str += this.match(TipoToken.COMA);

            let nodoID = new Nodo("ID", "ID")
            nodoID.agregarHijo(new Nodo("ID", this.tokenActual.lexema));
            nodo.agregarHijo(nodoID);
            str += `${this.tokenActual.lexema} `
            str += this.match(TipoToken.IDENTIFICADOR);

            str += this.ASIGNACION(nodo);
            str += this.LISTA_VARIABLES(nodo);
        } else {
            // epsilon
        }

        return str;
    }

    LISTA_PARAMETROS(nodo) {
        let str = "";
        if (this.comparar(TipoToken.TIPO)) {
            str += this.PARAMETRO(nodo);
            str += this.LISTA_PARAMETROS_P(nodo);
        } else {
            // epsilon
        }
        return str;
    }

    PARAMETRO(nodo) {
        let str = "";
        let nodoParametro = new Nodo("PARAMETRO", "PARAMETRO");

        let nodoTipoDato = new Nodo("TIPO DATO", "TIPO DATO");
        this.TIPO_DATO(nodoTipoDato);
        nodoParametro.agregarHijo(nodoTipoDato);

        let nodoID = new Nodo("IDENTIFICADOR", "ID");
        nodoID.agregarHijo(new Nodo("IDENTIFICADOR", this.tokenActual.lexema));
        nodoParametro.agregarHijo(nodoID);
        str += `${this.tokenActual.lexema}`;
        str += this.match(TipoToken.IDENTIFICADOR);

        if (nodoParametro.hijos.length > 0) {
            nodo.agregarHijo(nodoParametro);
        }

        return str;
    }

    LISTA_PARAMETROS_P(nodo) {
        let str = "";

        if (this.comparar(TipoToken.COMA)) {
            str += `${this.tokenActual.lexema}`
            str += this.match(TipoToken.COMA);

            str += this.PARAMETRO(nodo);
            str += this.LISTA_PARAMETROS_P(nodo);
        } else {
            // epsilon
        }

        return str;
    }

    TIPO_DATO(nodo) {
        let str = "";
        if (this.comparar(TipoToken.TIPO)) {
            nodo.agregarHijo(new Nodo("TIPO", this.tokenActual.lexema));
            str += this.match(TipoToken.TIPO);
        } else {
            this.errorSintact();
        }
        return str;
    }

    IF(nodo) {
        let str = "";
        let nodoIF = new Nodo("IF","IF");

        nodoIF.agregarHijo(new Nodo("if", this.tokenActual.lexema));
        str += `${this.ident}${this.tokenActual.lexema} `
        str += this.match(TipoToken.SENTENCIA_CONTROL, "if");

        nodoIF.agregarHijo(new Nodo("(", this.tokenActual.lexema));
        str += this.match(TipoToken.PARENTESIS_IZQUIERDO);
        
        str += this.EXPRESION(nodoIF)
        
        str += `: \n`
        nodoIF.agregarHijo(new Nodo(")", this.tokenActual.lexema));
        str += this.match(TipoToken.PARENTESIS_DERECHO);

        nodoIF.agregarHijo(new Nodo("{", this.tokenActual.lexema));
        str += this.match(TipoToken.LLAVE_IZQUIERDA);

        this.ident += "  ";
        let ins = this.INSTRUCCIONES(nodoIF);
        if (ins) {
            str += `${ins}`;
        } else {
            str += `${this.ident}pass\n`;
        }
        this.ident = this.ident.slice(2);

        nodoIF.agregarHijo(new Nodo("}", this.tokenActual.lexema));
        str += this.match(TipoToken.LLAVE_DERECHA);
        str += this.ELSE(nodoIF);

        if (nodoIF.hijos.length > 0) {
            nodo.agregarHijo(nodoIF);
        }

        return str.split(`else${this.ident}if`).join("elif");
    }

    ELSE(nodo) {
        let str = "";
        let nodoELSE = new Nodo("ELSE", "ELSE");

        if (this.tokenActual.lexema == "else") {
            nodoELSE.agregarHijo(new Nodo("else", this.tokenActual.lexema));
            str += `${this.ident}${this.tokenActual.lexema}`
            str += this.match(TipoToken.SENTENCIA_CONTROL, "else");
            str += this.ELSE_P(nodoELSE);
        } else {
            // epsilon
        }

        if (nodoELSE.hijos.length > 0) {
            nodo.agregarHijo(nodoELSE);
        }

        return str;
    }

    ELSE_P(nodo) {
        let str = "";
        
        if (this.tokenActual.lexema == "if") {
            str += this.IF(nodo);
        } else if (this.comparar(TipoToken.LLAVE_IZQUIERDA)) {
            nodo.agregarHijo(new Nodo("{", this.tokenActual.lexema));
            str += `: \n `
            str += this.match(TipoToken.LLAVE_IZQUIERDA);

            
            this.ident += "  ";
            let ins = this.INSTRUCCIONES(nodo);
            if (ins) {
                str += `${ins}`;
            } else {
                str += `${this.ident}pass\n`;
            }
            this.ident = this.ident.slice(2);

            nodo.agregarHijo(new Nodo("}", this.tokenActual.lexema));
            str += `\n`
            str += this.match(TipoToken.LLAVE_DERECHA);
        }else {
            this.errorSintact();
            str = "";
        }

        return str;
    }

    FOR(nodo) {
        let str = "";
        this.for = true;
        let nodoFOR = new Nodo("FOR", "FOR");

        nodoFOR.agregarHijo(new Nodo("for", this.tokenActual.lexema))
        str += `${this.ident}${this.tokenActual.lexema} `
        str += this.match(TipoToken.SENTENCIA_REPETICION, "for");

        nodoFOR.agregarHijo(new Nodo("(", this.tokenActual.lexema))
        str += this.match(TipoToken.PARENTESIS_IZQUIERDO);

        let s = this.DECLARACION_VARIABLES(nodoFOR).replace(/ var/g, "");
        s = s.split("=");
        str += `${s[0]}`

        nodoFOR.agregarHijo(new Nodo(";", this.tokenActual.lexema));
        str += `in range (${s[1].trim()},`
        str += this.match(TipoToken.PUNTO_Y_COMA);
        this.for = false;
        
        this.for = true;
        str += this.EXPRESION(nodoFOR);
        this.for = false;

        nodoFOR.agregarHijo(new Nodo(";", this.tokenActual.lexema));
        str += this.match(TipoToken.PUNTO_Y_COMA);

        let nodoID = new Nodo("ID", "ID");
        nodoID.agregarHijo(new Nodo("ID", this.tokenActual.lexema));
        str += this.match(TipoToken.IDENTIFICADOR);
        nodoFOR.agregarHijo(nodoID);

        this.INCREMENTO(nodoFOR);
        
        nodoFOR.agregarHijo(new Nodo(")", this.tokenActual.lexema));
        str += this.match(TipoToken.PARENTESIS_DERECHO);
        
        nodoFOR.agregarHijo(new Nodo("{", this.tokenActual.lexema));
        str += `): \n`
        str += this.match(TipoToken.LLAVE_IZQUIERDA);

        this.ident += "  ";
        let ins = this.INSTRUCCIONES(nodoFOR);
        if (ins) {
            str += `${ins}`;
        } else {
            str += `${this.ident}pass\n`;
        }
        this.ident = this.ident.slice(2);

        nodoFOR.agregarHijo(new Nodo("}", this.tokenActual.lexema));
        str += this.match(TipoToken.LLAVE_DERECHA);

        str += `\n`

        if (nodoFOR.hijos.length > 0) {
            nodo.agregarHijo(nodoFOR);
        }

        return str;
    }

    INCREMENTO(nodo) {
        let str = "";
        if (this.comparar(TipoToken.MAS)) {
            nodo.agregarHijo(new Nodo("+", this.tokenActual.lexema));
            str += `${this.tokenActual.lexema}`
            str += this.match(TipoToken.MAS);

            nodo.agregarHijo(new Nodo("+", this.tokenActual.lexema));
            str += `${this.tokenActual.lexema}`
            str += this.match(TipoToken.MAS);
        } else if (this.comparar(TipoToken.MENOS)) {
            nodo.agregarHijo(new Nodo("-", this.tokenActual.lexema));
            str += `${this.tokenActual.lexema}`
            str += this.match(TipoToken.MENOS);
            
            nodo.agregarHijo(new Nodo("-", this.tokenActual.lexema));
            str += `${this.tokenActual.lexema}`
            str += this.match(TipoToken.MENOS);
        } else {
            this.errorSintact();
        }
        return str;
    }

    WHILE(nodo) {
        let str = "";
        let nodoWHILE = new Nodo("WHILE", "WHILE");

        nodoWHILE.agregarHijo(new Nodo("while", this.tokenActual.lexema));
        str += `${this.ident}${this.tokenActual.lexema} `
        str += this.match(TipoToken.SENTENCIA_REPETICION, "while");

        nodoWHILE.agregarHijo(new Nodo("(", this.tokenActual.lexema));
        str += this.match(TipoToken.PARENTESIS_IZQUIERDO);

        str += this.EXPRESION(nodoWHILE);
        
        str += ` : \n`
        nodoWHILE.agregarHijo(new Nodo(")", this.tokenActual.lexema));
        str += this.match(TipoToken.PARENTESIS_DERECHO);

        nodoWHILE.agregarHijo(new Nodo("{", this.tokenActual.lexema));
        str += this.match(TipoToken.LLAVE_IZQUIERDA);

        this.ident += "  ";
        let ins = this.INSTRUCCIONES(nodoWHILE);
        if (ins) {
            str += `${ins}`;
        } else {
            str += `${this.ident}pass\n`;
        }
        this.ident = this.ident.slice(2);
        
        nodoWHILE.agregarHijo(new Nodo("}", this.tokenActual.lexema));
        str += this.match(TipoToken.LLAVE_DERECHA);

        str += `\n`;

        if (nodoWHILE.hijos.length > 0) {
            nodo.agregarHijo(nodoWHILE)
        }
        return str;
    }

    DO(nodo) {
        let str = "";
        let nodoDO = new Nodo("DO", "DO");

        nodoDO.agregarHijo(new Nodo("do", this.tokenActual.lexema));
        str += this.match(TipoToken.SENTENCIA_REPETICION, "do");

        nodoDO.agregarHijo(new Nodo("{", this.tokenActual.lexema));
        str += this.match(TipoToken.LLAVE_IZQUIERDA);

        this.ident += "  ";
        let ins = this.INSTRUCCIONES(nodoDO);
        if (ins) {
            ins = `${ins}`;
        } else {
            ins += `${this.ident}pass\n`;
        }
        this.ident = this.ident.slice(2);

        nodoDO.agregarHijo(new Nodo("}", this.tokenActual.lexema));
        str += this.match(TipoToken.LLAVE_DERECHA);

        nodoDO.agregarHijo(new Nodo("while", this.tokenActual.lexema));
        str += `${this.ident}${this.tokenActual.lexema} `
        str += this.match(TipoToken.SENTENCIA_REPETICION, "while");

        nodoDO.agregarHijo(new Nodo("(", this.tokenActual.lexema));
        str += this.match(TipoToken.PARENTESIS_IZQUIERDO);

        str += this.EXPRESION(nodoDO);

        nodoDO.agregarHijo(new Nodo(")", this.tokenActual.lexema));
        str += ` : \n`;
        str += ins + "\n";
        str += this.match(TipoToken.PARENTESIS_DERECHO);

        nodoDO.agregarHijo(new Nodo(";", this.tokenActual.lexema));
        str += this.match(TipoToken.PUNTO_Y_COMA);

        if (nodoDO.hijos.length > 0) {
            nodo.agregarHijo(nodoDO)
        }

        return str;

    }

    IMPRIMIR(nodo) {
        let str = "";
        let nodoIMPRIMIR = new Nodo("IMPRIMIR","IMPRIMIR");

        nodoIMPRIMIR.agregarHijo(new Nodo("system", this.tokenActual.lexema));
        str += this.match(TipoToken.PALABRA_RESERVADA, "System");

        nodoIMPRIMIR.agregarHijo(new Nodo(".", this.tokenActual.lexema));
        str += this.match(TipoToken.PUNTO);

        nodoIMPRIMIR.agregarHijo(new Nodo("out", this.tokenActual.lexema));
        str += this.match(TipoToken.PALABRA_RESERVADA, "out");

        nodoIMPRIMIR.agregarHijo(new Nodo(".", this.tokenActual.lexema));
        str += this.match(TipoToken.PUNTO);

        nodoIMPRIMIR.agregarHijo(new Nodo("print", this.tokenActual.lexema));
        str += `${this.ident}print`
        str += this.match(TipoToken.PALABRA_RESERVADA, "println");

        nodoIMPRIMIR.agregarHijo(new Nodo("(", this.tokenActual.lexema));
        str += `${this.tokenActual.lexema}`;
        str += this.match(TipoToken.PARENTESIS_IZQUIERDO);
        
        str += this.EXPRESION(nodoIMPRIMIR);
        
        nodoIMPRIMIR.agregarHijo(new Nodo(")", this.tokenActual.lexema));
        str += `${this.tokenActual.lexema} \n\n`
        str += this.match(TipoToken.PARENTESIS_DERECHO);

        nodoIMPRIMIR.agregarHijo(new Nodo(";", this.tokenActual.lexema));
        str += this.match(TipoToken.PUNTO_Y_COMA);

        if (nodoIMPRIMIR.hijos.length > 0) {
            nodo.agregarHijo(nodoIMPRIMIR);
        }

        return str;
    }

    EXPRESION(nodo) {
        let str = ""

        let nodoExp = new Nodo("EXPRESION", "EXPRESION");
        str += this.E(nodoExp);
        str +=this.LOGICO_RELACIONAL(nodoExp);

        if (nodoExp.hijos.length > 0) {
            nodo.agregarHijo(nodoExp);
        }

        return str;
    }

    LOGICO_RELACIONAL(nodo) {
        let str = "";
        let nodoLogico = new Nodo("LOGICO_RELACIONAL", "LOGICO_RELACIONAL");

        if (this.comparar(TipoToken.AND)) {
            nodoLogico.agregarHijo(new Nodo("AND", this.tokenActual.lexema));
            str += this.match(TipoToken.AND);

            if (!this.for) {
                str += ` and `
            }
            nodoLogico.agregarHijo(new Nodo("AND", this.tokenActual.lexema));
            str += this.match(TipoToken.AND);

            str += this.EXPRESION(nodoLogico);
        } else if (this.comparar(TipoToken.OR)) {
            nodoLogico.agregarHijo(new Nodo("|", this.tokenActual.lexema));
            str += this.match(TipoToken.OR);

            if (!this.for) {
                str += ` or `
            }
            nodoLogico.agregarHijo(new Nodo("|", this.tokenActual.lexema));
            str += this.match(TipoToken.OR);
            
            str += this.EXPRESION(nodoLogico);
        } else if (this.comparar(TipoToken.EXCLAMACION) && TipoToken.IGUAL == this.listaTokens[this.numToken + 1].tipo) {
            if (!this.for) {
                str += `${this.tokenActual.lexema} `
            }
            nodoLogico.agregarHijo(new Nodo("!", this.tokenActual.lexema));
            str += this.match(TipoToken.EXCLAMACION);

            if (!this.for) {
                str += `${this.tokenActual.lexema} `
            }
            nodoLogico.agregarHijo(new Nodo("=", this.tokenActual.lexema));
            str += this.match(TipoToken.IGUAL);

            str += this.EXPRESION(nodoLogico);
        } else if (this.comparar(TipoToken.XOR)) {
            if (!this.for) {
                str += ` xor `
            }
            nodoLogico.agregarHijo(new Nodo("^", this.tokenActual.lexema));
            str += this.match(TipoToken.XOR);

            str += this.EXPRESION(nodoLogico);
        } else if (this.comparar(TipoToken.MAYOR) && TipoToken.IGUAL == this.listaTokens[this.numToken + 1].tipo) {
            if (!this.for) {
                str += `${this.tokenActual.lexema} `
            }
            nodoLogico.agregarHijo(new Nodo(">", this.tokenActual.lexema));
            str += this.match(TipoToken.MAYOR);

            if (!this.for) {
                str += `${this.tokenActual.lexema} `
            }
            nodoLogico.agregarHijo(new Nodo("=", this.tokenActual.lexema));
            str += this.match(TipoToken.IGUAL);

            str += this.EXPRESION(nodoLogico);
        } else if (this.comparar(TipoToken.MENOR) && TipoToken.IGUAL == this.listaTokens[this.numToken + 1].tipo) {
            if (!this.for) {
                str += `${this.tokenActual.lexema} `
            }
            nodoLogico.agregarHijo(new Nodo("<", this.tokenActual.lexema));
            str += this.match(TipoToken.MENOR);

            if (!this.for) {
                str += `${this.tokenActual.lexema} `
            }
            nodoLogico.agregarHijo(new Nodo("=", this.tokenActual.lexema));
            str += this.match(TipoToken.IGUAL);

            str += this.EXPRESION(nodoLogico);
        } else if (this.comparar(TipoToken.MAYOR)) {
            if (!this.for) {
                str += `${this.tokenActual.lexema} `
            }
            nodoLogico.agregarHijo(new Nodo(">", this.tokenActual.lexema));
            str += this.match(TipoToken.MAYOR);

            if (!this.for) {
                str += this.EXPRESION(nodoLogico);
            }
        } else if (this.comparar(TipoToken.MENOR)) {
            if (!this.for) {
                str += `${this.tokenActual.lexema} `
            }
            nodoLogico.agregarHijo(new Nodo("<", this.tokenActual.lexema));
            str += this.match(TipoToken.MENOR);

            str += this.EXPRESION(nodoLogico);
        } else if (this.comparar(TipoToken.IGUAL)) {
            if (!this.for) {
                str += `${this.tokenActual.lexema} `
            }
            nodoLogico.agregarHijo(new Nodo("=", this.tokenActual.lexema));
            str += this.match(TipoToken.IGUAL);

            if (!this.for) {
                str += `${this.tokenActual.lexema} `
            }
            nodoLogico.agregarHijo(new Nodo("=", this.tokenActual.lexema));
            str += this.match(TipoToken.IGUAL);

            str += this.EXPRESION(nodoLogico);
        } else if (this.comparar(TipoToken.EXCLAMACION)) {
            if (!this.for) {
                str += ` not  `
            }
            nodoLogico.agregarHijo(new Nodo("!", this.tokenActual.lexema));
            str += this.match(TipoToken.EXCLAMACION);

            str += this.EXPRESION(nodoLogico);
        } else {
            // epsilon
        }

        if (nodoLogico.hijos.length > 0) {
            nodo.agregarHijo(nodoLogico);
        }
        return str;
    }

    E(nodo) {
        let str = "";
        let nodoE = new Nodo("E", "E");

        str += this.T(nodoE);
        str += this.EP(nodoE);

        if (nodoE.hijos.length > 0) {
            nodo.agregarHijo(nodoE);
        }

        return str;
    }

    EP(nodo) {
        let str = "";
        let nodoEP = new Nodo("EP","EP");

        if (this.comparar(TipoToken.MAS)) {
            nodoEP.agregarHijo(new Nodo("+", this.tokenActual.lexema));
            str += ` ${this.tokenActual.lexema} `
            str += this.match(TipoToken.MAS);

            str += this.T(nodoEP);
            str += this.EP(nodoEP);

        } else if (this.comparar(TipoToken.MENOS)) {
            nodoEP.agregarHijo(new Nodo("+", this.tokenActual.lexema));
            str += ` ${this.tokenActual.lexema} `
            str += this.match(TipoToken.MENOS);

            str += this.T(nodoEP);
            str += this.EP(nodoEP);
        } else {
            // epsilon
        }

        if (nodoEP.hijos.length > 0) {
            nodo.agregarHijo(nodoEP);
        }

        return str;
    }

    T(nodo) {
        let str = "";
        str += this.F(nodo);
        str += this.TP(nodo);
        return str;
    }

    TP(nodo) {
        let str = "";
        let nodoTP = new Nodo("TP", "TP");

        if (this.comparar(TipoToken.POR)) {
            nodoTP.agregarHijo(new Nodo("*", this.tokenActual.lexema));
            str += `${this.tokenActual.lexema} `
            str += this.match(TipoToken.POR);

            str += this.F(nodoTP);
            str += this.TP(nodoTP);

        } else if (this.comparar(TipoToken.DIVISION)) {
            nodoTP.agregarHijo(new Nodo("/", this.tokenActual.lexema));
            str += `${this.tokenActual.lexema} `
            str += this.match(TipoToken.DIVISION);

            str += this.F(nodoTP);
            str += this.TP(nodoTP);
        } else {
            // epsilon
        }

        if (nodoTP.hijos.length > 0) {
            nodo.agregarHijo(nodoTP);
        }

        return str;
    }

    F(nodo) {
        let str = "";

        if (this.comparar(TipoToken.NUMERO) && this.for) {
            nodo.agregarHijo(new Nodo("NUMERO", this.tokenActual.lexema));
            str = `${this.tokenActual.lexema}` 
            str += this.match(TipoToken.NUMERO);
            // nodo.agregarHijo(nodoF);
            return str;
        }

        if (this.comparar(TipoToken.IDENTIFICADOR)) {
            str += this.NAME(nodo);
        } else if (this.comparar(TipoToken.NUMERO) ) {
            nodo.agregarHijo(new Nodo("NUMERO", this.tokenActual.lexema));
            str += `${this.tokenActual.lexema}`
            str += this.match(TipoToken.NUMERO);
            

        } else if (this.comparar(TipoToken.CADENA) ) {
            nodo.agregarHijo(new Nodo("CADENA", this.tokenActual.lexema.replace(/"/g,"\\\"")));
            str += `${this.tokenActual.lexema}`
            str += this.match(TipoToken.CADENA)
        
        } else if (this.comparar(TipoToken.CARACTER) ) {
            nodo.agregarHijo(new Nodo("CARACTER", this.tokenActual.lexema.replace(/'/g,"\\\"")));
            str += `${this.tokenActual.lexema}`
            str += this.match(TipoToken.CARACTER)

        } else if (this.tokenActual.lexema == "true" ) {
            nodo.agregarHijo(new Nodo("true", this.tokenActual.lexema));
            str += `${this.tokenActual.lexema}`
            str += this.match(TipoToken.PALABRA_RESERVADA, "true");

        } else if (this.tokenActual.lexema == "false" ) {
            nodo.agregarHijo(new Nodo("false", this.tokenActual.lexema));
            str += `${this.tokenActual.lexema}`
            str += this.match(TipoToken.PALABRA_RESERVADA, "false");

        } else if (this.comparar(TipoToken.MENOS) ) {
            nodo.agregarHijo(new Nodo("-", this.tokenActual.lexema));
            str += `${this.tokenActual.lexema} `
            str += this.match(TipoToken.MENOS);

            str += this.EXPRESION(nodo);

        } else if (this.comparar(TipoToken.EXCLAMACION) ) {
            nodo.agregarHijo(new Nodo("!", this.tokenActual.lexema));
            str += `${this.tokenActual.lexema} `
            str += this.match(TipoToken.EXCLAMACION);

            str += this.EXPRESION(nodo);

        } else if (this.comparar(TipoToken.PARENTESIS_IZQUIERDO)) {
            nodo.agregarHijo(new Nodo("(", this.tokenActual.lexema));
            str += `${this.tokenActual.lexema}`
            str += this.match(TipoToken.PARENTESIS_IZQUIERDO);

            str += this.EXPRESION(nodo);
            
            nodo.agregarHijo(new Nodo(")", this.tokenActual.lexema));
            str += `${this.tokenActual.lexema} `
            str += this.match(TipoToken.PARENTESIS_DERECHO);

        } else {
            this.errorSintact();
            str = "";
        }

        return str;
    }

    NAME(nodo) {
        let str = "";
        
        if (!this.for) {
            str += `${this.tokenActual.lexema}`
        }

        let nodoID = new Nodo("ID","ID");
        nodoID.agregarHijo(new Nodo("ID", this.tokenActual.lexema));
        nodo.agregarHijo(nodoID); 
        str += this.match(TipoToken.IDENTIFICADOR);

        str += this.NAME_P(nodo);
        return str;
    }

    NAME_P(nodo) {
        let str = "";

        if (this.comparar(TipoToken.PARENTESIS_IZQUIERDO)) {
            nodo.agregarHijo(new Nodo("(", this.tokenActual.lexema));
            str += `${this.tokenActual.lexema}`
            str += this.match(TipoToken.PARENTESIS_IZQUIERDO);

            str += this.LISTA_EXPRESIONES(nodo);

            nodo.agregarHijo(new Nodo(")", this.tokenActual.lexema));
            str += `${this.tokenActual.lexema} `
            str += this.match(TipoToken.PARENTESIS_DERECHO);

        } else if (this.comparar(TipoToken.MAS) && TipoToken.MAS == this.listaTokens[this.numToken + 1].tipo) {
            nodo.agregarHijo(new Nodo("+", this.tokenActual.lexema));
            str += `${this.tokenActual.lexema}`
            str += this.match(TipoToken.MAS);

            nodo.agregarHijo(new Nodo("+", this.tokenActual.lexema));
            str += `${this.tokenActual.lexema} `
            str += this.match(TipoToken.MAS);

        } else if (this.comparar(TipoToken.MENOS) && TipoToken.MAS == this.listaTokens[this.numToken + 1].tipo) {
            nodo.agregarHijo(new Nodo("-", this.tokenActual.lexema));
            str += `${this.tokenActual.lexema}`
            str += this.match(TipoToken.MENOS);

            nodo.agregarHijo(new Nodo("-", this.tokenActual.lexema));
            str += `${this.tokenActual.lexema} `
            str += this.match(TipoToken.MENOS);

        } else {
            // epsilon
        }

        return str;
    }

    LISTA_EXPRESIONES(nodo) {
        let str = "";
        let nodoListaExp = new Nodo("LISTA EXP", "LISTA EXP");

        if (this.comparar(TipoToken.IDENTIFICADOR) || this.comparar(TipoToken.NUMERO) || this.comparar(TipoToken.CADENA || this.tokenActual.lexema == "true"   || this.tokenActual.lexema == "false" || this.comparar(TipoToken.PARENTESIS_IZQUIERDO)) ) {
            str += this.EXPRESION(nodoListaExp);
            str += this.LISTA_EXPRESIONES_P(nodoListaExp);
        } else {
            // epsilon
        }

        if (nodoListaExp.hijos.length > 0) {
            nodo.agregarHijo(nodoListaExp);
        }

        return str;
    }

    LISTA_EXPRESIONES_P(nodo) {
        let str = "";

        if (this.comparar(TipoToken.COMA)) {
            str += `${this.tokenActual.lexema}`
            str += this.match(TipoToken.COMA);

            str += this.EXPRESION(nodo);
            str += this.LISTA_EXPRESIONES_P(nodo);
        } else {
            //  epsilon
        }

        return str;
    }

    tipoError(tipo) {
        switch(tipo){
            case TipoToken.IDENTIFICADOR:
                return "Identificador";
            case TipoToken.PALABRA_RESERVADA:
                return "Palabra Reservada";
            case TipoToken.CADENA:
                return "Cadena";
            case TipoToken.TIPO:
                return "Tipo";
            case TipoToken.MODIFICADOR:
                return "Modificador";
            case TipoToken.SENTENCIA_REPETICION:
                return "Sentencia Repeticion";
            case TipoToken.SENTENCIA_CONTROL:
                return "Sentencia Control";
            case TipoToken.COMENTARIO_UNILINEA:
                return "Comentario Unilinea";
            case TipoToken.COMENTARIO_MULTILINEA:
                return "Comentario Multilinea";
            case TipoToken.LLAVE_IZQUIERDA:
                return "{";
            case TipoToken.LLAVE_DERECHA:
                return "}";
            case TipoToken.PARENTESIS_IZQUIERDO:
                return "(";
            case TipoToken.PARENTESIS_DERECHO:
                return ")";
            case TipoToken.COMA:
                return ",";
            case TipoToken.PUNTO_Y_COMA:
                return ";";
            case TipoToken.IGUAL:
                return "=";
            case TipoToken.MENOR:
                return "<";
            case TipoToken.MAYOR:
                return ">";
            case TipoToken.MAS:
                return "+";
            case TipoToken.MENOS:
                return "-";
            case TipoToken.POR:
                return "*";
            case TipoToken.DIVISION:
                return "/";
            case TipoToken.AND:
                return "&";
            case TipoToken.OR:
                return "|";
            case TipoToken.XOR:
                return "^";
            case TipoToken.EXCLAMACION:
                return "!";
            case TipoToken.CORCHETE_IZQUIERDO:
                return "[";
            case TipoToken.CORCHETE_DERECHO:
                return "]";
            case TipoToken.NUMERO:
                return "Numero";
            case TipoToken.PUNTO:
                return ".";
            default:
                return "Error";
        }
    }

}



module.exports = AnalizadorSintactico;