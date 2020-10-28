class NodoArbol {

    constructor (tipo, valor,) {
        this.tipo = tipo;
        this.valor = valor;
        this.hijos = [];
    }

    agregarHijo(hijo) {
        this.hijos.push(hijo);
    }

}

module.exports = NodoArbol;