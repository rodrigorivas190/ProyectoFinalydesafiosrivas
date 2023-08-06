import productsLocalController from "../controllers/local/product/controller.products.js";
import cartsLocalController from "../controllers/local/cart/controller.carts.js";
import viewsControllerProductsAsinc from "../controllers/views/product/controller.views.js";
import viewsControllerProductsSinc from "../controllers/views/product/controller.viewsSinc.js";
import productsRemoteController from "../controllers/remote/product/controller.products.js";
import cartsRemoteController from "../controllers/remote/cart/controller.carts.js";
import viewsControllerChat from "../controllers/views/chat/controller.chats.js";
import viewsControllerCartAsinc from "../controllers/views/cart/controller.views.js" 


const router = (app) => {
  //Backend
  app.use("/api/remote/products", productsRemoteController);
  app.use("/api/remote/carts", cartsRemoteController);
  app.use("/api/local/products", productsLocalController);
  app.use("/api/local/carts", cartsLocalController);
  //Frontend
  app.use("/chat", viewsControllerChat);
  app.use("/", viewsControllerProductsAsinc);
  app.use("/realTimeProducts", viewsControllerProductsSinc);
  app.use("/cart", viewsControllerCartAsinc);
};

export default router;