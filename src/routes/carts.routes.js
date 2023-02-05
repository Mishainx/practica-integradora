import { Router } from "express";
import { CartManager } from "../data/classes/DBManager.js";

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
    const response = await cartManager.delete(id);
    console.log(CartManager.delete(id))
    res.status(200).send({ message: "Carrito eliminado", response });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  const  cartId  = req.params.cid;
  const productId = req.params.pid
  const {quantity} = req.body;
  try {
    const response = await cartManager.update(cartId, productId,quantity);
    res.status(200).send({ message: "Carrito actualizado", response });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  const  cartId  = req.params.cid;
  const productId = req.params.pid

  try {
    const response = await cartManager.deleteCartProduct(cartId, productId);
    res.status(200).send({ message: "Producto eliminado del carrito", response });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export default router;