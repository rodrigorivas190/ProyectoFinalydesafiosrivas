import productsController from "../controllers/product/controller.products.js";
import cartsController from "../controllers/cart/controller.carts.js";
import viewsControllerAsinc from "../controllers/views/controller.views.js";
import viewsControllerSinc from "../controllers/views/controller.viewsSinc.js";

const router = (app) => {
  app.use("/api/products", productsController);
  app.use("/api/carts", cartsController);
  app.use("/", viewsControllerAsinc);
  app.use("/realTimeProducts", viewsControllerSinc);
};

export default router;