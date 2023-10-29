//importación de service.

import { CartService } from '../repositories/cart/index.js';
import productController from './product.controller.js';
import userController from './user.controller.js';
import { logger } from '../middleware/logger.middleware.js';

class CartController {
	constructor() {
		this.service = CartService;
	}

	//Método para agregar un nuevo carrito
	async addNewCart() {
	try{
		return await this.service.addNewCart(); //agrego el nuevo carrito

	}catch (error) {
    	  logger.error(`Error adding a new cart: ${error}`);
    	  throw new Error('Internal server error');
    }}

	//Método para adquirir un carrito especifico por ID
	async getCartById(idBuscado) {
		const result = await this.service.getCartById(idBuscado); // busco el elemento que coincida con el ID indicado y populo los datos de los productos.
		try {
		if (result) {
			// Si tengo un resultado lo retorno, sino devuelvo error
			return result.products;
		} else {
			return { error: `Error: Cart ID=${idBuscado} not found` };
		}
		}catch (error) {
    	  logger.error(`Error getting cart by: ${idBuscado}`);
    	  throw new Error('Internal server error');
    }}

	//Método agregar un producto al carrito
	async addProductToCart(cartId, productId) {
		try {
		const product = await productController.getProductsById(productId);
		const user = await userController.getByEmail(product.owner);

		const newProduct = {
			product: productId,
			quantity: 1,
		};
		const cart = await this.service.getCartById(cartId); //me quedo con el carrito a modificar
		// busco el elemento que coincida con el ID indicado
		const index = await this.service.getIndex(cart, productId);
	
		if (index >= 0) {
			//Si existe sumo una unidad
			cart.products[index].quantity += 1;
		} else {
			//Si no axiste el producto lo agrego
			cart.products.push(newProduct);
		}
		
		await this.service.addProductToCart(cartId, cart);
		return { status: 'sucess', message: `product ID=${productId} added to cart ID=${cartId}` }; // retorno el carrito con el producto agregado
		
		}catch (error) {
      	logger.error(`Error adding a product to cart: ${error}`);
      	throw new Error('Internal server error');
    }}
	

	//Método para borrar un producto del carrito
	async deleteProduct(cartId, productId) {
	try {
		await this.service.deleteProduct(cartId, productId);
		return { status: 'success', message: `product ID=${productId} deleted from cart ID=${cartId}` }; // retorno el carrito con el producto agregado
	}catch (error) {
      logger.error(`Error deleted a product to cart: ${error}`);
      throw new Error('Internal server error');
    }}

	//Método para actualizar todo el array de productos
	async updateAllProducts(cartId, newArray) {
	try{
		await this.service.updateAllProducts(cartId, newArray.products); //busco el carrito y modifico el campo
		return { status: 'success', message: `products from cart ID=${cartId} updated` }; // retorno el carrito con el producto agregado
	}catch (error) {
      logger.error(`Error update a product: ${error}`);
      throw new Error('Internal server error');
    }}

	//metodo para modificar la cantidad de productos de un elemento del array de productos
	async updateProductQuantity(cartId, productId, newQuantity) {
	try{
		return await this.service.updateProductQuantity(cartId, productId, newQuantity);
	}catch (error) {
      logger.error(`Error modify the quantity of products: ${error}`);
      throw new Error('Internal server error');
    }}
	
	//Metodo para borrar todos los productos de un carrito determinado
	async deleteAllProducts(cartId) {
	try{
		await this.service.deleteAllProducts(cartId);
		return { status: 'success', message: `products deleted from cart ID=${cartId}` }; // retorno el carrito con el producto agregado
	}catch (error) {
      logger.error(`Error products deleted from cart ID: ${error}`);
      throw new Error('Internal server error');
    }}

	//Método para eliminar un carrito
	async deleteCart(idBuscado) {
	try{
		return await this.service.deleteCart(idBuscado);
	}catch (error) {
      logger.error(`Error deleted cart ID: ${error}`);
      throw new Error('Internal server error');
    }}
}

//Instancio una nueva clase de Cart Controller
const cartController = new CartController();

export default cartController;
