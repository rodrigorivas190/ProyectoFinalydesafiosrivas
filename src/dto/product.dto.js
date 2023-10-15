export default class ProductDTO {
	constructor(productToAdd) {
		this.title = productToAdd.title;
		this.description = productToAdd.description;
		this.code = productToAdd.code;
		this.price = productToAdd.price;
		this.status = productToAdd.status;
		this.stock = productToAdd.stock;
		this.category = productToAdd.category;
		this.thumbnail = productToAdd.thumbnail;
		this.owner = productToAdd.owner;
	}
}
