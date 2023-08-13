import { Router } from "express";
import ProductManager from "../../../dao/remote/managers/product/productManager.js";
const productManager = new ProductManager();
const router = Router();

router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  const user = req.session.user;

  res.render("realTimeProducts", { products, user });
});


export default router;