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
        descargarArchivo(data.traduccion,"py");
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
    .then(data => {

        let jsShell = document.getElementById("consolaJS");
        let str = "==========================================\nANALISIS LEXICO\n==========================================\n";
        
        data.tokens.forEach(token => {
            if (token.tipo == "Comentario" || token.tipo == "Comentario Multilinea") {
                // Comentarios
            } else {
                str += `Token: ${token.tipo}       Lexema: ${token.lexema}      Linea: ${token.linea}       Columna: ${token.columna}\n`;
            }
        });

        jsShell.innerHTML = str + "\n\n";
        jsShell.innerHTML += "\n\n\n==========================================\nERRORES\n==========================================\n";
        
        if (data.errores.length > 0) {
            data.errores.forEach(error => {
                jsShell.innerHTML += `<<${error.tipo}>> ${error.lexema}     Linea: ${error.linea}       Columna: ${error.columna}\n`;
            });
        } else {
            jsShell.innerHTML += `<< Sin Errores Lexicos ni Sintacticos>>\n`;
        }
        
        descargarArchivo(data.traduccion, "js");
    
    })
}


function descargarArchivo(contenido, extension){
    let nombreArchivo = "traduccion." + extension;

    let blob = new Blob([contenido], {type: "text/plain"});
    let url = window.URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = nombreArchivo;
    a.click();
}
