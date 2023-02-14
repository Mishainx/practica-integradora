import express from "express";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import routerViews from "./routes/views.routes.js";
import messageRoute from "./routes/messages.routes.js";
import {messageModel } from "./data/models/messages.model.js";
import { CartManager, ProductManager } from "./data/classes/DBManager.js";
import { productModel } from "./data/models/products.model.js";
import cartModel from "./data/models/carts.model.js";
const classManager= new ProductManager
const mensajes = []

//Configuración dotenv
dotenv.config();
const app = express();
const PORT = process.env.SERVER_PORT || 8181;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_NAME = process.env.DB_NAME;

//Configuración del servidor
const httpServer = app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await messageModel.updateMany({},{status:false})
});

//Inicialización Socket server
const socketServer = new Server(httpServer)

//Middelware para trabajar con archivos .Json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', "./src/views")
app.use(express.static('public'));

app.post("/socketMessage", (req, res) => {
  const { message } = req.body;
  socketServer.emit("message", message);

  res.send("ok");
});


//Configuración socket server
socketServer.on("connection", (socket) => {

  socket.on("message", (data) => {
    mensajes.push(data);
    socketServer.emit("messageLogs", mensajes);
    messageModel.create({name:data.user,message:data.message,status:true})  
  });

  socket.on("realTimeConnection",(data)=>{
    console.log(data)
  })
   
  socket.on("findCode",async(data)=>{
  socket.emit("findCodeResult", await classManager.findCode(data))
  })

  socket.on("createItem", async(data)=>{
    await classManager.create(data)
    socket.emit("renderChanges", await productModel.find())
  })

  socket.on("findId",async (data)=>{
  const productExist = await productModel.findById(data)
  console.log(productExist)
  socket.emit("resultFindId", productExist)
  })

  socket.on("deleteItem",async(data)=>{
    await classManager.delete(data)
    socket.emit("renderChanges",await productModel.find())
  })

    socket.on("sendQuantity",async (data)=>{
      await cartModel.create()
    })
});

//Configuración enviroment MongoDB
const environment = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.tjewfez.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`
    );
    console.log("Conectado a MongoDB");
  } catch (error) {
    console.log(`Error al conectar a MongoDB: ${error}`);
    console.log(DB_USER+DB_PASS+DB_NAME)
  }
};

const isValidStartData = () => {
  if (DB_PASS && DB_USER) return true;
  else return false;
};
console.log("isValidStartData", isValidStartData());
isValidStartData() && environment();


//Rutas express
app.use("/messages", messageRoute);
app.use('/api/views', routerViews)
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

//Redireccionamiento a HomeHandlebars para  iniciar en Home en caso de que no exista la ruta
app.get('*',(req,res)=>{
  res.status(301).redirect('/api/views/home')
})