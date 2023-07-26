import fs from "fs";

class ProductManager {
  
  static #path = "./public/products.json";

  constructor() {
    this.products = [];
    ProductManager.#path;
  }

  _getNextId = () => {
    const count = this.products.length;
    const nextId = count > 0 ? this.products[count - 1].id + 1 : 1;

    return nextId;
  };

  addProduct = async (
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    category
  ) => {
    const products = await this.getProducts();

    try {
      const product = {
        id: this._getNextId(),
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        category,
        status: true,
      };

      if (products.find((product) => product.code === code)) {
        console.log(`The product with code: ${product.code} already exists`);
        throw new Error(
          `The product with code: ${product.code} already exists`
        );
      }
      products.push(product);
      await fs.promises.writeFile(
        ProductManager.#path,
        JSON.stringify(products, null, "\t")
      );

      return console.log(products);
    } catch (err) {
      throw err;
    }
  };

  getProducts = async () => {
    try {
      const data = await fs.promises.readFile(ProductManager.#path, "utf-8");
      const products = JSON.parse(data);
      this.products = products;

      return products;
    } catch (err) {
      console.log("File not found");
      return [];
    }
  };

  getProductById = async (id) => {
    const products = await this.getProducts();
    try {
      const itemId = Object.values(products).find(
        (product) => product.id === id
      );

      if (itemId === undefined) {
        console.log(`Product with id: ${id} does not exist`);
        throw new Error(`Product with id: ${id} does not exist`);
      }
      console.log(itemId);
      return itemId;
    } catch (err) {
      throw err;
    }
  };

  updateProduct = async (id, propsProduct) => {
    const products = await this.getProducts();
    try {
      const index = await products.findIndex((product) => product.id === id);

      if (index === -1) {
        console.log(`Product with id: ${id} does not exist`);
        throw new Error(`Product with id: ${id} does not exist`);
      }
      if (
        propsProduct.hasOwnProperty("id") ||
        propsProduct.hasOwnProperty("code")
      ) {
        console.log("Cannot update 'id' or 'code' property");
        throw new Error("Cannot update 'id' or 'code' property");
      }

      Object.assign(products[index], propsProduct);
      await fs.promises.writeFile(
        ProductManager.#path,
        JSON.stringify(products),
        "utf-8"
      );
      const updatedProduct = products[index];

      console.log(updatedProduct);
      return updatedProduct;
    } catch (err) {
      throw err;
    }
  };

  deleteProduct = async (id) => {
    let products = await this.getProducts();
    try {
      const product = Object.values(products).find(
        (product) => product.id === id
      );

      if (!product) {
        console.log("Product does not exist");
        throw new Error("Product does not exist");
      }

      products = products.filter((item) => item.id !== id);
      await fs.promises.writeFile(
        ProductManager.#path,
        JSON.stringify(products),
        "utf-8"
      );

      console.log("Product removed");
      return "Product removed";
    } catch (err) {
      throw err;
    }
  };

  logicalDeleteProduct = async (id) => {
    let products = await this.getProducts();
    try {
      const productIndex = Object.values(products).findIndex(
        (product) => product.id === id
      );

      if (productIndex === -1) {
        console.log("Product does not exist");
    
      }

      await fs.promises.writeFile(
        ProductManager.#path,
        JSON.stringify(products),
        "utf-8"
      );

      console.log("Product logically removed");
      return "Product logically removed";
    } catch (err) {
      throw err;
    }
  };
}

export default ProductManager;