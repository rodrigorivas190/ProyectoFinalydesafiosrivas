//Router de carritos
import fs from 'fs';

export default class CartManager {
	static id = 0; // ID que será vistos por todas las instancias

	constructor(myPath) {
		this.carts = [];
		this.path = myPath;
		//Si no existe el archivo lo creo de forma sincronica con un array vacío
		if (!fs.existsSync('./carrito.json')) {
			fs.promises.writeFile(`${this.path}`, JSON.stringify(this.carts));
		}
	}

	//Método para agregar productos al archivo
	async addNewCart() {
		this.carts = await this.getCarts();

		let Ids = this.carts.map((prod) => prod.id); //Leo los Ids de los Carts del archivo

		let maxId = Ids.reduce(function (mayor, numero) {
			//busco el mayor ID
			if (numero > mayor) {
				mayor = numero;
			}
			return mayor;
		}, Ids[0]);

		if (this.carts.length === 0) {
			//Si el archivo esta vacío asigno el valor 0 al ID
			CartManager.id = 0;
		} else {
			CartManager.id = maxId + 1; //sino, le sumo 1
		}

		let newCart = {
			id: CartManager.id,
			products: [],
		};

		this.carts.push(newCart); //agrego el nuevo carrito al archivo
		CartManager.id += 1; //incremento contador ID
		//Escribo el file utilizando promesas y esperando a que se cumpla la misma
		await fs.promises.writeFile(`${this.path}`, JSON.stringify(this.carts));
	}

	//Método para adquirir el listado de carritos desde el archivo.
	async getCarts() {
		const actualCarts = await fs.promises.readFile(`${this.path}`, 'utf-8');
		return JSON.parse(actualCarts);
	}

	//Método para adquirir un producto especifico por ID
	async getCartById(idBuscado) {
		const cartById = await this.getCarts();

		const result = cartById.find((element) => element.id === idBuscado); // busco el elemento que coincida con el ID indicado
		if (result) {
			// Si encuentro el ID devuelvo el listado de productos, sino devuelvo error
			return result.products;
		} else {
			return { error: `Error: Cart ID=${idBuscado} not found` };
		}
	}

	//Método agregar un producto al carrito
	async addProductToCart(cartId, productId) {
		let existe = false; // flag para indicar si el producto ya existe en el carrito
		const productCarts = await this.getCarts();
		const newProduct = {
			product: productId,
			quantity: 1,
		};

		let cartsId = productCarts.map((element) => element.id); // me quedo con todos los códigos del array productos
		const result = cartsId.find((element) => element === cartId); // busco el elemento que coincida con el ID indicado
		if (result === undefined) return { error: `Error: Cart ID=${cartId} not found` }; //si no lo encuentra retorno error

		productCarts.map((cart) => {
			//recorro el array buscando el ID del carrito indicado
			if (cart.id === cartId) {
				cart.products.map((prod) => {
					//por cada carrito busco el producto indicado
					if (prod.product === productId) {
						//Si existe sumo una unidad
						prod.quantity += 1;
						existe = true; //enciendo flag
					}
				});
				if (!existe) {
					//Si no axiste el producto lo agrego
					cart.products.push(newProduct);
					existe = false;
				}
			}
		});
		await fs.promises.writeFile(`${this.path}`, JSON.stringify(productCarts));
		return { status: 'sucess', message: `product ID=${productId} added to cart ID=${cartId}` };
	}
}
