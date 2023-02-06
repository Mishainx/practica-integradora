import { response, Router } from "express";
import { CartManager } from "../data/classes/DBManager.js";
import cartModel from "../data/models/carts.model.js";
import { productModel } from "../data/models/products.model.js";

const router = Router();
const cartManager = new CartManager();

router.get("/", async (req, res) => {
  try {
    const cart = await cartManager.read();
    res.send(cart);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid
    const cart = await cartManager.read();

    if(cartId.trim().length!=24){ 
      res.status(400).send({error: "La Id del Cart ingresada no es válida"})
      return
    }
    const cartExist = await cartModel.findById(cartId)
    if(cartExist==null){
      res.status(404).send({error:"No existe un Cart con la Id ingresada"})
      return
    }
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

router.post("/", async (req, res) => {
  try {
    const response = await cartManager.create();
    console.log(response);
    res.status(200).send({ message: "Carrito creado", response });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    if(id.trim().length!=24){ 
      res.status(400).send({error: "La Id del Cart ingresada no es válida"})
      return
    }
    const cartExist = await cartModel.findById(id)
    if(cartExist==null){
      res.status(404).send({error:"No existe un Cart con la Id ingresada"})
      return
    }
    const response = await cartManager.delete(id);
    res.status(200).send({ message: "Carrito eliminado", response });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post("/:cid/products/:pid", async (req, res) => {
  const  cartId  = req.params.cid;
  const productId = req.params.pid
  const {quantity} = req.body;

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
  try {
    const response = await cartManager.update(cartId, productId,quantity);
    res.status(200).send({ message: "Producto agregado al carrito", response });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  const  cartId  = req.params.cid;
  const productId = req.params.pid

  try {

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
    const response = await cartManager.deleteCartProduct(cartId, productId);
    res.status(200).send({ message: "Producto eliminado del carrito", response });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export default router;