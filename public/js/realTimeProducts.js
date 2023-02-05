const socket=io();
let addProductContainer = document.getElementById('addProductContainer')
let addTitleForm = document.getElementById('addTitleForm')
let addDescriptionForm = document.getElementById('addDescriptionForm')
let addPriceForm = document.getElementById('addPriceForm')
let addCodeForm = document.getElementById('addCodeForm')
let addThumbnailForm = document.getElementById('addThumbnailForm')
let addStatusForm = document.getElementById('addStatusForm')
let addStrockForm = document.getElementById('addStockForm')
let addBtnForm = document.getElementById('addBtnForm')
let deleteProductContainer = document.getElementById('deleteProductContainer')
let deleteIdForm = document.getElementById('deleteIdForm')
let deleteIdBtn = document.getElementById('deleteIdBtn')
let addForm = document.getElementById("addForm")
let idInvalida = document.getElementById('idInvalida')
let invalidCode = document.getElementById("invalidCode")
let itemForm ={}

addProduct()
deleteProduct()

socket.emit("realTimeConnection", "Cliente conectado")


//Funciones


//Función addProduct
function addProduct(){
    addBtnForm.addEventListener("click", function(Event){
        Event.preventDefault()        

        const titleValidate = addTitleForm.value != ""
        const descriptionValidate = addDescriptionForm.value != ""
        const priceValidate = addPriceForm.value > 0 
        const codeValidate = addCodeForm.value != "" 
        const stockValidate = addStockForm.value > 0 && addStockForm != ""
        const statusValidate = addStatusForm.value == "True" || addStatusForm.value == "False"
        

        if(titleValidate,descriptionValidate,priceValidate,stockValidate, codeValidate){
           socket.emit("findCode", addCodeForm.value)
           socket.on("resultFindCode", (data)=>{
            if(data==null){
                item={
                    title: addTitleForm.value,
                    description: addDescriptionForm.value,
                    price: addPriceForm.value,
                    stock: addStockForm.value,
                    code: addCodeForm.value,
                    thumbnail: [],
                    status: addStatusForm.value == "True"? true:false
                }
                socket.emit("createItem", item)
                //addForm.reset()
                invalidCode.innerHTML=""
                let succesCodeMsg = document.createElement("p")
                succesCodeMsg.innerText = "Producto agregado exitósamente"
                succesCodeMsg.style.color="rgb(23, 123, 25)"
                invalidCode.append(succesCodeMsg)
            }
            else{
                invalidCode.innerHTML=""
                let invalidCodeMsg = document.createElement("p")
                invalidCodeMsg.innerText = "El código ingresado ya se encuentra en el listado"
                invalidCodeMsg.style.color="rgb(188, 36, 36)"
                invalidCode.append(invalidCodeMsg)
            }

           

        renderList()
        
        })
    }
    else{
        invalidCode.innerHTML=""
        let invalidFormMsg = document.createElement("p")
        invalidFormMsg.innerText = "* Formulario completado incorrrectamente"
        invalidFormMsg.style.color="rgb(188, 36, 36)"
        invalidCode.append(invalidFormMsg)
    }}
)}
        
//Función deleteProduct
function deleteProduct(){
    deleteIdBtn.addEventListener("click", function(Event){
        Event.preventDefault()

        const itemDelete = deleteIdForm.value
        const validateId= itemDelete != ""

        if(validateId){       
            socket.emit("findId", itemDelete )
            socket.on("resultFindId",(data)=>{
                if(data!=null){
                    socket.emit("deleteItem",itemDelete)
                    idInvalida.innerHTML= ""
                    let deleteSucces = document.createElement("p")
                    deleteSucces.innerText = "Productos eliminado exitósamente"
                    deleteSucces.style.color="rgb(23, 123, 25)"
                    idInvalida.appendChild(deleteSucces)

                    renderList()
                }
                else{
                    idInvalida.innerHTML= ""
                    let deleteMsg = document.createElement("p")
                    deleteMsg.innerText = "* La Id ingresada no se encuentra en el listado de productos"
                    deleteMsg.style.color = "rgb(188, 36, 36)"
                    idInvalida.appendChild(deleteMsg)
                }
        })}
        else{
            idInvalida.innerHTML= ""
            let deleteMsg = document.createElement("p")
            deleteMsg.innerText = "* Para eliminar un producto ingrese un Id válida en el formulario"
            deleteMsg.style.color = "rgb(188, 36, 36)"
            idInvalida.appendChild(deleteMsg)
        }
    }
)}



function showItem(e){
    let child = e.target
    let father = child.parentNode
    let hideP = father.querySelectorAll(".hideP")
    for(let p of hideP){
        p.classList.toggle("active")
    }
}

    function renderList(){
        socket.on("newList", (data)=>{
            realTimeProducts.innerHTML = "<h2>Listado de Productos<h2>"
        
            data.forEach(product=>{
                //Render divProduct
                
                let divProduct = document.createElement("div")
                divProduct.classList.add("realTimeItem")
        
                let divProperties = document.createElement("div")
                divProperties.classList.add("homeProperties")
                
                //Render titles
                let productTitle = document.createElement("p")
                productTitle.innerText =  `${product.title}`
        
                
                let productId = document.createElement("p")
                productId.innerText = `Id: ${product.id}`
                productId.classList.add("hideP")
        
                let productDescription = document.createElement("p")
                productDescription.innerText = `Descripción: ${product.description}`
                productDescription.classList.add("hideP")
        
                let productPrice = document.createElement("p")
                productPrice.innerText = `Precio: ${product.price}`
                productPrice.classList.add("hideP")
        
                
                let productStock = document.createElement("p")
                productStock.innerText = `Stock: ${product.stock}`
                productStock.classList.add("hideP")
        
                let productCode = document.createElement("p")
                productCode.innerText = `Code: ${product.code}`
                productCode.classList.add("hideP")
        
                let btnProduct = document.createElement('button')
                btnProduct.innerText = "Ver completo"
                btnProduct.classList.add("btnShow")
        
                //Inserto elementos
                realTimeProducts.append(divProduct)
                divProduct.append(divProperties,btnProduct)
                divProperties.append(productTitle,productId,productDescription,productPrice,productCode)
        
                
        })
        let btnsShow = document.querySelectorAll(".btnShow")
        for(let btn of btnsShow){
            btn.addEventListener("click", showItem)
        }
        })

    }

    let btnsShow = document.querySelectorAll(".btnShow")
    for(let btn of btnsShow){
        btn.addEventListener("click", showItem)
    }