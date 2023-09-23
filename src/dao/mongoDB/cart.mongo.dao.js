import { CartModel } from '../../models/cart.model.js';

class CartMongo {
	constructor() {
		this.model = CartModel;
	}

	//Método para agregar un nuevo carrito
	async addNewCart() {
		let newCart = {
			products: [],
		};
		return (await this.model.create(newCart))._id; //agrego el nuevo carrito al archivo
	}

	//Método para adquirir un carrito especifico por ID
	async getCartById(idBuscado) {
		return await this.model.findById(idBuscado).lean().populate('products.product');
	}

	//Método agregar un producto al carrito
	async addProductToCart(cartId, newArray) {
		await this.model.findOneAndUpdate({ _id: cartId }, { products: newArray.products }); //busco el carrito y modifico el campo
	}

	//Método para borrar un producto del carrito
	async deleteProduct(cartId, productId) {
		await this.model.findOneAndUpdate({ _id: cartId }, { $pull: { products: { product: productId } } }); //busco el carrito y modifico el campo
	}

	//Método para actualizar todo el array de productos
	async updateAllProducts(cartId, newArray) {
		await this.model.findOneAndUpdate({ _id: cartId }, { products: newArray.products }); //busco el carrito y modifico el campo
	}

	//metodo para modificar la cantidad de productos de un elemento del array de productos
	async updateProductQuantity(cart) {
		await cart.save(); //guardo cambios
	}

	//Metodo para borrar todos los productos de un carrito determinado
	async deleteAllProducts(cartId) {
		await this.model.findOneAndUpdate({ _id: cartId }, { products: [] }); //busco el carrito e inserto un array vacio
	}

	//Metodo para obtener el index de un producto dentro del carrito
	getIndex(cart, productId) {
		return cart.products.indexOf(cart.products.find((element) => element.product._id.toString() === productId));
	}
}

//Instancio una nueva clase de Cart Mongo
const cartMongo = new CartMongo();

export default cartMongo;
