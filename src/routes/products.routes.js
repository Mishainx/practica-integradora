import { Router } from "express";
import { ProductManager } from "../data/classes/DBManager.js";
import { productModel } from "../data/models/products.model.js";

const router = Router();
const productManager = new ProductManager();

// la ruta api/products devuelve el listado de productos existentes en MongoDB. Posee query limit configurado para acotar la muestra devuelta
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


// la ruta api/products/:pid devuelve el producto que coincida con la Id solicitada.
router.get("/:pid", async(req,res)=>{

  const id  = req.params.pid;

  //Comprobación de la estructura de la Id
  if(id.trim().length!=24){ 
    res.status(400).send({error: "La Id de producto ingresada no es válida"})
    return
  }

  //Comprobación de la existencia del producto
  const productExist = await productModel.findById(id)

  if(productExist==null){
    res.status(400).send({error:"No existe un producto con la Id ingresada"})
    return
  }

  // Si la Id es válida y el producto existe se devuelve el producto solicitado
  try{
    const result = await productManager.getProductByID(id)
    res.status(200).send({status:"success",payload:result})
  }
  catch (err) {
    res.status(500).send(err.message);
  }
})

// api/products post recibe un producto y valida para agregarlo al listado de productos
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

  // Comprobación del código de producto para evitar que se repita
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


// La ruta api/products/:pid (método delete) se encarga de eliminar un producto del listado.
router.delete("/:pid", async (req, res) => {
  const  id  = req.params.pid;


  //Comprobación de la estructura de la Id.
  if(id.trim().length!=24){ 
    res.status(400).send({error: "La Id de producto ingresada no es válida"})
    return
  }

  //Comprobación de la existencia del producto.
  const productExist = await productModel.findById(id)

  if(productExist==null){
    res.status(400).send({error:"No existe un producto con la Id ingresada"})
    return
  }

  //Si se comprueba la Id se ejecutan las acciones para eliminar el producto.
  try {
    const result = await productManager.delete(id);

    res.status(200).send({ message: "Producto eliminado", result });
  } catch (err) {
    res.status(500).send(err.message);
  }
});


// La ruta api/products/:pid (método put) se encarga de actualizar un producto  existente.
router.put("/:pid", async (req, res) => {
  const { pid } = req.params;
  const property = req.body;

  //Comprobación de la estructura de la Id.
  if(pid.trim().length!=24){ 
    res.status(400).send({error: "La Id de producto ingresada no es válida"})
    return
  }

  //Comprobación de la existencia del producto.
  const productExist = await productModel.findById(pid)

  if(productExist==null){
    res.status(400).send({error:"No existe un producto con la Id ingresada"})
    return
  }

  //Si se comprueba la Id se ejecutan las acciones para actualizar el producto.
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