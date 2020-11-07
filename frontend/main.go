package main

import (
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"bytes"
	"fmt"
	"os"
	"os/exec"
)

type Token struct {
	Tipo int `json:"tipo"`
	Lexema string `json:"lexema"`
	Linea int `json:"linea"`
	Columna int `json:"columna"`
	TipoString string `json:"tipoString"`
}

type TokenJS struct {
	Tipo string `json:"tipo"`
	Lexema string `json:"lexema"`
	Linea int `json:"linea"`
	Columna int `json:"columna"`
}

type Error struct {
	Linea int `json:"linea"`
	Columna int `json:"columna"`
	Descripcion string `json:"descripcion"`
}

type FileJava struct {
	Name string `json:"name"`
	Content string `json:"content"`
	Type string `json:"type"`
	Tokens []Token `json:"tokens"`
	ErroresLexicos []Token `json:"erroresLexicos"`
	ErroresSintacticos []Error `json:"erroresSintacticos"`
	BitacoraSintactico []string `json:"bitacoraSintactico"`
	Traduccion string `json:"traduccion"`
	Arbol string `json:"arbol"` 

}

type FileJavaJS struct {
	Name string `json:"name"`
	Content string `json:"content"`
	Type string `json:"type"`
	Tokens []TokenJS `json:"tokens"`
	Errores []TokenJS `json:"errores"`
	Traduccion string `json:"traduccion"`
	Arbol string `json:"arbol"`
}

var f FileJava
var fjs FileJavaJS

// CREAR REPORTE
func crearArchivo() {
	var ruta = "./public/reportes/reportesPy/arbol.dot"

	// Creo el directorio por si no existe
	err := os.Mkdir("./public/reportes/reportesPy", 0755)
	if err != nil {
		fmt.Println("No se pudo crear la ruta")
	}

	_, err = os.Stat(ruta)
	if os.IsNotExist(err) {
		var archivo, err = os.Create(ruta)
		if err != nil {
			fmt.Println("No se pudo crear la ruta")
		}
		
		_, err  = archivo.WriteString(f.Arbol)
		if err != nil {
			fmt.Println("No se pudo escribir en el archivo")
		}

		err = archivo.Sync()
		if err != nil {
			return
		}

		defer archivo.Close()
		fmt.Println("Archivo creado");

		

	} 

	err = os.Remove("./public/reportes/reportesPy/arbol.png");
	if err != nil {
		fmt.Println("Error al eliminar el .png");
	}

	out, err := exec.Command("dot","-Tpng","./public/reportes/reportesPy/arbol.dot","-o","./public/reportes/reportesPy/arbol.png").Output();
	if err != nil {
		fmt.Println("No pude ejecutar el comando")
	}

	fmt.Println("--->" + string(out));

	//ELIMINAR EL ARCHIVO .DOT
	err = os.Remove(ruta);
	if err != nil {
		fmt.Println("Error al eliminar el .dot");
	}

	
}

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
	PostPython("3000")

	// responder al cliente
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(f)

	crearArchivo()
}

func GETFilePython(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type","application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(f)
}

func PostPython(port string)  {
	var url = nodeURL_py + "/"

	fmt.Println("Enviando a Node Python")
	jsonReq, err := json.Marshal(f)
	resp, err := http.Post(url , "application/json; charset=utf-8", bytes.NewBuffer(jsonReq))
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

	json.Unmarshal(req, &fjs)
	// fmt.Println(f)

	// Enviar a Node el Archivo
	PostJS("4000")

	// responder al cliente
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(fjs)

}

func GETFileJS(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type","application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(fjs)
}

func PostJS(port string)  {
	var url = nodeURL_js + "/"

	fmt.Println("Enviando a Node")
	jsonReq, err := json.Marshal(fjs)
	resp, err := http.Post(url , "application/json; charset=utf-8", bytes.NewBuffer(jsonReq))
	if err != nil {
		fmt.Println(err)
	}

	defer resp.Body.Close()
	bodyBytes, _ := ioutil.ReadAll(resp.Body)

	// Convertir respuesta a string
	// bodyString := string(bodyBytes)
	// fmt.Println(bodyString)
	
	// Convertir respuesta a struct file
	json.Unmarshal(bodyBytes, &fjs)
	// fmt.Printf("%+v\n", fjs)

	crearArchivoJS();
}

func crearArchivoJS() {
	var ruta = "./public/reportes/reportesJS/arbol.dot"

	// Creo el directorio por si no existe
	err := os.Mkdir("./public/reportes/reportesJS", 0755)
	if err != nil {
		fmt.Println("No se pudo crear la ruta")
	}

	_, err = os.Stat(ruta)
	if os.IsNotExist(err) {
		var archivo, err = os.Create(ruta)
		if err != nil {
			fmt.Println("No se pudo crear la ruta")
		}
		
		_, err  = archivo.WriteString(fjs.Arbol)
		if err != nil {
			fmt.Println("No se pudo escribir en el archivo")
		}

		err = archivo.Sync()
		if err != nil {
			return
		}

		defer archivo.Close()
		fmt.Println("Archivo creado");


	} 

	// err = exec.Command("cmd", "/c", "dot -Tpng ./public/reportes/reportesJS/arbol.dot -o ./public/reportes/reportesJS/arbol.png").Run()
	// if err != nil {
	// }

	err = os.Remove("./public/reportes/reportesJS/arbol.png");
	if err != nil {
		fmt.Println("Error al eliminar el .png");
	}

	out, err := exec.Command("dot","-Tpng","./public/reportes/reportesJS/arbol.dot","-o","./public/reportes/reportesJS/arbol.png").Output();
	if err != nil {
		fmt.Println("No pude ejecutar el comando")
	}

	fmt.Println("--->" + string(out));

	//ELIMINAR EL ARCHIVO .DOT
	err = os.Remove(ruta);
	if err != nil {
		fmt.Println("Error al eliminar el .dot");
	}

}
//==================================================================================



// MAIN ===============================


var nodeURL_py = ""
var nodeURL_js = ""

func main() {

	// ---------- NODE API PYTHON -----------------
	pyip, defip := os.LookupEnv("PYIP")
	pyport, defport := os.LookupEnv("PYPORT")

	if !defip {
		pyip = "182.168.0.5"
	}

	if !defport {
		pyport = "3000"
	}

	nodeURL_py = "http://" + pyip + ":" + pyport

	// ---------- NODE API JS -----------------
	jsip, defip := os.LookupEnv("JSIP")
	jsport, defport := os.LookupEnv("JSPORT")

	if !defip {
		jsip = "182.168.0.9"
	}

	if !defport {
		jsport = "4000"
	}

	nodeURL_js = "http://" + jsip + ":" + jsport

	// ---------- GO -----------------
	ip, defip := os.LookupEnv("GOIP")
	port, defport := os.LookupEnv("GOPORT")

	if !defip {
		ip = "192.168.0.7"
	}

	if !defport {
		port = "8000"
	}


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
	http.ListenAndServe(ip + ":" + port, handlers.CORS(headers, methods, origins)(router))
	
}