//en esta capa se pueden agregar los DTOs
export default class CartRepository {
	constructor(dao) {
		this.dao = dao;
	}

	//Metodo para agregar un nuevo carrtio
	async addNewCart() {
		return await this.dao.addNewCart();
	}

	//Método para adquirir un carrito especifico por ID
	async getCartById(idBuscado) {
		return await this.dao.getCartById(idBuscado);
	}

	//método para gregar un producto al carrito
	async addProductToCart(cartId, productId) {
		await this.dao.addProductToCart(cartId, productId);
	}

	//Método para borrar un producto del carrito
	async deleteProduct(cartId, productId) {
		await this.dao.deleteProduct(cartId, productId);
	}

	//Método para actualizar todo el array de productos
	async updateAllProducts(cartId, newArray) {
		await this.dao.updateAllProducts(cartId, newArray);
	}

	//metodo para modificar la cantidad de productos de un elemento del array de productos
	async updateProductQuantity(cartId, productId, newQuantity) {
		return await this.dao.updateProductQuantity(cartId, productId, newQuantity);
	}

	//Metodo para borrar todos los productos de un carrito determinado
	async deleteAllProducts(cartId) {
		await this.dao.deleteAllProducts(cartId);
	}

	//metodo para obtener el index de un producto dentro del carrito
	getIndex(cart, productId) {
		return this.dao.getIndex(cart, productId);
	}

	//Método para eliminar un carrito
	async deleteCart(idBuscado) {
		return this.dao.deleteCart(idBuscado); 
	}
}
