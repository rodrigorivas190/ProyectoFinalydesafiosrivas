//Primer practica integradora
//Manager de productos

import fs from 'fs';

export default class ProductManager {
	static id = 0; // ID que será vistos por todas las instancias

	constructor(myPath) {
		this.products = [];
		this.path = myPath;
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

		let newProduct = {
			id: ProductManager.id,
			title: productToAdd.title,
			description: productToAdd.description,
			code: productToAdd.code,
			price: productToAdd.price,
			status: true,
			stock: productToAdd.stock,
			category: productToAdd.category,
			thumbnail: productToAdd.thumbnail,
		};

		let codes = this.products.map((cod) => cod.code); // me quedo con todos los códigos del array productos
		//evaluo si el codigo del nuevo producto no existe
		if (!codes.includes(productToAdd.code)) {
			this.products.push(newProduct);
			ProductManager.id += 1; //incremento contador ID

			//Si no existe, Escribo el file utilizando promesas y esperando a que se cumpla la misma
			await fs.promises.writeFile(`${this.path}`, JSON.stringify(this.products));
			return { status: 'sucess', message: `product ${newProduct.code} created` };
		} else {
			return { error: 'Error: product already exist' }; //Si el producto ya existe arrojo error
		}
	}

	//Método para adquirir el listado de productos desde el archivo.
	async getProducts() {
		const actualProducts = await fs.promises.readFile(`${this.path}`, 'utf-8');
		return JSON.parse(actualProducts);
	}

	//Método para adquirir un producto especifico por ID
	async getProductsById(idBuscado) {
		const productList = await this.getProducts();
		const result = productList.find((element) => element.id === idBuscado); // busco el elemento que coincida con el ID indicado

		if (result) {
			// Si tengo un resultado lo retorno, sino devuelvo error
			return result;
		} else {
			return { error: 'Error: Producto no existe' };
		}
	}

	//Método para actualizar producto

	async updateProduct(idBuscado, productUpdated) {
		const productList = await this.getProducts();
	
		for (let i = 0; i < productList.length; i++) {
			if (productList[i].id === idBuscado) {
				productList[i].title = productUpdated.title;
				productList[i].description = productUpdated.description;
				productList[i].code = productUpdated.code;
				productList[i].price = productUpdated.price;
				productList[i].status = productUpdated.status;
				productList[i].stock = productUpdated.stock;
				productList[i].category = productUpdated.category;
				productList[i].thumbnail = productUpdated.thumbnail;
				break; // Salir del bucle después de encontrar el producto
			}
		}
	
		await fs.promises.writeFile(`${this.path}`, JSON.stringify(productList));
		return productList;
	}

	//Método para eliminar un producto del archivo
	async deleteProduct(idBuscado) {
		const productList = await this.getProducts(); //obtengo lista de productos
		const index = productList.indexOf(productList.find((elemento) => elemento.id === idBuscado)); //obtengo el índice del elemento a borrar
		if (index === -1) {
			return { error: 'Error: Producto no existe' }; //si no encuentro producto retorno error
		}

		const code = productList[index].code;
		productList.splice(index, 1); // elimino el elemento seleccionado
		await fs.promises.writeFile(`${this.path}`, JSON.stringify(productList)); //reescribo archivo
		return { status: 'sucess', message: `product ${code} deleted` }; //retorno sucess con el producto eliminado
	}
}
