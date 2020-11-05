const {Router} = require('express');
const router = Router();
const Analizador = require('../analizador/analizador');

let file = {
    name: "",
    content: "",
    type: ""
}

router.get('/', (req, res) => {
    res.json(file);
})

router.post('/', (req, res) => {
    const {name, content} = req.body;
    if (content) {
        file = {...req.body};

        // Analisis Lexico y Sintactico
        let analisis = Analizador.parse(content);

        console.log(analisis.listaErrores);

        res.json({
            ...file,
            "tokens": analisis.listaTokens,
            "errores": analisis.listaErrores,
            "traduccion": analisis.traduccion,
            "arbol": generarAST(analisis.ast)
        });
    }
})

function generarAST(raiz) {
    let str = "digraph G {\n"
    let cont = 0;
    let cont2 = 1;
    let pila = [raiz];

    while (pila.length > 0) {

        let nodo = pila.shift();
        
        if (nodo) {
            if (nodo.valor){
                str += `   nodo_${cont}[label="${nodo.valor.replace(/"/g,"")}"];\n`;
            }
            
            nodo.hijos.forEach(hijo => {
                if (hijo) {
                    str += `   nodo_${cont} -> nodo_${cont2++};\n`;
                }
            });
            pila.push(...nodo.hijos);           

            cont++;
        }
    }

    str += "}";

    return str;
}

module.exports = router;