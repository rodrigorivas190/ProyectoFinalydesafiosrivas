const btnRestablecerPass = document.getElementById('btnRestablecerPass');

btnRestablecerPass.addEventListener('click', async () => {
	const email = document.getElementById('restorePassInputEmail').value;
	const password = document.getElementById('restorePassInputPass').value;
	//realizo un post para loguear
	await fetch('/api/users/restorepass', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ email, password }),
	})
		.then((response) => response.json())
		.then((data) => {
			//cuando obtengo la respuesta redirijo
			if (data.status === 'success') {
				//alert con confirmación de operación
				Swal.fire({
					title: 'Contraseña modificada correctamente!',
					icon: 'success',
					confirmButtonColor: '#212529',
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						window.location.replace('/');
					}
				});
			}
			if (data.status === 'error') {
				//sino, indico error de logueo
				Swal.fire({
					icon: 'error',
					title: 'Oops...',
					text: `${data.message}`,
				});
			}
		});
});
