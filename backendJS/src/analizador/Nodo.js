class Nodo {

    constructor(tipo, valor) {
        this.valor = valor;
        this.tipo = tipo;
        this.hijos = [];
    }

    agregarHijo(hijo) {
        this.hijos.push(hijo);
    }

}

module.exports = Nodo;