const { Router } = require('express');
const { v4: uuidV4 } = require('uuid');

const router = Router();

const ProductManager = require('../ProductManager.js');
const CartManager = require('../CartManager.js');

const manager = new ProductManager();
const cmanager = new CartManager();

router.get('/error-demo', (req, res) => {
    // Generar error
    throw new Error('Error de prueba')
    res.status(200).json({ message: 'Welcome to new server in express js' })
})


router.get('/products', async (req, res) => {
    try {
        const { limit } = req.query;
        const products = await manager.getProducts();
        let result;

        if (limit) {
            const numLimit = parseInt(limit, 10);
            if (!isNaN(numLimit)) {
                result = products.slice(0, numLimit);
            } else {
                return res.status(400).json({ message: "El valor de 'limit' debe ser un número." });
            }
        } else {
            result = products;
        }

        // Verificar si el resultado está vacío
        if (result.length === 0) {
            res.status(404).json({ message: "No se encontraron productos." });
        } else {
            res.json(result);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos', error: error.message });
    }
});


router.get('/products/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const products = await manager.getProducts();
        const product = products.find((p) => p.id === parseInt(pid));

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'No se ha encontrado el producto' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el producto', error: error.message });
    }
});

// router.post('/products', async (req, res) => {
//     try {
//         const { body } = req;

//         const newProduct = {
//             ...body,
//             id: uuidV4(),
//         };

//         await manager.addProduct(newProduct);

//         res.status(201).json(newProduct);
//     } catch (error) {
//         res.status(500).json({ message: 'Error al agregar el producto', error: error.message });
//     }
// });

router.post('/products', async (req, res) => {
    try {
        const { body } = req;
        const newProduct = {
            ...body,
            id: uuidV4(),
        };
        await manager.addProduct(newProduct.title, newProduct.description, newProduct.price, newProduct.status, newProduct.thumbnail, newProduct.code, newProduct.stock);

        console.log(await manager.getProducts());

        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar el producto', error: error.message });
    }
});


router.put("/products/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id); // Convierte el ID a un número
        const updatedProductData = req.body;

        // Consulta el producto requerido
        const productoRequerido = await manager.getProducts();

        // Busca el índice del producto en el arreglo
        const index = productoRequerido.findIndex((product) => product.id === id);

        if (index === -1) {
            // Si el producto no se encuentra, devuelve un error
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        // Actualiza el producto
        productoRequerido[index] = {
            ...productoRequerido[index],
            ...updatedProductData,
        };

        // Escribe el producto actualizado
        await manager.save();

        // Responde con el producto actualizado
        res.json(productoRequerido[index]);
    } catch (error) {
        console.error("Error en la actualización del producto:", error);
        res.status(500).json({ message: "Error en la actualización del producto" });
    }
});

router.delete('/products/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        // Convertir pid a número si es necesario
        const numericPid = isNaN(pid) ? pid : parseInt(pid, 10);

        const deletedProduct = await manager.deleteProduct(numericPid);

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado.' });
        }

        res.status(200).json({ message: 'Producto eliminado exitosamente.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el producto', error: error.message });
    }
});



//Se creará una instancia de la clase “ProductManager”


manager.addProduct('Manzana', 'Manzana roja', 70.00, true, './img/manzanaroja.png', 'F10210', 50)
manager.addProduct('Manzana', 'Manzana roja', 70.00, true, './img/manzanaroja.png', 'F102111', 50)
// console.log('addProduct(Banana) =>', manager.addProduct('Banana', 'Banana amarilla', 50.00, './img/banana.png', 'F1022', 70));
// console.log('addProduct(Naranja) =>', manager.addProduct('Naranja', 'Naranja dulce', 60.00, './img/naranja.png', 'F1023', 60));
// console.log('addProduct(Uva) =>', manager.addProduct('Uva', 'Uva morada', 80.00, './img/uva.png', 'F1024', 40));
// console.log('addProduct(Piña) =>', manager.addProduct('Piña', 'Piña tropical', 90.00, './img/pina.png', 'F1025', 30));
// console.log('addProduct(Mango) =>', manager.addProduct('Mango', 'Mango delicioso', 95.00, './img/mango.png', 'F1026', 35));
// console.log('addProduct(Pera) =>', manager.addProduct('Pera', 'Pera verde', 65.00, './img/pera.png', 'F1027', 45));
// console.log('addProduct(Kiwi) =>', manager.addProduct('Kiwi', 'Kiwi verde', 85.00, './img/kiwi.png', 'F1028', 40));
// console.log('addProduct(Cereza) =>', manager.addProduct('Cereza', 'Cereza roja', 110.00, './img/cereza.png', 'F1029', 35));
// console.log('addProduct(Mora) =>', manager.addProduct('Mora', 'Mora negra', 90.00, './img/mora.png', 'F1030', 45));
// console.log('addProduct(Frambuesa) =>', manager.addProduct('Frambuesa', 'Frambuesa roja', 115.00, './img/frambuesa.png', 'F1031', 38));
// console.log('addProduct(Durazno) =>', manager.addProduct('Durazno', 'Durazno jugoso', 75.00, './img/durazno.png', 'F1032', 50));
// console.log('addProduct(Sandía) =>', manager.addProduct('Sandía', 'Sandía refrescante', 130.00, './img/sandia.png', 'F1033', 25));
// console.log('addProduct(Melón) =>', manager.addProduct('Melón', 'Melón dulce', 120.00, './img/melon.png', 'F1034', 28));
// console.log('addProduct(Coco) =>', manager.addProduct('Coco', 'Coco tropical', 140.00, './img/coco.png', 'F1035', 20));
// console.log('addProduct(Granada) =>', manager.addProduct('Granada', 'Granada roja', 100.00, './img/granada.png', 'F1036', 30));
// console.log('addProduct(Papaya) =>', manager.addProduct('Papaya', 'Papaya naranja', 95.00, './img/papaya.png', 'F1037', 32));
// console.log('addProduct(Higo) =>', manager.addProduct('Higo', 'Higo morado', 105.00, './img/higo.png', 'F1038', 33));


manager.load()
cmanager.load()

console.log(`------------------------------`)



module.exports = router;