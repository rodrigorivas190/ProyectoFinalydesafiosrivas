import CartManager from "../../../dao/remote/managers/cart/cartManager.js";
const cartManager = new CartManager();
import ProductManager from "../../../dao/remote/managers/product/productManager.js";
const productManager = new ProductManager();
import { Router } from "express";
const router = Router();

router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(200).json("A new cart was created");
  } catch (err) {
    res.status(400).json({ error400: "Error creating cart" });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const quantity = req.body.quantity || 1;
  try {
    const updatedCart = await cartManager.updateCart(cid, pid, quantity);
    res.status(200).json("Products added to cart");
  } catch (err) {
    if (err.message.includes("Cart with id")) {
      res.status(404).json({ error404: err.message });
    }
  }
});

router.get("/", async (req, res) => {
  try {
    const carts = await cartManager.getCarts();
    console.log(carts);
    res.status(200).json(carts);
  } catch (err) {
    res.status(400).json({ error400: "Bad Request" });
  }
});

router.get("/:cid", async (req, res) => {
  let { cid } = req.params;

  try {
    const cart = await cartManager.getCartById(cid);
    res.status(200).json(cart);
  } catch (err) {
    if (err.message.includes("Cart with id")) {
      res.status(404).json({ error404: err.message });
    }
  }
});

router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    let status = await cartManager.deleteProducts(cid);

    res.status(200).json(`Cart with id: ${cid} was removed`);
  } catch (err) {
    if (err.message.includes("Cart does")) {
      res.status(404).json({ error400: err.message });
    }
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const status = await cartManager.deleteProduct(cid, pid);

    res.status(200).json(`Product ${pid} removed successfully`);
  } catch (err) {
    if (err.message.includes("Cart with")) {
      res.status(404).json({ error400: err.message });
    }
    if (err.message.includes("Product with")) {
      res.status(404).json({ error400: err.message });
    }
  }
});

export default router;
