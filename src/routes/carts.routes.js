import { Router } from "express";
import { CartManager } from "../data/classes/DBManager.js";
import cartModel from "../data/models/carts.model.js";
import { productModel } from "../data/models/products.model.js";

const router = Router();
const cartManager = new CartManager();
let response;

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
    const findCart = await cartModel.findOne({_id:cartId}).populate('products.product')
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
    let productsInCart = await cartModel.findById(id)
    productsInCart.products = []
    productsInCart.save()
    response = productsInCart

    res.status(200).send({ status: "succes", message: 'Productos del carrito eliminados exitósamente', payload: response});
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
    let selectedCart = await cartModel.find({_id: cartId})
    let productExistInCart = selectedCart[0].products.find((product)=>product.product == productId)

    if(productExistInCart == undefined){
      selectedCart[0].products.push({product: productId, quantity: quantity})
    }
    else{
      let newQuantity = productExistInCart.quantity + quantity
      let productIndex = selectedCart[0].products.findIndex((product)=> product.product == productId)
      selectedCart[0].products[productIndex].quantity = newQuantity
    }

    let result = await cartModel.updateOne({_id:cartId,},selectedCart[0])


    res.status(200).send({ message: "Producto agregado al carrito", selectedCart });
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

    // Comprobación de que el producto exista en el carrito
    let productExistInCart = cartExist.products.find((product)=>product.product == productId)
    if(productExistInCart == undefined){
    res.status(400).send({error:"No existe un producto en el carrito con la Id ingresada"})
    return
  }

  //Si se comprueba la validez de los parámetros se ejecutan las acciones para eliminar el producto al carrito
    const response = await cartManager.deleteCartProduct(cartId, productId);
    res.status(200).send({ message: "Producto eliminado del carrito", response });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

//La ruta api/carts/:cid/products/:pid (método put) actualiza el carrito con un array.
router.put("/:cid",async(req,res)=>{
  const  cartId  = req.params.cid;
  let newArray = await req.body
  console.log(newArray.products)
  

  try {
  //Comprobación de la estructura y validez de la Id del carrito recibida por parámetro
  if(cartId.trim().length!=24){
    res.status(400).send({error: "La Id del Cart ingresada no es válida"})
    return
  }
  const cartExist = await cartModel.findById(cartId)

  if(cartExist==null){
    res.status(400).send({error:"No existe un Cart con la Id ingresada"})
    return
  }

  //Si se comprueba la validez de los parámetros se ejecutan las acciones para actualizar el carrito
  await cartModel.findByIdAndUpdate({_id:cartId},{products:newArray.products})
  res.status(200).send({status:'success', message:'El carrito se ha actualizado exitósamente', payload:"lala"})
  }
  catch(err){
    res.status(500).send(err.message);
  }
})

//La ruta api/carts/:cid/products/:pid (método put) actualiza la cantidad de ejemplares de un producto por parámetro
router.put("/:cid/products/:pid",async(req,res)=>{
  const  cartId  = req.params.cid;
  const productId = req.params.pid
  const newQuantity = req.body

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

  // Comprobación de que el producto exista en el carrito
  let productExistInCart = cartExist.products.find((product)=>product.product == productId)
  if(productExistInCart == undefined){
  res.status(400).send({error:"No existe un producto en el carrito con la Id ingresada"})
  return
}


  //Si se comprueba la validez de los parámetros se ejecutan las acciones para actualizar product quantity
  let productFindIndex = cartExist.products.findIndex((product)=>product.product == productId)
  cartExist.products[productFindIndex].quantity = newQuantity.quantity  
  await cartModel.updateOne({_id: cartId},cartExist)

  response = cartExist
  res.status(200).send({status:'success', message:'El producto se ha actualizado exitósamente', payload:response})
  }
  catch(err){
    res.status(500).send(err.message);
  }
})


export default router;