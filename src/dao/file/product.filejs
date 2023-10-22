
//Manager de productos

import fs from 'fs';

export default class ProductManager {
	static id = 0; // ID que será vistos por todas las instancias

	constructor() {
		this.products = [];
		this.path = './productos.json';
		//Si no existe el archivo lo creo de forma sincronica con un array vacío
		if (!fs.existsSync('./productos.json')) {
			fs.promises.writeFile(`${this.path}`, JSON.stringify(this.products));
		}
	}

	//Método para agregar productos al archivo
	async addProducts(productToAdd) {
		this.products = await this.getProducts();

		let Ids = this.products.map((prod) => prod.id); //traigo todos los IDs de los productos

		let maxId = Ids.reduce(function (mayor, numero) {
			//evaluo cual es el mayor ID y me quedo con el mayor
			if (numero > mayor) {
				mayor = numero;
			}
			return mayor;
		}, Ids[0]);

		if (this.products.length === 0) {
			// Si el array esta vacío, inicializo el generador de ID con 0
			ProductManager.id = 0;
		} else {
			//Sino, sumo 1 unidad
			ProductManager.id = maxId + 1;
		}

		await fs.promises.writeFile(`${this.path}`, JSON.stringify(this.products));
	}

	//Método para adquirir el listado de productos desde el archivo.
	async getProducts(limit, page, category, sort, status) {
		const actualProducts = await fs.promises.readFile(`${this.path}`, 'utf-8');
		return JSON.parse(actualProducts);
	}

	//Método para adquirir un producto especifico por ID
	async getProductsById(idBuscado) {
		const productList = await this.getProducts();
		const result = productList.find((element) => element.id === idBuscado); // busco el elemento que coincida con el ID indicado
		return result;
	}

	//Método para actualizar producto
	async updateProduct(idBuscado, productUpdated) {
		const productList = await this.getProducts();
		productList.map((product) => {
			//recorro el array buscando el prducto indicado, cuando lo encuentro reemplazo valores, menos el ID
			if (product.id === idBuscado) {
				product.title = productUpdated.title;
				product.description = productUpdated.description;
				product.code = productUpdated.code;
				product.price = productUpdated.price;
				product.status = productUpdated.status;
				product.stock = productUpdated.stock;
				product.category = productUpdated.category;
				product.thumbnail = productUpdated.thumbnail;
			}
			return product;
		});

		await fs.promises.writeFile(`${this.path}`, JSON.stringify(productList));
		return productList;
	}

	//Método para eliminar un producto del archivo
	async deleteProduct(idBuscado) {
		const productList = await this.getProducts(); //obtengo lista de productos
		const index = productList.indexOf(productList.find((elemento) => elemento.id === idBuscado)); //obtengo el índice del elemento a borrar
		productList.splice(index, 1); // elimino el elemento seleccionado
		await fs.promises.writeFile(`${this.path}`, JSON.stringify(productList)); //reescribo archivo
	}
}
