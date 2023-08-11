import { Router } from "express";
import ProductManager from "../../../dao/remote/managers/product/productManager.js";
import ProductModel from "../../../dao/models/model.product.js";
import CartModel from "../../../dao/models/model.cart.js";
const productManager = new ProductManager();
const router = Router();

router.post("/form", async (req, res) => {
  const { title, description, price, code, stock, category } = req.body;
  console.log("controllerviews", req.body);
  const thumbnail = Array.isArray(req.body.thumbnail)
    ? req.body.thumbnail
    : [req.body.thumbnail];

  if (!title || !description || !price || !code || !stock || !category) {
    return res.status(400).json({ error400: "All fields are required" });
  }

  try {
    const product = {
      title,
      description,
      price: Number(price),
      thumbnail,
      code,
      stock: Number(stock),
      category,
    };
    await productManager.addProduct(product);
    res.redirect("/home");
  } catch (err) {
    if (err.message.includes("The product with")) {
      res.status(409).json({ error409: err.message });
    }
  }
});

router.get("/home", async (req, res) => {
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

router.get("/productsList", async (req, res) => {
  try {
    const page = Number(req.query?.page) || 1;
    const limit = Number(req.query?.limit) || 5;
    const sort = {};
    const sortValue = req.query?.sort;
    const query = {};
    const queryParams = req.query?.query || "";

    if (queryParams) {
      const key = queryParams.split(",")[0];
      let value = queryParams.split(",")[1];

      if (!isNaN(Number(value))) {
        value = Number(value);
      }

      query[key] = value;
    }

    if (sortValue === "desc") {
      sort.price = 1;
    } else if (sortValue === "asc") {
      sort.price = -1;
    }

    const result = await ProductModel.paginate(query, {
      page,
      sort,
      limit,
      lean: true,
    });

    result.nextLink = result.hasNextPage
      ? `/productsList?page=${result.nextPage}&limit=${limit}`
      : "";
    result.prevLink = result.hasPrevPage
      ? `/productsList?page=${result.prevPage}&limit=${limit}`
      : "";
    result.nextPagee = result.hasNextPage
      ? `/productsList?page=${result.nextPage}&limit=${limit}`
      : "";
    result.prevPagee = result.hasPrevPage
      ? `/productsList?page=${result.prevPage}&limit=${limit}`
      : "";

    res.render("productsList", result);
  } catch (err) {
    res.status(400).json({ error400: err });
  }
});
//vista detail products
router.get("/detail/:_id", async (req, res) => {
  const id = req.params._id;

  const product = await ProductModel.findById(id).lean().exec();
  console.log(product);

  try {
    res.render("detail", product)
  } catch (error) {
    console.log("error al obtener el producto", error);   
  }
})

router.get("/cart/count", async (req, res) => {
  try {
    const cartCount = await CartModel.findById("64c9d325f54c08f61e2cde00");
    res.json({ count: cartCount.products.length });
  } catch (error) {
    console.error("Error al obtener el número de productos en el carrito:", error);
    res.status(500).json({ error: "Error al obtener el número de productos en el carrito" });
  }
});

router.get("/form", (req, res) => {
  res.render("form", {});
});



export default router;
