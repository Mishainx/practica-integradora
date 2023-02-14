const socket=io();

let buttonsQuantity = document.querySelectorAll(".productQuantityButton")
let listProductsContainer = document.getElementById("listProductsContainer")
let messageDiv = document.getElementById("messageDiv")

//Configuración para agregar el producto al carrito
for(let btn of buttonsQuantity){

    btn.addEventListener("click", addItem)

    function addItem(Event){
        let child = Event.target
        let father = child.parentNode
        let grand = father.parentNode
        let selectedProductId = grand.childNodes[1].childNodes[1].innerText

        let item ={
            id: selectedProductId    ,
            quantity: father.querySelector("input").value,
            father:father
        }
        socket.emit("sendItem", item)

        }   
    }

    socket.on("stockError",async(data)=>{
        let errorP = document.createElement("p")
        messageDiv.innerHTML = ""
        errorP.innerText = "* No hay stock suficente para la cantidad solicitada"
        errorP.style.color="rgb(188, 36, 36)"
        errorP.style.fontSize = "15px"
        errorP.style.textAlign = "center"
        messageDiv.append(errorP)
})

socket.on("addSuccess",async(data)=>{
    console.log(data)
    let successP = document.createElement("p")
    messageDiv.innerHTML = ""
    successP.innerText = "* Producto agregado exitósamente al carrito"
    successP.style.color="rgb(23, 123, 25)"
    successP.style.fontSize = "15px"
    successP.style.textAlign = "center"
    messageDiv.append(successP)
})