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
    .then(data => console.log(data))
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

// function getData() {
//     fetch("https://jsonplaceholder.typicode.com/users")
//     .then(response => response.json())
//     .then(data => console.log(data))
// }