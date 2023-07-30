import CartModel from "../../../models/model.cart.js";

class CartManager {
  _getNextOrder = async () => {
    const count = await CartModel.count();
    const nextId = count > 0 ? this.products[count - 1].id + 1 : 1;

    return nextId;
  };

  createCart = async () => {
    try {
      const cart = {
        products: [],
      };

      await CartModel.create(cart);
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
      const cart = await CartModel.findById(id);

      if(cart === null) {
        console.error(`Cart with id: ${id} does not exist`);
        throw new Error(`Cart with id: ${id} does not exist`);
      }

      return cart;
    } catch (err) {
      throw err;
    }
  };

  updateCart = async (id, arrayProducts) => {
    try {
      const validate = await CartModel.findByIdAndUpdate(id, {
        products: arrayProducts,
      });

      if (validate === null) {
        console.log(`Cart with id: ${id} does not exist`);
        throw new Error(`Cart with id: ${id} does not exist`);
      }

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
}

export default CartManager;
