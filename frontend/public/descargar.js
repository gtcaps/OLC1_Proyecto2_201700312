function sendPOSTFilePython(name, content){
    fetch("http://localhost:8080/api/file", {
        method: "POST",
        body: JSON.stringify({
            name: name,
            content: content
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