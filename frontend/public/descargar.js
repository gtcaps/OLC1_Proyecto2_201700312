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
        let pyShell = document.getElementById("consolaPython");
        let str = ""
        data.tokens.forEach(token => {
            str += `Token: ${token.tipo}       Lexema: ${token.lexema}      Linea: ${token.linea}       Columna: ${token.columna}\n`;
        });
        pyShell.innerHTML += str;
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

