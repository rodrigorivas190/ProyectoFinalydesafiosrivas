import ProductDTO from '../../dto/product.dto.js';

//en esta capa se pueden agregar los DTOs
export default class ProductRepository {
	constructor(dao) {
		this.dao = dao;
	}

	//Método para traer determinados productos
	async getProducts(limit, page, category, sort, status) {
		return await this.dao.getProducts(limit, page, category, sort, status);
	}

	//metodos para traer todos los productos
	async getAllProducts() {
		return await this.dao.getAllProducts();
	}

	//Método para agregar productos
	async addProducts(productToAdd) {
		let productToInsert = new ProductDTO(productToAdd);
		return await this.dao.addProducts(productToInsert);
	}

	//Método para adquirir un producto especifico por ID
	async getProductsById(idBuscado) {
		return await this.dao.getProductsById(idBuscado);
	}

	//Método para actualizar producto
	async updateProduct(idBuscado, productUpdated) {
		await this.dao.updateProduct(idBuscado, productUpdated);
	}

	//Método para eliminar un producto
	async deleteProduct(idBuscado) {
		await this.dao.deleteProduct(idBuscado);
	}
}
