const socket = io(); // se levanta socket del lado del cliente
const inputMSJ = document.getElementById('msj');
const botonEnviar = document.getElementById('btnEnviar');
let user = '';

//Logueo de sweet Alert
Swal.fire({
	title: 'Ingrese dirección de email',
	input: 'email',
	inputPlaceholder: 'Ingrese su dirección de correo',
	inputValidator: (value) => {
		return (
			!/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(value) &&
			'dirección de correo invalida, ingrese nuevamente' //Expresion regular para validar email
		);
	},
	allowOutsideClick: false,
}).then((result) => {
	user = result.value; // Guardo el usuario
});

//Funcion para renderizae los mensajes
function renderMensajes(data) {
	// Genero el html
	const html = data
		.map((elem) => {
			// Recorro el array de mensajes y genero el html
			return `<div>
				<strong>${elem.user}:</strong>
                <em>${elem.msj}</em>
            </div>`;
		})
		.join(' '); // Convierto el array de strings en un string

	// Inserto el html en el elemento con id messages
	document.getElementById('messages').innerHTML = html;
}

//Event Listener para tomar el texto del input y enviarlo al servidor
inputMSJ.addEventListener('keyup', (event) => {
	if (event.key === 'Enter') {
		let msj = inputMSJ.value;
		if (msj.trim().length > 0) {
			socket.emit('message', { user, msj });
			inputMSJ.value = '';
		}
	}
});

//Escucho el evento messages y renderizo los mensajes en pantalla
socket.on('messages', (data) => {
	renderMensajes(data);
});
