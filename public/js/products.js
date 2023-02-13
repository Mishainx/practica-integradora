const socket=io();

const productQuantity = document.getElementById('productQuantity')
const productQuantityButton = document.getElementById('productQuantityButton')
const productViewId = document.getElementById("productViewId")

productQuantityButton.addEventListener("click", async()=>{
    let item={
        id:productViewId.value,
        quantity:productQuantity.value,
    }
    socket.emit("sendQuantity", item)
})