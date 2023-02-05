import { Router } from "express";
import { ProductManager } from "../data/classes/DBManager.js";

const router = Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
  try {
    const product = await productManager.read();
    res.status(200).send({ productos: product });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get("/:pid", async(req,res)=>{
  const id  = req.params.pid;
  try{
    const result = await productManager.getProductByID(id)
    res.status(200).send(result)
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