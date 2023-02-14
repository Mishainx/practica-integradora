const socket=io();

let buttonsQuantity = document.querySelectorAll(".productQuantityButton")

//Configuración para agregar el producto al carrito

for(let btn of buttonsQuantity){

    btn.addEventListener("click", addItem)

    function addItem(Event){
        let child = Event.target
        let father = child.parentNode
        let grand = father.parentNode
        let selectedProductId = grand.childNodes[1].childNodes[1].innerText
        console.log(selectedProductId)

        let item ={
            id: selectedProductId    ,
            quantity: father.querySelector("input").value
        }
        socket.emit("sendItem", item)

        }   
    }