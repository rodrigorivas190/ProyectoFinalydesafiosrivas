let btnBePremium = document.getElementById('btnBePremium');

function backToProducts() {
	window.location.replace('/products');
}

async function BePremium(){
	let userId;
	let role;
	///fetch para obtener datos de la sesion actual
	await fetch('/api/sessions/current')
		.then((res) => res.json())
		.then((data) => {
			userId = data._id;
			role = data.role;
		});
	///fetch para modificar usuario
	await fetch(`/api/users/premium/${userId}`)
		.then((res) => res.json())
		.then((data) => {
			//cuando obtengo la respuesta redirijo
			if (data.status === 'success') {
				//alert con confirmación de operación
				Swal.fire({
					title: 'Usuario Actualizado!',
					text: role === 'user' ? 'Ahora sos un usuario premium' : 'Ahora sos un usuario normal',
					icon: 'success',
					confirmButtonColor: '#212529',
				}).then((result) => {
					if (result.isConfirmed) {
						window.location.replace('/products');
					}
				});
			}
		});
}