import { Router } from "express";
const routerViews = Router();
const messages = []
import productModel from "../data/models/products.model.js"

routerViews.get('/home', async (req,res)=>{
    try{
        const productsList = await productModel.find().lean()
        res.status(200).render('home',{styleSheets:'css/styles',productsList})
    }
    catch(err){
        res.status(500).send({error:err})
    }
})


routerViews.get('/realTimeProducts', (req,res)=>{
    res.send("hello world") 
    }
)

routerViews.get("/chat",(req,res)=>{
    res.status(200).render('chat',{title:"Chat",styleSheets:'css/styles'})
})

export default routerViews