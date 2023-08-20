// //Elementos Login
// const btnLogin = document.getElementById("btnLogin");
// const InputEmail = document.getElementById("InputEmail");
// const InputPassword = document.getElementById("InputPassword");
// const loginError = document.getElementById("loginError");

// //Evento al presionar boton de Iniciar Sesion
// btnLogin.addEventListener("click", async () => {
// 	//traigo los valores de los campos input
// 	const datos = {
// 		email: InputEmail.value,
// 		password: InputPassword.value,
// 	};
// 	//Realizo post
// 	await fetch("/api/session/login", {
// 		method: "POST",
// 		body: JSON.stringify(datos),
// 		headers: {
// 			"Content-Type": "application/json",
// 		},
// 	})
// 		.then((response) => response.json())
// 		.then((data) => {
// 			if (data.status === "success") {
// 				//Si tengo sucess en la respuesta redirijo a la vista productos
// 				window.location.replace("/realTimeProducts");
// 			}
// 			if (data.status === "error") {
// 				//Sino informo error
// 				Swal.fire({
// 					icon: "error",
// 					title: "Oops...",
// 					text: "usuario y/o contraseña incorrectos",
// 				});
// 			}
// 		});
// });
function login() {
	const username = document.getElementById("loginEmail").value;
	const password = document.getElementById("loginPassword").value;
	const user = { username, password };
	fetch("/api/session/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(user),
	})
		.then((response) => response.json())
		.then((data) => {
			if (data.status === "success") {
				//Si tengo sucess en la respuesta redirijo a la vista productos
				window.location.replace("/realTimeProducts");
			}
				if (data.status === "error") {
					//Sino informo error
					Swal.fire({
						icon: "error",
						title: "Oops...",
						text: "usuario y/o contraseña incorrectos",
					});
			}
		});
}

