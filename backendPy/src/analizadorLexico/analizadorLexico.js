const TipoToken = require('./tipoToken');
const Token = require('./token')


module.exports = class Lexico {

    constructor(){
        this.palabrasReservadas = [
            "class","interface","void","true","false","System","out",
            "print", "println","printf","break","continue","return","main",
            "static"
        ];
        this.palabrasTipo = ["boolean","String","char","int","double"];
        this.palabrasModificador = ["public"]
        this.sentenciasRepeticion = ["for","while","do"]
        this.sentenciasControl = ["if","else"]
        this.listaTokens = [];
        this.listaErrores = [];
        this.estado = 0;
        this.lexema = "";
        this.linea = 1;
        this.columna = 0;

    }

    agregarToken(tipoToken) {
        let token = new Token(tipoToken, this.lexema, this.linea, this.columna);
        this.listaTokens.push(token);
        this.estado = 0;
        this.lexema = "";
    }

    agregarErrorLexico(caracterErroneo) {
        console.log("ERROR <<>> -> " + caracterErroneo)
        let tokenErroneo = new Token(TipoToken.ERROR, caracterErroneo, this.linea, this.columna);
        this.listaErrores.push(tokenErroneo);
        this.estado = 0;
        this.lexema = "";
    }

    isLetter(caracter) {
        return caracter.match(/[a-zA-Z]/i);
    }

    isDigit(caracter) {
        return caracter.match(/[0-9]/i);
    }

    analizar(cadena) {
        let cadenaEntrada = cadena + "#";
        let col = 0;

        for(let i = 0; i < cadenaEntrada.length; i++) {

            let caracterActual = cadenaEntrada[i];
            col++;
            

            switch(this.estado){
                case 0:
                    this.columna = col;
                    if (this.isLetter(caracterActual) || caracterActual == "_") {
                        this.lexema += caracterActual;
                        this.estado = 1;
                    }else if (this.isDigit(caracterActual)) {
                        this.lexema += caracterActual
                        this.estado = 2
                    } else if (caracterActual == "{") {
                        this.lexema += caracterActual;
                        this.agregarToken(TipoToken.LLAVE_IZQUIERDA);
                    } else if (caracterActual == "}") {
                        this.lexema += caracterActual;
                        this.agregarToken(TipoToken.LLAVE_DERECHA);
                    } else if (caracterActual == "(") {
                        this.lexema += caracterActual;
                        this.agregarToken(TipoToken.PARENTESIS_IZQUIERDO);
                    } else if (caracterActual == ")") {
                        this.lexema += caracterActual;
                        this.agregarToken(TipoToken.PARENTESIS_DERECHO);
                    }  else if (caracterActual == ",") {
                        this.lexema += caracterActual;
                        this.agregarToken(TipoToken.COMA);
                    } else if (caracterActual == ";") {
                        this.lexema += caracterActual;
                        this.agregarToken(TipoToken.PUNTO_Y_COMA);
                    } else if (caracterActual == "=") {
                        this.lexema += caracterActual;
                        this.agregarToken(TipoToken.IGUAL);
                    } else if (caracterActual == "<") {
                        this.lexema += caracterActual;
                        this.agregarToken(TipoToken.MENOR);
                    } else if (caracterActual == ">") {
                        this.lexema += caracterActual;
                        this.agregarToken(TipoToken.MAYOR);
                    } else if (caracterActual == "+") {
                        this.lexema += caracterActual;
                        this.agregarToken(TipoToken.MAS);
                    } else if (caracterActual == "-") {
                        this.lexema += caracterActual;
                        this.agregarToken(TipoToken.MENOS);
                    } else if (caracterActual == "*") {
                        this.lexema += caracterActual;
                        this.agregarToken(TipoToken.POR);
                    } else if (caracterActual == "/") {
                        this.lexema += caracterActual;
                        this.estado = 6;
                    } else if (caracterActual == "&") {
                        this.lexema += caracterActual;
                        this.agregarToken(TipoToken.AND);
                    } else if (caracterActual == "|") {
                        this.lexema += caracterActual;
                        this.agregarToken(TipoToken.OR);
                    } else if (caracterActual == "^") {
                        this.lexema += caracterActual;
                        this.agregarToken(TipoToken.XOR);
                    } else if (caracterActual == "!") {
                        this.lexema += caracterActual;
                        this.agregarToken(TipoToken.EXCLAMACION);
                    } else if (caracterActual == "[") {
                        this.lexema += caracterActual;
                        this.agregarToken(TipoToken.CORCHETE_IZQUIERDO);
                    } else if (caracterActual == "]") {
                        this.lexema += caracterActual;
                        this.agregarToken(TipoToken.CORCHETE_DERECHO);
                    } else if (caracterActual == ".") {
                        this.lexema += caracterActual;
                        this.agregarToken(TipoToken.PUNTO);
                    }else if (caracterActual == "\"") {
                        this.lexema += caracterActual;
                        this.estado = 5;
                    } else {
                        if (caracterActual == "#" && i == cadena.length ) {
                            // console.log("<<<<<<<<<<<<<<< Fin del Analisis Lexico >>>>>>>>>>>>>>>")
                        } else if (["\n","\t"," "].includes(caracterActual,0)) {
                            this.estado = 0;
                            this.lexema = "";
                        } else {
                            this.agregarErrorLexico(caracterActual);
                        }
                    }
                    break;
                case 1:
                    if (this.isLetter(caracterActual) || this.isDigit(caracterActual) || caracterActual == "_") {
                        this.estado = 1;
                        this.lexema += caracterActual;
                    } else {
                        if (this.palabrasReservadas.includes(this.lexema, 0)) {
                            this.agregarToken(TipoToken.PALABRA_RESERVADA);
                        } else if (this.palabrasTipo.includes(this.lexema, 0)) {
                            this.agregarToken(TipoToken.TIPO);
                        } else if (this.palabrasModificador.includes(this.lexema, 0)) {
                            this.agregarToken(TipoToken.MODIFICADOR);
                        } else if (this.sentenciasControl.includes(this.lexema, 0)) {
                            this.agregarToken(TipoToken.SENTENCIA_CONTROL);
                        } else if (this.sentenciasRepeticion.includes(this.lexema, 0)) {
                            this.agregarToken(TipoToken.SENTENCIA_REPETICION);
                        } else {
                            this.agregarToken(TipoToken.IDENTIFICADOR);
                        }
                        i -= 1
                    }
                    break;
                case 2:
                    if (this.isDigit(caracterActual)) {
                        this.lexema += caracterActual;
                        this.estado = 2;
                    } else if (caracterActual == ".") {
                        this.lexema += caracterActual;
                        this.estado = 3;
                    } else {
                        this.agregarToken(TipoToken.NUMERO);
                        i -= 1;
                    }
                    break;
                case 3:
                    if (this.isDigit(caracterActual)) {
                        this.lexema += caracterActual;
                        this.estado = 4;
                    } else {
                        this.agregarErrorLexico(this.lexema + caracterActual);
                        i -= 1
                    }
                    break;
                case 4:
                    if (this.isDigit(caracterActual)) {
                        this.lexema += caracterActual
                        this.estado = 4
                    } else {
                        this.agregarToken(TipoToken.NUMERO);
                        i -= 1;
                    }
                    break;
                case 5:
                    if (caracterActual == "\"") {
                        this.lexema += caracterActual
                        this.agregarToken(TipoToken.CADENA);
                    } else {
                        this.estado = 5;
                        this.lexema += caracterActual
                    }
                    break;
                case 6:
                    if (caracterActual == "/") {
                        this.lexema += caracterActual;
                        this.estado = 7
                    } else if (caracterActual == "*") {
                        this.lexema += caracterActual;
                        this.estado = 9
                    } else {
                        this.agregarToken(TipoToken.DIVISION);
                        i -= 1
                    }
                    break;
                case 7:
                    if (caracterActual == "\n" || i == cadena.length) {
                        // COMENTARIO DE UNA LINEA
                        this.lexema += caracterActual;
                        this.agregarToken(TipoToken.COMENTARIO_UNILINEA)
                        // this.lexema = "";
                        // this.estado = 0;
                    } else {
                        this.lexema += caracterActual;
                        this.estado = 7;
                    }
                    break;
                case 8:
                    if (caracterActual == "*") {
                        this.lexema += caracterActual;
                        this.estado = 9;
                    } else {
                        this.lexema += caracterActual;
                        this.estado = 8;
                    }
                    break; 
                case 9:
                    if (caracterActual == "/") {
                        // COMENTARIO MULTILINEA
                        this.lexema += caracterActual;
                        this.agregarToken(TipoToken.COMENTARIO_MULTILINEA);
                        // this.lexema = "";
                        // this.estado = 0;
                    } else {
                        this.lexema += caracterActual;
                        this.estado = 9;
                    }
                    break;

            }

            if (caracterActual == "\n") {
                this.linea += 1
                this.columna = 0
                col = 0
            }

        }

    }

}