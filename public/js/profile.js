
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
cartNavLink.style.display = `none`

const btnLogout = document.getElementById("btnLogout")

btnLogout.addEventListener("click",()=>{
    fetch('/logout', {method:"GET" ,
                      headers: {"Content-Type": "application/json",}
                      })
      .then((response) => response.json())
      .then((data) => {
        if(data.status == "success"){
            window.location.href = "/login"
        }
      })
})
