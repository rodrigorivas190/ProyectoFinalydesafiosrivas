//importación de service.
import { ProductService } from '../repositories/product/index.js';
import EErrors from '../tools/EErrors.js';
import { logger } from '../middleware/logger.middleware.js';

//variables globales para parametros por defecto
const LIMITdEFAULT = 10;
const PAGEdEFAULT = 1;

class ProductController {
	constructor() {
		this.service = ProductService;
	}

	//Método para traer todos los productos de la base de datos
	async getProducts(limit, page, category, sort, status) {
		let query = {}; //defino query como un objeto vacío
		if (limit === '' || !limit) limit = LIMITdEFAULT; //Si no recibo limite lo seteo por defecto
		if (page === '' || !page) page = PAGEdEFAULT; //Si no recibo limite lo seteo por defecto
		let options = {
			limit: parseInt(limit),
			page: parseInt(page),
			lean: true,
		};
		let link = ''; //string para pasar como parametro y realizar una paginación ciclica

		if (category) {
			query.category = category; //si me piden filtrar por categoria la agrego
			link += `&category=${category}`; //armo link para pasar en la variable de paginación
		}
		if (status) {
			query.status = status; //si me piden filtrar por disponibilidad la agrego
			link += `&status=${status}`;
		}
		if (sort) {
			options = { ...options, sort: { price: sort } }; //si me piden ordenar los productos por precio, lo agrego.
			link += `&sort=${sort}`;
		}

		let products = await this.service.getProducts(query, options); // realizo la paginación

		let returnProducts = {
			status: 'success',
			payload: products.docs,
			totalPages: products.totalPages,
			prevPage: products.prevPage,
			nextPage: products.nextPage,
			page: products.page,
			hasPrevPage: products.hasPrevPage,
			hasNextPage: products.hasNextPage,
			prevLink: !products.hasPrevPage ? null : `?limit=${limit}&page=${products.prevPage}` + link, //
			nextLink: !products.hasNextPage ? null : `?limit=${limit}&page=${products.nextPage}` + link, //
		};


		return returnProducts; //retorno estructura
	}

	//Método para agregar productos a la base de datos
	async addProducts(productToAdd) {
	try { 
		let allProducts = await this.service.getAllProducts(); // me quedo con todos los códigos del array productos
		let codes = allProducts.map((el) => el.code); // Me quedo con los codigos de productos
		//evaluo si el codigo del nuevo producto no existe
		if (!codes.includes(productToAdd.code)) {
			let result = await this.service.addProducts(productToAdd);
			return { status: 'success', payload: result };
		} else {
			return EErrors.DUPLICATED_VALUE_ERROR;
			//return { error: 'Error: product already exist' }; //Si el producto ya existe arrojo error
		}

	}catch (error) {
      logger.error(`Error al agregar los productos: ${idBuscado}`);
      throw new Error('Internal server error');
    }}

	//Método para adquirir un producto especifico por ID
	async getProductsById(idBuscado) {
	try { 
		const result = await this.service.getProductsById(idBuscado); // busco el elemento que coincida con el ID indicado

		if (result) {
			// Si tengo un resultado lo retorno, sino devuelvo error
			return result;
		} else {
			return { error: 'Error: Product not found' };
		}
	}catch (error) {
      logger.error(`Error al obtener los productos: ${idBuscado}`);
     
    }}

	//Método para actualizar producto
	async updateProduct(idBuscado, productUpdated) {
	try { 
		await this.service.updateProduct(idBuscado, productUpdated);
		return { status: 'success', message: `product ID:${idBuscado} Updated` };
	}catch (error) {
      logger.error(`Error al actualizar los productos: ${idBuscado}`);
    
    }}

	//Método para eliminar un producto
	async deleteProduct(idBuscado) {
	try { 
		let result = await this.service.getProductsById(idBuscado);

		if (result.length == 0) {
			return EErrors.DELETE_ERROR; //si no encuentro producto retorno error
		}

		let deleted = await this.service.deleteProduct(idBuscado); //elimino producto seleccionado
		return { status: 'success', message: `product ID:${idBuscado} deleted` }; //retorno success con el producto eliminado
	}catch (error) {
      logger.error(`Error al eliminar los productos: ${idBuscado}`);
      
    }}
}

//Instancio una nueva clase de Product Controller
const productController = new ProductController();

export default productController;
