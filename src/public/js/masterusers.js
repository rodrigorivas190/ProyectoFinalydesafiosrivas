//obtengo todos los botens editar y eliminar
let btnEditUser = document.querySelectorAll('.btnEditUser'); // NodeList = [button#1, button#2 .... , button#n] array con todos los botones
let btnDeleteUser = document.querySelectorAll('.btnDeleteUser'); // NodeList = [button#1, button#2 .... , button#n] array con todos los botones
let btnDeleteAllUsers = document.getElementById('btnDeleteAllUsers');

//Inputs de modificar rol de usuario
let inputRole = document.getElementById('inputRole');

//Boton para ugardar los 
let btnSaveUpdatedUser = document.getElementById('btnSaveUpdatedUser');

let userId;
let userDeleteId;
let user;

//Evento de boton editar usuario
btnEditUser.forEach((el) => {
	//por cada boton agrego elevento
	el.addEventListener('click', async (e) => {
		//obtengo el id del usuario que agregue en el boton
		let str = e.target.id;
		let parts = str.split('btnEdit');
		userId = parts[1];

		//fetch para obtener datos del usuario
		await fetch(`/api/users/${userId}`)
			.then((res) => res.json())
			.then((data) => {
				user = data.payload;
			});
		inputRole.value = user.role;//agrego el valor al input 
	});
});

//Evento de boton agregar producto a carrito
btnDeleteUser.forEach((el) => {
	//por cada boton agrego elevento
	el.addEventListener('click', async (e) => {
		let str = e.target.id;
		let parts = str.split('btnDelete');
		userDeleteId = parts[1];
		let cartId;
		//fetch para obtener datos del usuario
		await fetch(`/api/users/${userDeleteId}`)
			.then((res) => res.json())
			.then((data) => {
				user = data.payload;
			});
		cartId = user.cartId; // obtengo el cart id
		//alert para confirmar el borrado
		Swal.fire({
			title: 'Esta seguro que desea eliminar usuario?',
			text: 'No podra volver atras!',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#212529',
			cancelButtonColor: '#dc3545',
			confirmButtonText: 'Si, deseo borrar!',
		}).then(async (result) => {
			if (result.isConfirmed) {
				//fetch a ruta para eliminar usuario
				await fetch(`/api/users/${userDeleteId}`, {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
					},
				});
				//fetch a ruta para eliminar carrito
				await fetch(`/api/carts/delete/${cartId}`, {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
					},
				});
				//Alert con la confirmación del borrado
				Swal.fire({
					title: 'Usuario borrado!',
					icon: 'success',
					confirmButtonColor: '#212529',
				}).then((result) => {
					if (result.isConfirmed) {
						window.location.replace('/masterusers');
					}
				});
			}
		});
	});
});

//Evento de boton para guardar los datos de usuario modificados
btnSaveUpdatedUser.addEventListener('click', async (e) => {
	let newUser = {
		email: user.email,
		role: inputRole.value,
	};

	//fetch para modificar el usuario
	await fetch(`/api/users/`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(newUser),
	});
	//alert con confirmación de operación
	Swal.fire({
		title: 'Usuario actualizado!',
		icon: 'success',
		confirmButtonColor: '#212529',
	}).then((result) => {
		if (result.isConfirmed) {
			window.location.replace('/masterusers');
		}
	});
});

//Evento para eliminar a todos los usuarios
btnDeleteAllUsers.addEventListener('click', (e) => {
	Swal.fire({
		title: 'Seguro desea continuar?',
		text: 'se eliminaran todos los usuarios que no hayan tenido conexión en los últimos 2 dias',
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#212529',
		cancelButtonColor: '#dc3545',
		confirmButtonText: 'Si, deseo borrar!',
	}).then(async (result) => {
		if (result.isConfirmed) {
			//fetch a ruta para eliminar usuarios
			await fetch(`/api/users/`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
			});
			//Alert con la confirmación del borrado
			Swal.fire({
				title: 'Usuarios borrados!',
				icon: 'success',
				confirmButtonColor: '#212529',
			}).then((result) => {
				if (result.isConfirmed) {
					window.location.replace('/masterusers');
				}
			});
		}
	});
});
