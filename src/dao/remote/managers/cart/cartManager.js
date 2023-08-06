import CartModel from "../../../models/model.cart.js";

class CartManager {
  _getNextOrder = async () => {
    const count = await CartModel.count();
    const nextId = count > 0 ? this.products[count - 1].id + 1 : 1;

    return nextId;
  };

  createCart = async (cart) => {
    try {
      const oneCart = await CartModel.create(cart);

      return "Cart created successfully";
    } catch (err) {
      throw err;
    }
  };

  getCarts = async () => {
    try {
      const carts = CartModel.find();

      return carts;
    } catch {
      console.log("Carts not found");
      return [];
    }
  };

  getCartById = async (id) => {
    try {
      const cart = await CartModel.findOne({ _id: id });

      if (cart === null) {
        console.error(`Cart with id: ${id} does not exist`);
        throw new Error(`Cart with id: ${id} does not exist`);
      }

      return cart;
    } catch (err) {
      throw err;
    }
  };

  updateCart = async (idCart, idProduct, quantity) => {
    try {
      const cart = await CartModel.findById(idCart);

      if (cart === null) {
        console.log(`Cart with id: ${idCart} does not exist`);
        throw new Error(`Cart with id: ${idCart} does not exist`);
      }

      if (cart.products.length === 0) {
        cart.products.push({ product: idProduct, quantity: quantity });
      }

      const productPosition = cart.products.findIndex(
        (el) => el.product._id == idProduct
      );

      if (productPosition !== -1) {
        cart.products[productPosition].quantity += quantity;
      } else {
        cart.products.push({ product: idProduct, quantity: quantity });
      }

      const newCart = await CartModel.findByIdAndUpdate(idCart, cart);
      return "Cart products updated";
    } catch (err) {
      throw err;
    }
  };

  deleteCart = async (id) => {
    try {
      const cartDeleted = await CartModel.findByIdAndDelete(id);

      if (cartDeleted === null) {
        console.log("Cart does not exist");
        throw new Error("Cart does not exist");
      }

      return "Cart removed successfully";
    } catch (err) {
      throw err;
    }
  };

  deleteProduct = async (idCart, idProduct) => {
    try {
      const cart = await CartModel.findById(idCart);

      if (cart === null) {
        console.log(`Cart with id: ${idCart} does not exist`);
        throw new Error(`Cart with id: ${idCart} does not exist`);
      }

      const productPosition = cart.products.findIndex(
        (el) => el.product._id == idProduct
      );

      if (productPosition === -1) {
        console.log(`Product with id: ${idProduct} does not exist`);
        throw new Error(`Product with id: ${idProduct} does not exist`);
      }

      cart.products.splice(productPosition, 1);
      let newCart = cart.products;
      const productDelete = await CartModel.findByIdAndUpdate(idCart, {
        products: newCart,
      });

      return "Product removed successfully";
    } catch (err) {
      throw err;
    }
  };

  deleteProducts = async (idCart) => {
    try {
      const cart = await CartModel.findById(idCart);

      if (cart === null) {
        console.log("Cart does not exist");
        throw new Error("Cart does not exist");
      }

      cart.products.splice(0);
      let newCart = cart.products;

      const productsDelete = await CartModel.findByIdAndUpdate(idCart, {
        products: newCart,
      });

      return "Cart removed successfully";
    } catch (err) {
      throw err;
    }
  };
}
export default CartManager;
