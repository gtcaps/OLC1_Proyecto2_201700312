package main

import (
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"bytes"
	"fmt"
)

type Token struct {
	Tipo int `json:"tipo"`
	Lexema string `json:"lexema"`
	Linea int `json:"linea"`
	Columna int `json:"columna"`
	TipoString string `json:"tipoString"`
}

type FileJava struct {
	Name string `json:"name"`
	Content string `json:"content"`
	Type string `json:"type"`
	Tokens []Token `json:"tokens,omitempty"`
}

var f FileJava

// PYTHON ============================================

func POSTFilePython(w http.ResponseWriter, r *http.Request) {
	// var file FileJava
	req, err := ioutil.ReadAll(r.Body)	
	if err != nil {
		fmt.Fprintf(w, "Insert a valid File")
	}

	json.Unmarshal(req, &f)
	// fmt.Println(f)

	// Enviar a Node el Archivo
	Post("3000")

	// responder al cliente
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(f)
}

func GETFilePython(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type","application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(f)
}

func Post(port string)  {
	fmt.Println("Enviando a Node")
	jsonReq, err := json.Marshal(f)
	resp, err := http.Post("http://localhost:" + port +"/"  , "application/json; charset=utf-8", bytes.NewBuffer(jsonReq))
	if err != nil {
		fmt.Println(err)
	}

	defer resp.Body.Close()
	bodyBytes, _ := ioutil.ReadAll(resp.Body)

	// Convertir respuesta a string
	// bodyString := string(bodyBytes)
	// fmt.Println(bodyString)
	
	// Convertir respuesta a struct file
	// var fileStruct FileJava
	json.Unmarshal(bodyBytes, &f)
	fmt.Printf("%+v\n", f)
}
// //==================================================================================

// JAVASCRIPT====================================
func POSTFileJS(w http.ResponseWriter, r *http.Request) {
	// var file FileJava
	req, err := ioutil.ReadAll(r.Body)	
	if err != nil {
		fmt.Fprintf(w, "Insert a valid File")
	}

	json.Unmarshal(req, &f)
	// fmt.Println(f)

	// responder al cliente
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(f)

	// Enviar a Node el Archivo
	Post("6000")
}

func GETFileJS(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type","application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(f)
}
//==================================================================================



// MAIN ===============================

func main() {
	fmt.Println("Starting Server")

	router := mux.NewRouter().StrictSlash(false)
	headers := handlers.AllowedHeaders([]string{
		"X-Requested-With",
		"Content-Type",
		"Authorization",
	})
	methods := handlers.AllowedMethods([]string{
		"GET",
		"POST",
	})
	origins := handlers.AllowedOrigins([]string{"*",})


	router.HandleFunc("/file/python", POSTFilePython).Methods("POST")
	router.HandleFunc("/file/python", GETFilePython).Methods("GET")
	router.HandleFunc("/file/js", POSTFileJS).Methods("POST")
	router.HandleFunc("/file/js", GETFileJS).Methods("GET")
	router.PathPrefix("/").Handler(http.FileServer(http.Dir("./public/")))
	http.ListenAndServe(":8000", handlers.CORS(headers, methods, origins)(router))
	
}