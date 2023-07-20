import { Router } from "express";

import ProductManager from "../../managers/product/productManager.js";
const productManager = new ProductManager();
const router = Router();

router.post("/form", async (req, res) => {
  const { title, description, price, code, stock, category } = req.body;
  const thumbnail = Array.isArray(req.body.thumbnail)
    ? req.body.thumbnail
    : [req.body.thumbnail];

  if (!title || !description || !price || !code || !stock || !category) {
    return res.status(400).json({ error400: "All fields are required" });
  }

  try {
    await productManager.addProduct(
      title,
      description,
      Number(price),
      thumbnail,
      code,
      Number(stock),
      category
    );
    res.redirect("/");
  } catch (err) {
    if (err.message.includes("The product with")) {
      res.status(409).json({ error409: err.message });
    }
  }
});

router.get("/", async (req, res) => {
  const { limit } = req.query;
  try {
    const products = await productManager.getProducts();
    if (!limit || limit < 1) {
      res.render("home", {
        products: products,
      });
    } else {
      const limitedProducts = products.slice(0, limit);
      res.render("home", {
        products: limitedProducts,
      });
    }
  } catch (err) {
    res.status(400).json({ error400: "Bad Request" });
  }
});

router.get("/form", (req, res) => {
  res.render("form", {});
});
router.delete("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    let status = await productManager.deleteProduct(Number(pid));

    res.status(200).json(`Product with id: ${pid} was removed`);
  } catch (err) {
    if (err.message.includes("Product does")) {
      res.status(404).json({ error400: err.message });
    }
  }
});

export default router;
