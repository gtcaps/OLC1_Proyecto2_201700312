package main

import (
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"fmt"
)

type FileJava struct {
	Name string `json:"name"`
	Content string `json:"content"`
}

var f FileJava

func POSTFile(w http.ResponseWriter, r *http.Request) {
	// var file FileJava
	req, err := ioutil.ReadAll(r.Body)	
	if err != nil {
		fmt.Fprintf(w, "Insert a valid File")
	}

	json.Unmarshal(req, &f)
	fmt.Println(f)

	// responder al cliente
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(f)
	
}

func GETFile(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type","application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(f)
}

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


	router.Handle("/", http.FileServer(http.Dir("./frontend/public")))
	router.HandleFunc("/api/file", POSTFile).Methods("POST")
	router.HandleFunc("/file", GETFile).Methods("GET")
	http.ListenAndServe(":8080", handlers.CORS(headers, methods, origins)(router))
	
}