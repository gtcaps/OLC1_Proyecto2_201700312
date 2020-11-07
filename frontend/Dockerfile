FROM golang

WORKDIR /app

RUN go get github.com/gorilla/mux
RUN go get github.com/gorilla/handlers
RUN apt-get update
RUN apt install graphviz -y

COPY  . /app/

CMD ["go","run","main.go"]

EXPOSE 8000
