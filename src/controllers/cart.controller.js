//importación de service.

import { CartService } from '../repositories/cart/index.js';
import productController from './product.controller.js';
import userController from './user.controller.js';

class CartController {
	constructor() {
		this.service = CartService;
	}

	//Método para agregar un nuevo carrito
	async addNewCart() {
		await this.service.addNewCart(); //agrego el nuevo carrito
	}

	//Método para adquirir un carrito especifico por ID
	async getCartById(idBuscado) {
		const result = await this.service.getCartById(idBuscado); // busco el elemento que coincida con el ID indicado y populo los datos de los productos.
		if (result) {
			// Si tengo un resultado lo retorno, sino devuelvo error
			return result.products;
		} else {
			return { error: `Error: Cart ID=${idBuscado} not found` };
		}
	}

	//Método agregar un producto al carrito
	async addProductToCart(cartId, productId) {
		const product = await productController.getProductsById(productId);
		const user = await userController.getByEmail(product[0].owner);

		if (user && role === 'premium' && product[0].owner === user.email) {
			return { status: 'error', message: 'you cannot add a product created by yourself' }; // retorno el carrito con el producto agregado
		}

		const newProduct = {
			product: productId,
			quantity: 1,
		};
		const cart = await this.service.getCartById(cartId); //me quedo con el carrito a modificar
		// busco el elemento que coincida con el ID indicado
		const index = this.service.getIndex(cart, productId);

		if (index >= 0) {
			//Si existe sumo una unidad
			cart.products[index].quantity += 1;
		} else {
			//Si no axiste el producto lo agrego
			cart.products.push(newProduct);
		}

		await this.service.addProductToCart(cartId, cart);
		return { status: 'sucess', message: `product ID=${productId} added to cart ID=${cartId}` }; // retorno el carrito con el producto agregado

	}

	//Método para borrar un producto del carrito
	async deleteProduct(cartId, productId) {
		await this.service.deleteProduct(cartId, productId);
		return { status: 'sucess', message: `product ID=${productId} deleted from cart ID=${cartId}` }; // retorno el carrito con el producto agregado
	}

	//Método para actualizar todo el array de productos
	async updateAllProducts(cartId, newArray) {
		await this.service.updateAllProducts(cartId, newArray.products); //busco el carrito y modifico el campo
		return { status: 'sucess', message: `prdocuts from cart ID=${cartId} updated` }; // retorno el carrito con el producto agregado
	}

	//metodo para modificar la cantidad de productos de un elemento del array de productos
	async updateProductQuantity(cartId, productId, newQuantity) {
		const cart = await this.service.getCartById(cartId); //me quedo con el carrito a modificar
		const prod = cart.products.find((element) => element.product.toString() === productId); // busco el elemento que coincida con el ID indicado
		if (prod) {
			//Si existe sumo una unidad
			prod.quantity = newQuantity.quantity;
		} else {
			return { status: 'error', message: `product ID=${productId} is not valid in cart ID=${cartId}` };
		}
		await this.service.updateProductQuantity();
		return { status: 'sucess', message: `product ID=${productId} added to cart ID=${cartId}` }; // retorno el carrito con el producto agregado
	}

	//Metodo para borrar todos los productos de un carrito determinado
	async deleteAllProducts(cartId) {
		await this.service.deleteAllProducts(cartId);
		return { status: 'sucess', message: `products deleted from cart ID=${cartId}` }; // retorno el carrito con el producto agregado
	}
}

//Instancio una nueva clase de Cart Controller
const cartController = new CartController();

export default cartController;
