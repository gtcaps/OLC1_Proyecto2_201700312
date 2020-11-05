const express = require('express');
const app = express();
const morgan = require('morgan');

// Configuraciones
app.set('port', process.env.PORT || 4000);
app.set('json spaces', 2);

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET', 'POST', 'PUT', 'DELETE');
    res.header('Allow', 'GET', 'POST', 'UPDATE', 'DELETE');
    next();

});

// MIDDLEWARES
app.use(morgan('dev'));
app.use(express.json());

// Rutas
app.use(require('./routes/index'));

// Empezando el servidor
app.listen(app.get('port'), () => {
    console.log(`Server on Port: ${app.get('port')}`);
});