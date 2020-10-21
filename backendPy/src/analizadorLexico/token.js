let TipoToken = require('./tipoToken');

module.exports = class Token{

    constructor(tipo, lexema, linea, columna){
        this.tipo = tipo;
        this.lexema = lexema;
        this.linea = linea;
        this.columna = columna;
        this.tipoString = this.getTipo()
    }

    getTipo() {
        switch(this.tipo){
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
                return "Llave Izquierda";
            case TipoToken.LLAVE_DERECHA:
                return "Llave Derecha";
            case TipoToken.PARENTESIS_IZQUIERDO:
                return "Parentesis Izquierdo";
            case TipoToken.PARENTESIS_DERECHO:
                return "Parentesis Derecho";
            case TipoToken.COMA:
                return "Coma";
            case TipoToken.PUNTO_Y_COMA:
                return "Punto Y Coma";
            case TipoToken.IGUAL:
                return "Igual";
            case TipoToken.MENOR:
                return "Menor";
            case TipoToken.MAYOR:
                return "Mayor";
            case TipoToken.MAS:
                return "Mas";
            case TipoToken.MENOS:
                return "Menos";
            case TipoToken.POR:
                return "Por";
            case TipoToken.DIVISION:
                return "Division";
            case TipoToken.AND:
                return "And";
            case TipoToken.OR:
                return "Or";
            case TipoToken.XOR:
                return "Xor";
            case TipoToken.EXCLAMACION:
                return "Exclamacion";
            case TipoToken.CORCHETE_IZQUIERDO:
                return "Corchete Izquierdo";
            case TipoToken.CORCHETE_DERECHO:
                return "Corchete Derecho";
            case TipoToken.NUMERO:
                return "Numero";
            case TipoToken.PUNTO:
                return "Punto";
            default:
                return "Error";
        }
    }

}