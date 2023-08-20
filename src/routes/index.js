import productsLocalController from "../controllers/local/product/controller.products.js";
import cartsLocalController from "../controllers/local/cart/controller.carts.js";
import sessionRemoteController from "../controllers/remote/session/controller.session.js"
// import sessionRemoteController2 from "../controllers/remote/session/sessions.router.js"
import viewsControllerProductsSinc from "../controllers/views/product/controller.viewsSinc.js";
import productsRemoteController from "../controllers/remote/product/controller.products.js";
import cartsRemoteController from "../controllers/remote/cart/controller.carts.js";
import viewsControllerChat from "../controllers/views/chat/controller.chats.js";
import viewsControllerCartAsinc from "../controllers/views/cart/controller.views.js"
import viewsControllerList from "../controllers/views/product/controller.viewsList.js";
import viewsControllerSession from "../controllers/views/session/controller.viewsSession.js"; 


const router = (app) => {
  //Backend
  app.use("/api/remote/products", productsRemoteController);
  app.use("/api/remote/carts", cartsRemoteController);
  app.use("/api/local/products", productsLocalController);
  app.use("/api/local/carts", cartsLocalController);
  app.use("/api/session", sessionRemoteController);
  
  //Frontend
  app.use("/chat", viewsControllerChat);
  app.use("/productsList", viewsControllerList);
  app.use("/realTimeProducts", viewsControllerProductsSinc);
  app.use("/cart", viewsControllerCartAsinc);
  app.use("/", viewsControllerSession);
};

export default router;