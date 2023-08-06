import { Router } from "express";

import ProductManager from "../../../dao/remote/managers/product/productManager.js";

const productManager = new ProductManager();
const router = Router();

router.post("/", async (req, res) => {
  const { title, description, price, code, stock, category } = req.body;
  const thumbnail = Array.isArray(req.body.thumbnail)
    ? req.body.thumbnail
    : [req.body.thumbnail];

  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).json({ error400: "All fields are required" });
  }

  try {
    const product = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      category,
    };

    await productManager.addProduct(product);
    res.status(201).json("Product created successfully");
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
      res.status(200).json(products);
    } else {
      const limitedProducts = products.slice(0, limit);
      res.status(206).json(limitedProducts);
    }
  } catch (err) {
    res.status(400).json({ error400: "Bad Request" });
  }
});

router.get("/:pid", async (req, res) => {
  let { pid } = req.params;

  try {
    const product = await productManager.getProductById(pid);
    res.status(200).json(product);
  } catch (err) {
    if (err.message.includes("Product with id")) {
      res.status(404).json({ error404: err.message });
    }
  }
});

router.put("/:pid", async (req, res) => {
  const { pid } = req.params;
  const props = req.body;

  try {
    const updatedProduct = await productManager.updateProduct(pid, props);

    res.status(200).json(updatedProduct);
  } catch (err) {
    if (err.message.includes("Product with id")) {
      res.status(404).json({ error404: err.message });
    } else if (err.message.includes("Cannot update")) {
      res.status(400).json({ error400: err.message });
    } else {
      res.status(500).json({ error500: "Internal Server Error" });
    }
  }
});

router.delete("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    let status = await productManager.deleteProduct(pid);

    res.status(200).json(`Product with id: ${pid} was removed`);
  } catch (err) {
    if (err.message.includes("Product does")) {
      res.status(404).json({ error400: err.message });
    }
  }
});

export default router;
