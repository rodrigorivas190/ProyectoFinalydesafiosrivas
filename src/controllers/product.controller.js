//importación de service.
import { ProductService } from '../repositories/product/index.js';
import EErrors from '../tools/EErrors.js';

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
		let allProducts = await this.service.getAllProducts(); // me quedo con todos los códigos del array productos
		let codes = allProducts.map((el) => el.code); // Me quedo con los codigos de productos
		//evaluo si el codigo del nuevo producto no existe
		if (!codes.includes(productToAdd.code)) {
			await this.service.addProducts(productToAdd);
			return { status: 'sucess', message: `product ${productToAdd.code} created` };
		} else {
			return EErrors.DUPLICATED_VALUE_ERROR;
			//return { error: 'Error: product already exist' }; //Si el producto ya existe arrojo error
		}
	}

	//Método para adquirir un producto especifico por ID
	async getProductsById(idBuscado) {
		const result = await this.service.getProductsById(idBuscado); // busco el elemento que coincida con el ID indicado

		if (result) {
			// Si tengo un resultado lo retorno, sino devuelvo error
			return result;
		} else {
			return { error: 'Error: Product not found' };
		}
	}

	//Método para actualizar producto
	async updateProduct(idBuscado, productUpdated) {
		await this.service.updateProduct(idBuscado, productUpdated);
		return { status: 'sucess', message: `product ID:${idBuscado} Updated` };
	}

	//Método para eliminar un producto
	async deleteProduct(idBuscado) {
		let result = await this.service.getProductsById(idBuscado);

		if (result.length == 0) {
			return EErrors.DELETE_ERROR; //si no encuentro producto retorno error
		}

		let deleted = await this.service.deleteProduct(idBuscado); //elimino producto seleccionado
		if (deleted.acknowledged) {
			return { status: 'sucess', message: `product ID:${idBuscado} deleted` }; //retorno sucess con el producto eliminado
		}
	}
}

//Instancio una nueva clase de Product Controller
const productController = new ProductController();

export default productController;
