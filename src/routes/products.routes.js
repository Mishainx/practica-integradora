import { Router } from "express";
import { ProductManager } from "../data/classes/DBManager.js";
import { productModel } from "../data/models/products.model.js";

const router = Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
  try {
    const readProducts = await productModel.find()
    const limit = req.query.limit
    let response;
    if(readProducts.length >0){
      if(limit && !isNaN(Number(limit))){
        let products = await productModel.find()
        response = products.slice(0,limit)
        res.status(200).send(response)
      }
    else{
        response = readProducts
        res.status(200).send(response)
    }  
    }
    else{
      response = "El listado no cuenta con productos"
      res.status(200).send(response)
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get("/:pid", async(req,res)=>{

  const id  = req.params.pid;

  if(id.trim().length!=24){ 
    res.status(400).send({error: "La Id de producto ingresada no es válida"})
    return
  }

  const productExist = await productModel.findById(id)

  if(productExist==null){
    res.status(400).send({error:"No existe un producto con la Id ingresada"})
    return
  }

  try{
    const result = await productManager.getProductByID(id)
    res.status(200).send({status:"success",payload:result})
  }
  catch (err) {
    res.status(500).send(err.message);
  }
})

router.post("/", async (req, res) => {
  const {
    title,
    description,
    code,
    price,
    thumbnail,
    stock,
    category,
    status,
  } = req.body;

  if (
    !title ||
    !description ||
    !code ||
    !price ||
    !thumbnail ||
    !stock ||
    !category ||
    !status
  ) {
    res.status(400).send({ error: "Faltan datos" });
    return;
  }

  const codeExist = await productModel.findOne({code:code})

  if(codeExist){ 
    res.status(400).send({error: "El código ingresado ya existe"})
    return
  }

  try {
    const response = await productManager.create({
      title,
      description,
      code,
      price,
      thumbnail,
      stock,
      category,
      status,
    });
    res.status(200).send({ message: "Producto creado", response });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.delete("/:pid", async (req, res) => {
  const  id  = req.params.pid;

  if(id.trim().length!=24){ 
    res.status(400).send({error: "La Id de producto ingresada no es válida"})
    return
  }

  const productExist = await productModel.findById(id)

  if(productExist==null){
    res.status(400).send({error:"No existe un producto con la Id ingresada"})
    return
  }

  try {
    const result = await productManager.delete(id);

    res.status(200).send({ message: "Producto eliminado", result });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.put("/:pid", async (req, res) => {
  const { pid } = req.params;
  const property = req.body;

  if(pid.trim().length!=24){ 
    res.status(400).send({error: "La Id de producto ingresada no es válida"})
    return
  }

  const productExist = await productModel.findById(pid)

  if(productExist==null){
    res.status(400).send({error:"No existe un producto con la Id ingresada"})
    return
  }

  try{
    const newProperty = await productManager.update(pid,property)
    const response = await productManager.getProductByID(pid)
    res.status(200).send({message:"Producto actualizado exitósamente", response})
  }
  catch (err) {
    res.status(500).send(err.message);
  }
});



export default router;