const Token = require('../analizadorLexico/token')
const TipoToken = require('../analizadorLexico/tipoToken')

class AnalizadorSintactico {

    constructor() {
        this.numToken = 0;
        this.tokenActual  = null;
        this.listaTokens = [];
        this.listaErrores = [];
        this.existeError = false;
        this.errorSintactico = false;
    }

    comparar(tipo) {
        return this.tokenActual.tipo == tipo;
    }

    match(tipo, lexema = this.tokenActual.lexema) {

        if (this.errorSintactico) {
            //Modo Panico
            if (this.numToken < this.listaTokens - 1) {
                this.numToken++;
                this.tokenActual = this.listaTokens[this.numToken];
                if (this.tokenActual.tipo  == TipoToken.PUNTO_Y_COMA) {
                    this.errorSintactico = false;
                }
            }
        } else {
            // Metodo Parea
            if (this.comparar(tipo) && lexema == this.tokenActual.lexema) {
                console.log(`${lexema} === ${this.tokenActual.lexema}`);
                if (this.numToken < this.listaTokens.length - 1) {
                    this.numToken++;
                    this.tokenActual = this.listaTokens[this.numToken]; 
                    while(((this.comparar(TipoToken.COMENTARIO_UNILINEA)) || (this.comparar(TipoToken.COMENTARIO_UNILINEA))) && this.numToken < this.listaTokens.length - 1) {
                        this.numToken++;
                        this.tokenActual = this.listaTokens[this.numToken];
                    }   
                }
            } else {
                console.log("Error en token: " + this.numToken);
                console.log(`<<<Error Sintactico>>> Linea: ${this.tokenActual.linea}   Caracter: ${this.tokenActual.lexema}`)
                this.listaErrores.push(`<<<Error Sintactico>>> Linea: ${this.tokenActual.linea}   Caracter: ${this.tokenActual.lexema}`);
                this.errorSintactico = true;
                this.existeError = true;
            }
        }
    }

    errorSintact() {
        console.log("Error en token: " + this.numToken);
        console.log(`<<<Error Sintactico>>> Linea: ${this.tokenActual.linea}   Caracter: ${this.tokenActual.lexema}`)
        this.listaErrores.push(`<<<Error Sintactico>>> Linea: ${this.tokenActual.linea}   Caracter: ${this.tokenActual.lexema}`);
        this.errorSintactico = true;
        this.existeError = true;
    }


    analizar(listaTokens) {
        this.listaTokens = listaTokens;
        this.numToken = 0;
        this.tokenActual = this.listaTokens[this.numToken];
        this.INICIO();
        console.log(this.existeError ? "El analisis sintactico es incorrecto" : "El analisis sintactico fue correcto")
    }

    INICIO() {
        if (this.comparar(TipoToken.COMENTARIO_UNILINEA)) {
            this.match(TipoToken.COMENTARIO_UNILINEA);
        } else if (this.comparar(TipoToken.COMENTARIO_MULTILINEA)) {
            this.match(TipoToken.COMENTARIO_UNILINEA);
        }

        this.PLANTILLA();
    }

    PLANTILLA() {
        this.match(TipoToken.MODIFICADOR);
        this.TIPO_PLANTILLA();
    }

    TIPO_PLANTILLA() {
        if (this.tokenActual.lexema == "class") {
            this.match(TipoToken.PALABRA_RESERVADA, "class");
            this.match(TipoToken.IDENTIFICADOR);
            this.match(TipoToken.LLAVE_IZQUIERDA);
            this.INSTRUCCIONES_CLASE();
            this.match(TipoToken.LLAVE_DERECHA);
        } else if (this.tokenActual.lexema == "interface") {
            this.match(TipoToken.PALABRA_RESERVADA, "interface");
            this.match(TipoToken.IDENTIFICADOR);
            this.match(TipoToken.LLAVE_IZQUIERDA);
            // this.DEFINICION_FUNCIONES();
            this.match(TipoToken.LLAVE_DERECHA);
        } else {
            this.errorSintact();
        } 
    }

    INSTRUCCIONES_CLASE() {
        if (this.comparar(TipoToken.MODIFICADOR)) {
            this.DECLARACION_METODO();
            this.INSTRUCCIONES_CLASE();
        } else if (this.comparar(TipoToken.TIPO)) {
            this.DECLARACION_VARIABLES();
            this.INSTRUCCIONES_CLASE();
        }  else if (this.comparar(TipoToken.IDENTIFICADOR)) {
            this.ASIGN_LLAMADA();
            this.INSTRUCCIONES_CLASE();
        } else {
            this.INSTRUCCIONES();
            // epsilon
        }
    }

    DECLARACION_METODO() {
        this.match(TipoToken.MODIFICADOR);
        this.METODO();
    }

    METODO() {
        if (this.tokenActual.lexema == "static") {
            this.match(TipoToken.PALABRA_RESERVADA, "static");
            this.match(TipoToken.PALABRA_RESERVADA, "void");
            this.match(TipoToken.PALABRA_RESERVADA, "main");
            this.match(TipoToken.PARENTESIS_IZQUIERDO);
            this.match(TipoToken.TIPO, "String");
            this.match(TipoToken.CORCHETE_IZQUIERDO);
            this.match(TipoToken.CORCHETE_DERECHO);
            this.match(TipoToken.IDENTIFICADOR);
            this.match(TipoToken.PARENTESIS_DERECHO);
            this.match(TipoToken.LLAVE_IZQUIERDA);
            this.INSTRUCCIONES()
            this.match(TipoToken.LLAVE_DERECHA);
        } else if (this.comparar(TipoToken.TIPO) || this.tokenActual.lexema == "void") {
            this.TIPO();
            this.match(TipoToken.IDENTIFICADOR);
            this.match(TipoToken.PARENTESIS_IZQUIERDO);
            this.LISTA_PARAMETROS();
            this.match(TipoToken.PARENTESIS_DERECHO);
            this.match(TipoToken.LLAVE_IZQUIERDA);
            this.INSTRUCCIONES();
            this.match(TipoToken.LLAVE_DERECHA);
        } else {
            this.errorSintact();
        } 
    }

    TIPO() {
        if (this.comparar(TipoToken.TIPO)) {
            this.match(TipoToken.TIPO)
        } else if (this.tokenActual.lexema == "void") {
            this.match(TipoToken.PALABRA_RESERVADA, "void")
        } else {
            this.errorSintact();
        }
    }

    ASIGN_LLAMADA() {
        if (this.comparar(TipoToken.IDENTIFICADOR)) {
            this.match(TipoToken.IDENTIFICADOR);
            this.CAR();
        } else {
            // epsilon
        }
    }

    CAR() {
        if (this.comparar(TipoToken.IGUAL)) {
            this.match(TipoToken.IGUAL);
            // this.EXPRESION();
            this.match(TipoToken.PUNTO_Y_COMA);
        } else if (this.comparar(TipoToken.PARENTESIS_IZQUIERDO)) {
            this.match(TipoToken.PARENTESIS_IZQUIERDO);
            this.LISTA_PARAMETROS();
            this.match(TipoToken.PARENTESIS_DERECHO);
            this.match(TipoToken.PUNTO_Y_COMA);
        } else if (this.comparar(TipoToken.MAS)) {
            this.match(TipoToken.MAS);
            this.match(TipoToken.MAS);
            this.match(TipoToken.PUNTO_Y_COMA);
        } else if (this.comparar(TipoToken.MENOS)) {
            this.match(TipoToken.MENOS);
            this.match(TipoToken.MENOS);
            this.match(TipoToken.PUNTO_Y_COMA);
        } else {
            this.errorSintact();
        }
    }

    INSTRUCCIONES() {
        if (this.comparar(TipoToken.TIPO)) {
            this.DECLARACION_VARIABLES();
            this.INSTRUCCIONES();
        } else if (this.tokenActual.lexema == "if") {
            this.IF();
            this.INSTRUCCIONES();
        } else if (this.tokenActual.lexema == "for") {
            this.FOR();
            this.INSTRUCCIONES();
        } else if (this.tokenActual.lexema == "while") {
            this.WHILE();
            this.INSTRUCCIONES();
        } else if (this.tokenActual.lexema == "do") {
            this.DO();
            this.INSTRUCCIONES();
        } else if (this.tokenActual.lexema == "System") {
            console.log("RATATAA");
            this.IMPRIMIR();
            this.INSTRUCCIONES();
        } else if (this.tokenActual.lexema == "return") {
            this.match(TipoToken.PALABRA_RESERVADA, "return");
            // this.EXPRESION();
            this.match(TipoToken.PUNTO_Y_COMA);
            this.INSTRUCCIONES();
        } else if (this.tokenActual.lexema == "break") {
            this.match(TipoToken.PALABRA_RESERVADA, "break");
            this.match(TipoToken.PUNTO_Y_COMA);
        } else if (this.tokenActual.lexema == "continue") {
            this.match(TipoToken.PALABRA_RESERVADA, "continue");
            this.match(TipoToken.PUNTO_Y_COMA);
        } else if (this.comparar(TipoToken.IDENTIFICADOR)) {
            this.ASIGN_LLAMADA();
            this.INSTRUCCIONES();
        } else {
            // epsilon
        }
    }

    DECLARACION_VARIABLES() {
        this.TIPO_DATO();
        this.match(TipoToken.IDENTIFICADOR);
        this.ASIGNACION();
        this.LISTA_VARIABLES();
        this.match(TipoToken.PUNTO_Y_COMA);
    }

    ASIGNACION() {
        if (this.comparar(TipoToken.IGUAL)) {
            this.match(TipoToken.IGUAL);
            // this.EXPRESION()
        } else {
            // epsilon
        }
    }

    LISTA_VARIABLES() {
        if (this.comparar(TipoToken.COMA)) {
            this.match(TipoToken.COMA);
            this.match(TipoToken.IDENTIFICADOR);
            this.ASIGNACION();
            this.LISTA_VARIABLES();
        } else {
            // epsilon
        }
    }

    LISTA_PARAMETROS() {
        if (this.comparar(TipoToken.TIPO)) {
            this.PARAMETRO();
            this.LISTA_PARAMETROS_P();
        } else {
            // epsilon
        }
    }

    PARAMETRO() {
        this.TIPO_DATO();
        this.match(TipoToken.IDENTIFICADOR);
    }

    LISTA_PARAMETROS_P() {
        if (this.comparar(TipoToken.COMA)) {
            this.match(TipoToken.COMA);
            this.PARAMETRO();
            this.LISTA_PARAMETROS_P();
        } else {
            // epsilon
        }
    }

    TIPO_DATO() {
        if (this.comparar(TipoToken.TIPO)) {
            this.match(TipoToken.TIPO);
        } else {
            this.errorSintact();
        }
    }

    IF() {
        this.match(TipoToken.SENTENCIA_CONTROL, "if");
        this.match(TipoToken.PARENTESIS_IZQUIERDO);
        // this.EXPRESION()
        this.match(TipoToken.PARENTESIS_DERECHO);
        this.match(TipoToken.LLAVE_IZQUIERDA);
        this.INSTRUCCIONES();
        this.match(TipoToken.LLAVE_DERECHA);
        this.ELSE();
    }

    ELSE() {
        if (this.tokenActual.lexema == "else") {
            this.match(TipoToken.SENTENCIA_CONTROL, "else");
            this.ELSE_P();
        } else {
            // epsilon
        }
    }

    ELSE_P() {
        if (this.tokenActual.lexema == "if") {
            this.IF()
        } else if (this.comparar(TipoToken.LLAVE_IZQUIERDA)) {
            this.match(TipoToken.LLAVE_IZQUIERDA);
            this.INSTRUCCIONES();
            this.match(TipoToken.LLAVE_DERECHA);
        }else {
            this.errorSintact();
        }
    }

    FOR() {
        this.match(TipoToken.SENTENCIA_REPETICION, "for");
        this.match(TipoToken.PARENTESIS_IZQUIERDO);
        this.DECLARACION_VARIABLES();
        this.match(TipoToken.PUNTO_Y_COMA);
        // this.EXPRESION();
        this.match(TipoToken.PUNTO_Y_COMA);
        this.match(TipoToken.IDENTIFICADOR);
        this.INCREMENTO();
        this.match(TipoToken.PARENTESIS_DERECHO);
        this.match(TipoToken.LLAVE_IZQUIERDA);
        this.INSTRUCCIONES();
        this.match(TipoToken.LLAVE_DERECHA);
    }

    INCREMENTO() {
        if (this.comparar(TipoToken.MAS)) {
            this.match(TipoToken.MAS);
            this.match(TipoToken.MAS);
        } else if (this.comparar(TipoToken.MENOS)) {
            this.match(TipoToken.MENOS);
            this.match(TipoToken.MENOS);
        } else {
            this.errorSintact();
        }
    }

    WHILE() {
        this.match(TipoToken.SENTENCIA_REPETICION, "while");
        this.match(TipoToken.PARENTESIS_IZQUIERDO);
        // this.EXPRESION();
        this.match(TipoToken.PARENTESIS_DERECHO);
        this.match(TipoToken.LLAVE_IZQUIERDA);
        this.INSTRUCCIONES();
        this.match(TipoToken.LLAVE_DERECHA);
    }

    DO() {
        this.match(TipoToken.SENTENCIA_REPETICION, "do");
        this.match(TipoToken.LLAVE_IZQUIERDA);
        this.INSTRUCCIONES();
        this.match(TipoToken.LLAVE_DERECHA);
        this.match(TipoToken.SENTENCIA_REPETICION, "while");
        this.match(TipoToken.PARENTESIS_IZQUIERDO);
        // this.EXPRESION();
        this.match(TipoToken.PARENTESIS_DERECHO);
        this.match(TipoToken.PUNTO_Y_COMA);
    }

    IMPRIMIR() {
        this.match(TipoToken.PALABRA_RESERVADA, "System");
        this.match(TipoToken.PUNTO);
        this.match(TipoToken.PALABRA_RESERVADA, "out");
        this.match(TipoToken.PUNTO);
        this.match(TipoToken.PALABRA_RESERVADA, "println");
        this.match(TipoToken.PARENTESIS_IZQUIERDO);
        // this.EXPRESION();
        this.match(TipoToken.PARENTESIS_DERECHO);
        this.match(TipoToken.PUNTO_Y_COMA);
    }




}



module.exports = AnalizadorSintactico;