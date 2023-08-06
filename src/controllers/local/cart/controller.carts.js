import { Router } from "express";

import CartManager from "../../../dao/local/managers/cart/cartManager.js";

const cartManager = new CartManager();
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
    const update = await cartManager.updateCart(
      Number(cid),
      Number(pid),
      quantity
    );
    res
      .status(200)
      .json(`The product ${pid} in cart ${cid} was successfully updated`);
  } catch (err) {
    if (err.message.includes("Cart with id")) {
      res.status(404).json({ error404: err.message });
    }
  }
});

router.get("/", async (req, res) => {
  try {
    const carts = await cartManager.getCarts();
    res.status(200).json(carts);
  } catch (err) {
    res.status(400).json({ error400: "Bad Request" });
  }
});

router.get("/:cid", async (req, res) => {
  let { cid } = req.params;

  try {
    const cart = await cartManager.getCartById(Number(cid));
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
    let status = await cartManager.deleteCart(Number(cid));
    res.status(200).json(`Cart with id: ${cid} was removed`);
  } catch (err) {
    if (err.message.includes("Cart does")) {
      res.status(404).json({ error400: err.message });
    }
  }
});

export default router;
