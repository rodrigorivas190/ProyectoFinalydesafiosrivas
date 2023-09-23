//Router de carritos
import fs from 'fs';

export default class CartManager {
	static id = 0; // ID que será vistos por todas las instancias

	constructor() {
		this.carts = [];
		this.path = './carrito.json';
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

	//Método para adquirir cart especifico por ID
	async getCartById(idBuscado) {
		const cartById = await this.getCarts();

		const result = cartById.find((element) => element.id === idBuscado); // busco el elemento que coincida con el ID indicado
		return result;
	}

	//Método agregar un producto al carrito
	async addProductToCart(cartId, newProductArray) {
		const productCarts = await this.getCarts();

		productCarts.map((cart) => {
			//recorro el array buscando el ID del carrito indicado
			if (cart.id === cartId) {
				cart.products = newProductArray;
			}
		});
		await fs.promises.writeFile(`${this.path}`, JSON.stringify(productCarts));
	}

	getIndex(cart, productId) {
		return cart.products.indexOf(cart.products.find((element) => element.product.id.toString() === productId));
	}
}
