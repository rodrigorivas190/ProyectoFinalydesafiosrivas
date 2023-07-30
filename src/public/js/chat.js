const socket = io();
const chatbox = document.getElementById("chatbox");
let user = sessionStorage.getItem("user") || "";

//SweetAlert
if (!user) {
  Swal.fire({
    title: "Auth",
    input: "text",
    text: "Set username",
    inputValidator: (value) => {
      return !value.trim() && "Please write a username";
    },
    allowOutsideClick: false,
  }).then((result) => {
    user = result.value;
    document.getElementById("username").innerHTML = user;
    sessionStorage.setItem("user", user);
    socket.emit("new", user);
  });
} else {
  document.getElementById("username").innerHTML = user;
  socket.emit("new", user);
}

//Enviar mensajes
chatbox.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    const msn = chatbox.value.trim();

    if (msn.length > 0) {
      socket.emit("client:message", {
        user,
        message: msn,
      });

      chatbox.value = "";
    }
  }
});

//Recibir mensajes
socket.on("server:messages", (data) => {
  const divLogs = document.getElementById("logs");
  let messages = "";
  data.forEach((message) => {
    messages = `<p><b>${message.user}:</b> ${message.message}</p>` + messages;
  });

  divLogs.innerHTML = messages;
});
