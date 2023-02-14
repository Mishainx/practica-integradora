let homeNavLink = document.getElementById("homeNavLink")
let productsNavLink = document.getElementById("productsNavLink")
let realTimeNavLink = document.getElementById("realTimeNavLink")
let chatNavLink = document.getElementById("chatNavLink")
let cartNavLink = document.getElementById("cartNavLink")
let btnsTrash = document.querySelectorAll(".btnTrash")

//Configuración Navbar
homeNavLink.href = "/"
realTimeNavLink.href = "/api/views/RealTimeProducts"
productsNavLink.href = "/api/views/products"
chatNavLink.href = "/api/views/chat"
cartNavLink.style.display = "none"


console.log(btnsTrash)

for(let btn of btnsTrash){
    btn.addEventListener("click", deleteItem)
}

    function deleteItem(Event){
    let child = Event.target
    let father = child.parentNode
    let deleteId = father.childNodes[1].childNodes[1].childNodes[1].innerText
}
