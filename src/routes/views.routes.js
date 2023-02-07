import { Router } from "express";
const routerViews = Router();
const messages = []
import {productModel} from "../data/models/products.model.js"


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

// RouterViews.GET "Chat devuelve una vista  donde funciona el chat conectado a Mongo y socketserver
routerViews.get("/chat",(req,res)=>{
    res.status(200).render('chat',{title:"Chat",styleSheets:'css/styles'})
})

export default routerViews