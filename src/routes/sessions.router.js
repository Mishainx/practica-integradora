import { Router } from "express";
import userModel from "../data/models/user.model.js"
const sessionsRouter = Router();

//Sessions router (POST), se encarga de realizar el login
sessionsRouter.post('/login',async (req,res)=>{
    const { email, password } = req.body;
    let expReg= /^(([^<>()\[\]\.,;:\s@\”]+(\.[^<>()\[\]\.,;:\s@\”]+)*)|(\”.+\”))@(([^<>()[\]\.,;:\s@\”]+\.)+[^<>()[\]\.,;:\s@\”]{2,})$/;
    let validateEmail =expReg.test(email)
    
    //Comprobación de que haya email
    if(email == undefined){
        res.status(400).send("Para loguearse debe indicar el email de usuario")
        return
    }

    if(!validateEmail){
        res.status(400).send("Ingrese un email válido")
        return
    }

    //Comprobación de que el password no esté vacío
    if(password == undefined){
        res.status(400).send("Para loguearse debe ingresar el password")
        return
    }

    try {
        const findUser = await userModel.findOne({
          email: email,
          password: password,
        });

        if (findUser) {
          req.session.user = email
          if(email == "adminCoder@coder.com"){
            req.session.admin = true
          }
          else{
            req.session.admin = false
          }
          
          let response ={
            email: req.session.user,
            name: findUser.first_name,
            surname: findUser.last_name,
            age: findUser.age,
            rol: req.session.admin? "Admin": "User",
          }
          res.status(200).json({ message: "Login success", data: response });
        } else {
          res.status(404).json({ message: "Login error", data: "User not found" });
        }
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
 })

// Ruta signup para registrar un usuario
sessionsRouter.post("/signup", async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    let expReg= /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
    let validateEmail =expReg.test(email)
    let expRegName = /^[a-zA-ZÀ-ÿ\s]{1,40}$/
    let validateName =  expRegName.test(first_name)
    let validateSurname = expRegName.test(last_name)
    let expRegAge = /^\d{1,2}$/
    let validateAge = expRegAge.test(age)

    //comprobación de campos
    if(first_name == undefined || last_name == undefined || email == undefined || age == undefined || password == undefined){
      res.status(400).send({ status: "error", message: "Todos los campos deben ser completados"});
      return
    }
  
  //Comprobación de la estructura y validez del campo email
  if(email == undefined){
    res.status(400).send({status:"error", message:"Para loguearse debe indicar el email de usuario"})
    return
}

if(!validateEmail){
  res.status(400).send({status:"error", message:"Ingrese un email válido"})
  return
}

//Comprobación de la estructura y validez del campo name
if(!validateName){
    res.status(400).send({status:"error", message:"Ingrese un nombre válido"})
    return
  }

//Comprobación de la estructura y validez del campo last_name
if(!validateSurname){
    res.status(400).send({status:"error", message:"Ingrese un apellido válido"})
    return
  }

//Comprobación de la estructura y validez del campo age
if(!validateAge){
    res.status(400).send({status:"error", message:"Ingrese una edad válida entre 1 y 99 años"})
    return
}

    const newUser = {
      first_name,
      last_name,
      email,
      age,
      password,
    };
  
    try {
  
      //Comprobación de que el email no haya sido registrado
      let findUser = await userModel.findOne({email:email})
  
      if (findUser){
        res.send({ status: "error", message: "El usuario ya existe"});
        return
      }
  
      
      const userCreate= await userModel.create(newUser);
      res.send({ status: "success", message: "Usuario creado exitosamente" });
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

export default sessionsRouter;