fetch("http://localhost:8000/file/js")
    .then(response => response.json())
    .then(data => {
        generarReporteTokens(data.tokens);
        generarReporteErrores(data.errores);
    })

function generarReporteTokens(tokens){
    let tabla = document.getElementById("tableTokens_body");
    if (tabla) {
        let contTokens = 0;
        tokens.forEach(token => {
            tabla.innerHTML += `<tr>
                <td>${++contTokens}</td>
                <td>${token.tipo}</td>
                <td>${token.lexema}</td>
                <td>${token.linea}</td>
                <td>${token.columna}</td>
            <tr>`
            })
    }
}

function generarReporteErrores(errores) {
    let tabla = document.getElementById("tableErrores_body");
    if (tabla) {
        let contTokens = 0;
        errores.forEach(lex => {
            tabla.innerHTML += `<tr>
                <td>${++contTokens}</td>
                <td>Error Lexico</td>
                <td>El carácter ${lex.lexema} no pertence al lenguaje</td>
                <td>${lex.linea}</td>
                <td>${lex.columna}</td>
            <tr>`
            })

       

        if (errores.length == 0) {
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