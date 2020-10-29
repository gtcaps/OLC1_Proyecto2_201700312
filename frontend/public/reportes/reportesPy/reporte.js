fetch("http://localhost:8000/file/python")
    .then(response => response.json())
    .then(data => {
        console.log(data);
        generarReporteTokens(data.tokens);
        generarReporteErrores(data.erroresLexicos, data.erroresSintacticos);
    })

function generarReporteTokens(tokens){
    let tabla = document.getElementById("tableTokens_body");
    if (tabla) {
        let contTokens = 0;
        tokens.forEach(token => {
            tabla.innerHTML += `<tr>
                <td>${++contTokens}</td>
                <td>${token.tipoString}</td>
                <td>${token.lexema}</td>
                <td>${token.linea}</td>
                <td>${token.columna}</td>
            <tr>`
            })
    }
}

function generarReporteErrores(erroresLexicos, erroresSintacticos) {
    let tabla = document.getElementById("tableErrores_body");
    if (tabla) {
        let contTokens = 0;
        erroresLexicos.forEach(lex => {
            tabla.innerHTML += `<tr>
                <td>${++contTokens}</td>
                <td>Error Lexico</td>
                <td>El carácter ${lex.lexema} no pertence al lenguaje</td>
                <td>${lex.linea}</td>
                <td>${lex.columna}</td>
            <tr>`
            })

        erroresSintacticos.forEach(sin => {
            tabla.innerHTML += `<tr>
                <td>${++contTokens}</td>
                <td>Error Sintactico</td>
                <td>${sin.descripcion}</td>
                <td>${sin.linea}</td>
                <td>${sin.columna}</td>
            <tr>`
            })

        if (erroresSintacticos.length == 0 && erroresLexicos.length == 0) {
            tabla.innerHTML += `<tr>
                <td>${++contTokens}</td>
                <td>Sin error</td>
                <td>No hay errores lexicos ni sintacticos</td>
                <td>0</td>
                <td>0</td>
            <tr>`
        }
    }
}