import productsController from "../controllers/local/product/controller.products.js";
import cartsController from "../controllers/local/cart/controller.carts.js";
import viewsControllerAsinc from "../controllers/views/controller.views.js";
import viewsControllerSinc from "../controllers/views/controller.viewsSinc.js";
import productsRemoteController from "../controllers/remote/product/controller.products.js";
import cartsRemoteController from "../controllers/remote/cart/controller.carts.js";
import chatController from "../controllers/views/chat/controller.chats.js";


const router = (app) => {
  app.use("/api/remote/products", productsRemoteController);
  app.use("/api/remote/carts", cartsRemoteController);
  app.use("/", viewsControllerAsinc);
  app.use("/realTimeProducts", viewsControllerSinc);
  app.use("/api/local/products", productsController);
  app.use("/api/local/carts", cartsController);
  app.use("/chat", chatController)
};

export default router;