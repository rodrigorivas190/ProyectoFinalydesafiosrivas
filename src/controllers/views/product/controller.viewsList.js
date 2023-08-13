import ProductModel from "../../../dao/models/model.product.js";
import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
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

    let prevLink;
    let nextLink;

    if (result.hasPrevPage == false) {
      prevLink = null;
    } else {
      prevLink = `/productsList?page=${result.prevPage}&limit=${limit}`;
    }

    if (result.hasNextPage == false) {
      nextLink = null;
    } else {
      nextLink = `/productsList?page=${result.nextPage}&limit=${limit}`;
    }

    result.nextLink = result.hasNextPage
      ? `/productsList?page=${result.nextPage}&limit=${limit}`
      : "";
    result.prevLink = result.hasPrevPage
      ? `/productsList?page=${result.prevPage}&limit=${limit}`
      : "";

    const format = {
      status: "success",
      payload: result.docs,
      totalPages: result.totalDocs,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: prevLink,
      nextLink: nextLink,
      limit,
    };

    res.render("productsList", { result: format });
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



export default router;
