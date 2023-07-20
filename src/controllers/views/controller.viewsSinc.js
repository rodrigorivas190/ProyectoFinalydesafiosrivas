import { Router } from "express";

import ProductManager from "../../managers/product/productManager.js";
const productManager = new ProductManager();
const router = Router();

router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("realTimeProducts", { products: products });
  
});

export default router;