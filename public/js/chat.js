const socket = io();
let chatBox = document.getElementById("chatBox");

//Configuración de usuario para ingresar al Chat
let user;
Swal.fire({
  title: "Inicia sesión!",
  text: "Ingresa tu nombre de usuario",
  input: "text",
  confirmButtonText: "Cool",
  allowOutsideClick: false,
  inputValidator: (value) => {
    if (!value) {
      return "Debe ingresar un nombre de usuario";
    }
  },
}).then((result) => {
  if (result.value) {
    user = result.value;
    socket.emit("new-user", { user: user, id: socket.id });
  }
});

//Configuración de un event listener para capturar los mensajes enviados por el usuario
chatBox.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    if (chatBox.value.trim().length > 0) {
      console.log(socket)
      const message = chatBox.value
      socket.emit("message", {
        user,
        message,
      });
      chatBox.value = "";
    }
  }
});

//Renderización del listado de mensajes
socket.on("messageLogs",(data)=>{
  let log = document.getElementById("messageLogs")
  let messages = "";
  data.forEach(message=>{
    messages = messages+`${message.user} dice: ${message.message}</br>`
  })
  log.innerHTML =messages;
  })

//Aviso de que se conectó un nuevo user al chat
socket.on("new-user-connected", (data) => {
  if (data.id !== socket.id)
    Swal.fire({
      text: `${data.user} se ha conectado al chat`,
      toast: true,
      position: "top-end",
    });
});

// La función firstLoad se encarga proporcionar al usuario que ingresa en forma posterior el listado de mensajes anterior de la conversación
function firstLoad() {
  let log = document.getElementById("messageLogs");

  fetch("/messages")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let message = "";
      
      data.forEach((elem) => {
        if(elem.status == true){
          message += `
          <div class="chat-message">
            <div class="message-bubble">
              <p>${elem.name} dice: ${elem.message}</p>
            </div>
          </div>
          `;
        }
      });

      log.innerHTML = message;
    });
}

firstLoad();