const fs = require("fs").promises;

class Product {
    constructor(id, title, description, price, status, thumbnail, code, stock) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.status = status;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }
}

class ProductManager {
    constructor() {
        this.products = [];
        this.path = './products-data.json';
        this.nextId = 1;
        this.load();  // Cargar datos al iniciar
        console.log('[ProductManager]\tSe creo una instancia');
    }

    async save() {
        const content = JSON.stringify(this.products, null, "\t");
        try {
            console.log('[save]\tEscribiendo contenido en el path', this.path);
            await fs.writeFile(this.path, content, "utf-8");
        } catch (error) {
            console.error('[save]\tHa ocurrido un error: ', error);
        }
    }

    async load() {
        try {
            const jsonToArray = await fs.readFile(this.path, "utf-8");
            this.products = JSON.parse(jsonToArray);
            console.log("[load]\tDatos cargados:", this.products);

            if (this.products.length > 0) {
                const maxId = Math.max(...this.products.map(product => product.id));
                this.nextId = maxId + 1;
            }
        } catch (error) {
            if (error.code === "ENOENT") {
                console.error("[load]\tEl archivo no existe.");
            } else {
                console.error("[load]\tError al cargar los datos:", error);
            }
        }
    }

    async addProduct(title, description, price, status, thumbnail, code, stock) {
        // Verificación de campos requeridos
        if (!title || !description || !price || !status || !thumbnail || !code || !stock) {
            console.error('[addProduct]\tTodos los campos son requeridos, no se agregó ningún producto.');
            return;
        }

        // Verificación de código
        const existingProductByCode = this.getProductByCode(code);
        if (existingProductByCode) {
            console.error(`[addProduct]\tYa existe un producto con el código: ${code}`);
            return;
        }

        const product = new Product(this.nextId, title, description, price, status, thumbnail, code, stock);
        this.products.push(product);
        this.nextId++;

        await this.save();

        return product;
    }

    getProductByCode(code) {
        return this.products.find(product => product.code === code) || null;
    }

    async getProductById(id) {
        return this.products.find(product => product.id === id) || null;
    }

    async updateProduct(id, title, description, price, status, thumbnail, code, stock) {
        const product = this.getProductById(id);

        if (!product) {
            console.error(`[updateProduct]\tNo se encontró el producto con el ID ${id}`);
            return;
        }

        if (code && code !== product.code) {
            const existingProduct = this.getProductByCode(code);
            if (existingProduct) {
                console.error(`[updateProduct]\tYa existe un producto con el código: ${code}`);
                return;
            }
        }

        product.title = title || product.title;
        product.description = description || product.description;
        product.price = price || product.price;
        product.status = status || product.status;
        product.thumbnail = thumbnail || product.thumbnail;
        product.stock = stock || product.stock;

        if (code) product.code = code;

        await this.save();

        return product;
    }

    async deleteProduct(id) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products.splice(index, 1);
            await this.save();
            return true;
        }
        return false;
    }

    async getProducts() {
        return this.products;
    }
}

module.exports = ProductManager;
