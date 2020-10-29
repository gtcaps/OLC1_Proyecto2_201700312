function sendPOSTFilePython(name, content){
    fetch("http://localhost:8000/file/python", {
        method: "POST",
        body: JSON.stringify({
            name: name,
            content: content,
            type: 'python'
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);

        let pyShell = document.getElementById("consolaPython");
        let str = "==========================================\nANALISIS LEXICO\n==========================================\n";
        
        // IMPRIMIR TOKENS GENERADOS POR EL ANALIZADOR LEXICO EN LA CONSOLA DE PYTHON
        data.tokens.forEach(token => {
            if (token.tipoString == "Comentario Unilinea" || token.tipoString == "Comentario Multilinea") {
                // Comentarios
            } else {
                str += `Token: ${token.tipo}       Lexema: ${token.lexema}      Linea: ${token.linea}       Columna: ${token.columna}\n`;
            }
        });

        pyShell.innerHTML = str + "\n\n";

        data.erroresLexicos.forEach(error => {
            pyShell.innerHTML += `<<Error Lexico>> El caracter ${error.lexema} no pertenece al lenguaje\n`;
        });

        pyShell.innerHTML += "\n\n\n==========================================\nANALISIS SINTACTICO\n==========================================\n";

        data.bitacoraSintactico.forEach(info => {
            pyShell.innerHTML += info + "\n";
        })

        // DESCARGAR TRADUCCION DEL ARCHIVO
        descargarArchivo(data.traduccion);
    })

    
}

function sendPOSTFileJS(name, content){
    fetch("http://localhost:8000/file/js", {
        method: "POST",
        body: JSON.stringify({
            name: name,
            content: content,
            type: "js"
        })
    })
    .then(response => response.json())
    .then(data => console.log(data))
}


function descargarArchivo(contenido){
    let nombreArchivo = "traduccion.py";

    let blob = new Blob([contenido], {type: "text/plain"});
    let url = window.URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = nombreArchivo;
    a.click();
}
