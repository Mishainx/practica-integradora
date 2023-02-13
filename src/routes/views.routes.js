import { Router } from "express";
const routerViews = Router();
const messages = []
import {productModel} from "../data/models/products.model.js"
import cartModel from "../data/models/carts.model.js"


// RouterViews.get "Home" devuelve una vista  del listado de productos sin socket server
routerViews.get('/home', async (req,res)=>{
    try{
        const productsList = await productModel.find().lean()
        res.status(200).render('home',{styleSheets:'css/styles',productsList})
    }
    catch(err){
        res.status(500).send({error:err})
    }
})

// RouterViews.GET "Real Time Products" devuelve una vista  del listado de productos que actualiza cambios en vivo con socket server
routerViews.get('/realTimeProducts', async (req,res)=>{
    try{
        const productsList = await productModel.find().lean()
        res.status(200).render('realTimeProducts',{styleSheets:'css/styles',productsList})
    }
    catch(err){
        res.status(500).send({error:err})
    }
})

// RouterViews.GET "Products" devuelve una vista  del listado de productos con paginación
routerViews.get('/products', async (req,res)=>{
    try{
        const productsList = await productModel.paginate({},{lean:true,page:1,limit:1})
        console.log(productsList)     
        res.status(200).render('products',{styleSheets:'css/styles',productsList})
    }
    catch(err){
        res.status(500).send({error:err})
    }
})

// RouterViews.GET "Chat devuelve una vista  donde funciona el chat conectado a Mongo y socketserver
routerViews.get("/chat",async(req,res)=>{
    res.status(200).render('chat',{title:"Chat",styleSheets:'css/styles'})
})

routerViews.get("/carts/:cid",async (req,res)=>{
    const cartId = req.params.cid
    let cart;

    //Comprobación de la estructura del parámetro Id recibido 
    if(cartId.trim().length!=24){ 
        let message = "La Id ingresada es inválida"
        res.status(400).render('carts_Id',{title:"Cart Id",styleSheets:'css/styles', message})
        return
      }
  
      //Comprobación de la existencia de un carrito con el parámetro ingresado.
      const cartExist = await cartModel.findById(cartId).lean().populate("products.product")
      console.log(cartExist)
      if(cartExist==null){
        let message = "No existe un carrito con la Id seleccionada"
        res.status(400).render('carts_Id',{title:"Cart Id",styleSheets:'css/styles', message})
        return
      }
      else{
        cart = cartExist
      }

    res.status(200).render('carts_Id',{title:"Cart Id",styleSheets:'css/styles', cart})
})

routerViews.get('/carts',async (req,res)=>{
    let message = "Para solicitar un Cart por favor indique el Id (/api/views/carts/:cid)"
    res.status(200).render('carts_Id',{title:"Cart Id",styleSheets:'css/styles', message})
})

export default routerViews