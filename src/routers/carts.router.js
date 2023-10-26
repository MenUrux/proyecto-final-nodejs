const { Router } = require('express');
const CartManager = require('../CartManager');
const ProductManager = require('../ProductManager');
const pManager = new ProductManager();
const cManager = new CartManager();

const carts = cManager.load();

console.log(carts)

const router = Router();

router.post('/carts', async (req, res) => {
    try {
        const newCart = cManager.addCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el carrito', error: error.message });
    }
});


router.get('/carts/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cManager.getCart(cid);
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        res.json(cart.products);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el carrito', error: error.message });
    }
});

router.get('/carts', async (req, res) => {
    try {
        const { limit } = req.query;
        const carts = await cManager.getCarts();
        let result;

        if (limit) {
            const numLimit = parseInt(limit, 10);
            if (!isNaN(numLimit)) {
                result = carts.slice(0, numLimit);
            } else {
                return res.status(400).json({ message: "El valor de 'limit' debe ser un número." });
            }
        } else {
            result = carts;
        }

        if (result.length === 0) {
            res.status(404).json({ message: "No se encontraron carts." });
        } else {
            res.json(result);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener carts', error: error.message });
    }
});



router.get("/carts/:cid", async (req, res) => {
    const id = req.params.cid;

    try {


        if (carrito) {
            res.status(200).json(carrito);
        } else {
            res.status(404).json({ error: "Carrito no encontrado" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

router.post('/carts/:cid/product/:pid', async (req, res) => {
    try {
        console.log('Ruta accedida: POST /:cid/product/:pid');

        const { cid, pid } = req.params;
        const cart = await cManager.getCart(cid);
        const product = await pManager.getProductById(pid);
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        const updatedCart = await cManager.addProductToCart(cid, pid);
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar el producto al carrito', error: error.message });
    }
});

module.exports = router;
