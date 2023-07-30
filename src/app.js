
import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import ProductManager from "./dao/remote/managers/product/productManager.js";
import router from "./routes/index.js";
import __dirname from './utils.js'
import mongoose from "mongoose";
import ChatManager from "./dao/remote/managers/chat/chatManager.js";
const chatManager = new ChatManager()



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

const hbs = handlebars.create({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
});

app.engine("handlebars", hbs.engine);

const httpServer = app.listen(PORT, (req, res) => {
  console.log(`Server running at port: ${PORT}`);
});

const URL =
  "mongodb+srv://rodrigorivas190:Maxi7774@cluster0.rp3vhne.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(URL, {
    dbName: "libreriaLea",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connected");
  })
  .catch((e) => {
    console.log("Can't connect to DB");
  });



const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log(`New user ${socket.id} joined`);

  //Recibe del front
  socket.on("client:newProduct", async (data) => {
    const { title, description, price, code, stock, category } = data;

    const thumbnail = Array.isArray(data.thumbnail)
      ? data.thumbnail
      : [data.thumbnail];

    if (!title || !description || !price || !code || !stock || !category) {
      console.log("All fields are required");
    }

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

    //Envia el back
    const products = await productManager.getProducts();
    const listProducts = products.filter((product) => product.status === true);

    io.emit("server:list", listProducts);
  });

  // Recibe del front
  socket.on("cliente:deleteProduct", async (data) => {
    const id = data;

    const logicalDeleteProduct = await productManager.deleteProduct(id);

    //Envia el back
    const products = await productManager.getProducts();

    //Solo para mostrar los productos con status true
    const listProducts = products.filter((product) => product.status === true);

    io.emit("server:list", listProducts);
  });


  //Recibe del front
  socket.on("client:message", async (data) => {
    await chatManager.saveMessage(data)
    //Envia el back
    const messages = await chatManager.getMessages()
    io.emit("server:messages", messages)
  })


  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);
  });
});