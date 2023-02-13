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
        const limit = req.query.limit || 10
        const page = req.query.page || 1
        let category = req.query.category || undefined
        const sort = req.query.sort || ""
        let stockQuery = req.query.stock || undefined
    
        //Validación en caso de que se haya ingresado limit
        if(isNaN(Number(limit))){
          res.status(400).send({status:"error", payload:"El limit ingresado es inválido"})
          return
        }
        //Validación en caso de que se haya ingresado page
        if(isNaN(Number(page))){
          res.status(400).send({status:"error", payload:"El valor de page inválido"})
          return
        }
    
        //Validación en caso de que se haya ingresado sort
        if(sort != ""){
          if(sort != 1 & sort !=-1){
            res.status(400).send({status:'error',payload:'El valor de sort debe ser 1 o -1'})
            return
          }
        }
    
        //Validación en caso de que se haya ingresado query por stock
        if(stockQuery!=undefined){
          if(stockQuery !=1 & stockQuery!=0){
            res.status(400).send({status:"Error",payload:"El valor ingresado es incorrecto. Sin stock:0/ Con stock:1"})
            return
          }
          stockQuery==1?stockQuery={stock:{$gte:1}}:stockQuery={stock:{$lt:1}}
        }
    
            //Validación en caso de que se haya ingresado query por categoría
            if(category!=undefined){
              const checkCategory = await productModel.exists({category:category})
              if(!checkCategory){
                res.status(400).send({status:"Error",payload:"La categoría ingresada es inexistente"})
                return
              }
              category={category:category}
            }
    
        // Se realiza la paginación conforme los querys seleccionados
        let productlist = await productModel.paginate({...category,...stockQuery},{lean:true, limit:limit, page:page, sort: {price:sort}})

        res.status(200).render('products',{styleSheets:'css/styles', productlist})
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