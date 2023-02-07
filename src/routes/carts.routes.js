import { response, Router } from "express";
import { CartManager } from "../data/classes/DBManager.js";
import cartModel from "../data/models/carts.model.js";
import { productModel } from "../data/models/products.model.js";

const router = Router();
const cartManager = new CartManager();

//Configuración de las routes del Cart

// La ruta api/carts (método get) devuelve el listado de carritos creados.
router.get("/", async (req, res) => {
  try {
    const cart = await cartManager.read();
    res.send(cart);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// La ruta api/carts/:cid (método get) recibe una Id y devuelve el carrito solicitado
router.get("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid
    const cart = await cartManager.read();

    //Comprobación de la estructura del parámetro Id recibido
    if(cartId.trim().length!=24){ 
      res.status(400).send({error: "La Id del Cart ingresada no es válida"})
      return
    }

    //Comprobación de la existencia de un carrito con el parámetro ingresado.
    const cartExist = await cartModel.findById(cartId)
    if(cartExist==null){
      res.status(404).send({error:"No existe un Cart con la Id ingresada"})
      return
    }

    //Si se comprueba el parámetro se ejecutan las acciones para devolver el carrito solicitado.
    const findCart = cart.find((cart)=>cart.id == cartId)
    if(findCart !=undefined){
    res.status(200).send(findCart)
    return findCart
    }
    else{
      res.status(400).send("No existe un cart con la Id solicitada")
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// La ruta api/carts(método post) crea un carrito.
router.post("/", async (req, res) => {
  try {
    const response = await cartManager.create();
    console.log(response);
    res.status(200).send({ message: "Carrito creado", response });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// La ruta api/carts (método delete) recibe una Id como parámetro y elimina al mismo de la base de datos
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {

    //Comprobación de la estructura del parámetro Id recibido 
    if(id.trim().length!=24){ 
      res.status(400).send({error: "La Id del Cart ingresada no es válida"})
      return
    }

    //Comprobación de la existencia de un carrito con el parámetro ingresado.
    const cartExist = await cartModel.findById(id)
    if(cartExist==null){
      res.status(404).send({error:"No existe un Cart con la Id ingresada"})
      return
    }

    //Si se comprueba la validez del parámetro se ejecutan las acciones para eliminar el carrito.
    const response = await cartManager.delete(id);
    res.status(200).send({ message: "Carrito eliminado", response });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// La ruta api/carts/:cid/products/:pid (método post) agrega un producto a un carrito
router.post("/:cid/products/:pid", async (req, res) => {
  const  cartId  = req.params.cid;
  const productId = req.params.pid
  const {quantity} = req.body;

  //Comprobación de la estructura y validez de la Id de producto y la Id del carrito recibidos por parámetro
  if(productId.trim().length!=24)
  { 
    res.status(400).send({error: "La Id de producto ingresada no es válida"})
    return
  }
  else if(cartId.trim().length!=24){
    res.status(404).send({error: "La Id del Cart ingresada no es válida"})
    return
  }
  const productExist = await productModel.findById(productId)
  const cartExist = await cartModel.findById(cartId)

  if(productExist==null){
    res.status(400).send({error:"No existe un producto con la Id ingresada"})
    return
  }
  else if(cartExist==null){
    res.status(404).send({error:"No existe un Cart con la Id ingresada"})
    return
  }

  //Si se comprueba la validez de los parámetros se ejecutan las acciones para agregar el producto al carrito
  try {
    const response = await cartManager.update(cartId, productId,quantity);
    res.status(200).send({ message: "Producto agregado al carrito", response });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// La ruta api/carts/:cid/products/:pid (método delete) elimina un producto del carrito solicitado

router.delete("/:cid/products/:pid", async (req, res) => {
  const  cartId  = req.params.cid;
  const productId = req.params.pid

  try {
  //Comprobación de la estructura y validez de la Id de producto y la Id del carrito recibidos por parámetro
    if(productId.trim().length!=24){ 
    res.status(400).send({error: "La Id de producto ingresada no es válida"})
    return
  }
  else if(cartId.trim().length!=24){
    res.status(400).send({error: "La Id del Cart ingresada no es válida"})
    return
  }
  const productExist = await productModel.findById(productId)
  const cartExist = await cartModel.findById(cartId)

  if(productExist==null){
    res.status(400).send({error:"No existe un producto con la Id ingresada"})
    return
  }
 else if(cartExist==null){
    res.status(400).send({error:"No existe un Cart con la Id ingresada"})
    return
  }

  //Si se comprueba la validez de los parámetros se ejecutan las acciones para eliminar el producto al carrito
    const response = await cartManager.deleteCartProduct(cartId, productId);
    res.status(200).send({ message: "Producto eliminado del carrito", response });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export default router;