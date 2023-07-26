
import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import ProductManager from "./managers/product/productManager.js";
import router from "./routes/index.js";
import __dirname from './utils.js'
const app = express();
const productManager = new ProductManager();
const PORT = process.env.PORT || 8080;
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.use("/static", express.static("./src/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.set("views", "./src/views");
app.set("view engine", "handlebars");

router(app);

const httpServer = app.listen(PORT, (req, res) => {
  console.log(`Server running at port: ${PORT}`);
});

const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log(`New user ${socket.id} joined`);

  // Recibe del front
  socket.on("client:newProduct", async (data) => {
    const { title, description, price, code, stock, category } = data;

    const thumbnail = Array.isArray(data.thumbnail)
      ? data.thumbnail
      : [data.thumbnail];
  
    if (!title || !description || !price || !code || !stock || !category) {
     
      console.log("All fields are required");
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
     
      res.redirect("/home");
     
    } 
    catch (err) {
      if (err.message.includes("The product with")) {
        console.log("All fields are required");
      }
    }

    // Envia el back
    const products = await productManager.getProducts();
    const listProducts = products.filter((product) => product.status === true);

    io.emit("server:list", listProducts);
  });

  // Recibe del front
  socket.on("cliente:deleteProduct", async (data) => {
    const id = data;

    const logicalDeleteProduct = await productManager.logicalDeleteProduct(id);

    try {
      let status = await productManager.deleteProduct(Number(id));
  
      res.status(200).json(`Product with id: ${id} was removed`);
    } catch (err) {
      if (err.message.includes("Product does")) {
        console.log("All fields are required");
      }
    }


    // Envia el back
    const products = await productManager.getProducts();

    // Solo para mostrar los productos con status true
    const listProducts = products.filter((product) => product.status === true);

    io.emit("server:list", listProducts);
  });

  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);
  });
});