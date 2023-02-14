const socket=io();

const productQuantity = document.getElementById('productQuantity')
const productQuantityButton = document.getElementById('productQuantityButton')
const productViewId = document.getElementById("productViewId")
const prevPageButton = document.getElementById("prevPageButton")
const nextPageButton = document.getElementById("nextPageButton")

//Configuración para agregar el producto al carrito
productQuantityButton.addEventListener("click", async()=>{
    let item={
        id: productViewId.innerText,
        quantity:productQuantity.value,
    }
    socket.emit("sendQuantity", item)
    console.log(item)
})
