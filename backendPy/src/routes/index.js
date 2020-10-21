const {Router} = require('express');
const router = Router();
const AnalizadorLexico = require('../analizadorLexico/analizadorLexico');
const AnalizadorSintactico = require('../analizadorSintactico/analizadorSintactico');

let file = {
    name: "",
    content: "",
    type: ""
}

router.get('/', (req, res) => {
    res.json(file);
});

router.post('/', (req, res) => {
    const {name, content} = req.body;
    if (name && content) {
        file = {...req.body};
        // res.json({...file, "tokens": []});

        // Analizador Lexico
        const analizadorLex = new AnalizadorLexico();
        analizadorLex.analizar(content)
        
        // Analizador Sintactico
        const analizadorSin = new AnalizadorSintactico();
        analizadorSin.analizar(analizadorLex.listaTokens);

        res.json({...file, "tokens": analizadorLex.listaTokens}); 
    }
})

module.exports = router;