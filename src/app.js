const express = require('express');
const path = require('path');
const morgan = require('morgan');

const indexRouter = require('./routers/index.router');
const cartRouter = require('./routers/carts.router');
const productRouter = require('./routers/products.router');
const ProductManager = require('./ProductManager');

const app = express();
const PORT = 8080;

//Middleware de terceros
app.use(morgan('dev'));

// MIDDLEWARE DE APLICACION
app.use((req, res, next) => {
    console.log('Se ha recibido una nueva solicitud')
    next();
})

//MIDDLEWARES Incorporados
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

//Middleware de router
// app.use('/', viewsRouter);
// app.use('/api', userRouter, productsRouter, cartsRouter);
app.use('/', indexRouter);
app.use('/api', cartRouter, productRouter);


//Middleware de manejo de errores
app.use((error, req, res, next) => {
    console.log('Ha ocurrido un error: ', error.message);
    res.status(500).json({ status: 'error', message: 'Ha ocurrido un error desconocido, intente mas tarde' })
});

app.listen(PORT, () => {
    console.log(`Running on ${PORT}`)
    console.log(`Error que aún tengo: Al realizar PUT en product para cambiar el "code", no me funciona correctamente, no entiendo por qué.`)
})




// FALTA HACER LO DE CARRITO