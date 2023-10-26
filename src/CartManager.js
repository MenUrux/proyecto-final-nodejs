const fs = require('fs');  // Modificación aquí para simplificar el uso posterior

class Cart {
    constructor(id) {
        this.id = id;
        this.products = [];
    }
}

class CartManager {
    constructor() {
        this.carts = [];
        this.path = './carts-data.json';
        this.nextId = 1;  // Inicializar nextId aquí
        this.load();
    }

    async save() {
        if (!this.carts) {   // Modificación aquí
            console.log('[save]\tthis.carts is undefined. Aborting save operation.');   // Modificación aquí
            return;
        }

        const content = JSON.stringify(this.carts, null, "\t");  // Modificación aquí
        try {
            console.log('[save]\tEscribiendo contenido en el path CART', this.path);
            await fs.promises.writeFile(this.path, content, "utf-8");
        } catch (error) {
            console.log('[save]\tHa ocurrido un error: ', error);
        }
    }

    // async load() {
    //     try {
    //         const data = await fs.readFile(this.path, 'utf-8');
    //         this.carts = JSON.parse(data);
    //         console.log("[load]\tDatos cargados CART: ", this.carts);
    //     } catch (error) {
    //         console.log("[load]\tError al cargar los datos CART:", error);
    //     }
    // }



    async load() {
        try {
            if (fs.existsSync(this.path)) {
                const jsonToArray = await fs.promises.readFile(this.path, "utf-8");
                this.carts = JSON.parse(jsonToArray);
                console.log("[load]\tDatos cargados CART: ", this.carts);

                if (this.carts.length > 0) {
                    const maxId = Math.max(...this.carts.map(cart => cart.id));   // Modificación aquí
                    this.nextId = maxId + 1;
                }
            } else {
                console.log("[load]\tEl archivo no existe.");
            }
        } catch (error) {
            console.log("[load]\tError al cargar los datos:", error);
        }
    }




    async addCart() {
        const newCart = {
            id: this.nextId,
            products: [],
        };

        this.carts.push(newCart);
        this.nextId++;  // Incrementa el ID para el próximo carrito

        await this.save();
        return newCart;
    }


    async getCart(id) {
        return this.carts.find(cart => cart.id === id) || null;
    }

    async getCarts() {
        return this.carts;
    }

}

module.exports = CartManager;

