const TipoToken = require('../analizadorLexico/tipoToken');

class AnalizadorSintactico {


    constructor() {
        this.listaTokens = [];
        this.numToken = 0;
        this.tokenActual  = null;
        this.listaErrores = [];
        this.existeError = false;
        this.errorSintactico = false;
    }

    analizar(listaTokens) {

        this.listaTokens = listaTokens;
        this.numToken = 0;
        this.tokenActual = this.listaTokens[this.numToken];

        this.INICIO();
    }

    INICIO() {
        this.LISTA_PLANTILLAS();
    }

    LISTA_PLANTILLAS() {
        this.PLANTILLA();
        this.LISTA_PLANTILLAS_P();
    }

    LISTA_PLANTILLAS_P() {
        if (this.tokenActual.lexema == "public") {
            
        }
    }


    match(tipo){
        if (this.comparar(tipo)) {
            if (this.numToken < this.listaErrores.length - 1) {
                this.numToken++;
                this.tokenActual = this.listaTokens[this.numToken];
            } 
        } else {
            console.log(`Error Sintactico, se esperaba ${this.tipoError(tipo)}`)
        }

    }

    comparar(tipo) {
        return this.tokenActual.tipo == tipo;
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