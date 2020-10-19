let tabs = Array.from(document.querySelectorAll(".tab"));
let panels = Array.from(document.querySelectorAll(".panel"));
let editors = []

// EDITOR INICIAL
let editor = document.getElementById("editor");
let e = CodeMirror.fromTextArea(editor, {
    mode: "text/x-java",
    lineNumbers: true,
    theme: "material-darker"
});
e.setSize("","750px");
editors.push(e)


// ELIMINAR LA CLASE ACTIVE
function removeActive() {
    tabs.map(tab => tab.classList.remove("active"))
    panels.map(panel => panel.classList.remove("active"))
}

// EVENTO PARA DETECTAR LA PESTAÑA SELECCIONADA
document.getElementById("tabs").addEventListener("click", event => {
    if (event.target.classList.contains("tab")){
        let i = tabs.indexOf(event.target);
        removeActive();
        tabs[i].classList.add("active");
        panels[i].classList.add("active");
    }
});

// FUNCION PARA CREAR UN ARCHIVO NUEVO DENTRO DEL EDITOR
function nuevoArchivo(nombreTab = "new.java", contenido = "") {
    removeActive();

    let li = document.createElement("li");
    li.className = "tab active";
    li.innerHTML = nombreTab;

    let div = document.createElement("div");
    div.className = "panel active";

    let txtArea = document.createElement("textarea");
    txtArea.className = "editor"
    txtArea.value = contenido
    
    div.appendChild(txtArea)

    tabs.push(li);
    panels.push(div);
    document.getElementById("tabs").appendChild(li);
    document.getElementById("panels").appendChild(div)

    let ed = CodeMirror.fromTextArea(txtArea, {
        mode: "text/x-java",
        lineNumbers: true,
        theme: "material-darker"
    });
    ed.setSize("100%","750px");
    editors.push(ed);
}

// EVENTO QUE CREA EL NUEVO DOCUMENTO EN BLANCO
document.getElementById("nuevoDoc").addEventListener("click", () => {
    nuevoArchivo();
});

// EVENTO QUE CIERRA LAS PESTAÑAS
document.getElementById("cerrarDoc").addEventListener("click", () => {
    let i = tabs.findIndex(tab => tab.classList.contains("active"));
    let tab = tabs[i];
    let panel = panels[i];
    
    tab.parentNode.removeChild(tab);
    panel.parentNode.removeChild(panel)

    tabs.splice(i,1);
    panels.splice(i,1);

    if (tabs.length > 0) {
        tabs[0].classList.add("active");
        panels[0].classList.add("active");
    }
    

});

// EVENTO QUE GUARDA EL DOCUMENTO QUE SE TIENE EN EL EDITOR
document.getElementById("guardarDoc").addEventListener("click", () => {
    let i = tabs.findIndex(tab => tab.classList.contains("active"));
    let ed = editors[i]

    let blob = new Blob([ed.getValue()], {type: "text/plain"});
    let url = window.URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = tabs[i].textContent;
    a.click();
    
});

// EVENTO QUE ABRE UN DOCUMENTO DEL EQUIPO
document.getElementById("abrirDoc").addEventListener("click", ()=> {
    let archivo = document.getElementById("fileInput").click();
});

// FUNCION PARA ABRIR EL ARCHIVO SELECCIONADO DEL EQUIPO
function abrirArchivo(archivos) {
    let archivo = archivos.files[0];
    let lector = new FileReader();
    lector.onload = e => {
        let contents = e.target.result;
        nuevoArchivo(archivo.name,contents)
    };
    lector.readAsText(archivo);
    archivo.clear;

    document.getElementById("fileInput").value = "";

}

// Botones para descargar
document.getElementById("descargarPython").addEventListener("click", () => {
    let i = tabs.findIndex(tab => tab.classList.contains("active"));
    sendPOSTFilePython(tabs[i].textContent, editors[i].getValue());
})