function login() {
	//obtengo campos del formulario
	const username = document.getElementById('loginEmail').value;
	const password = document.getElementById('loginPassword').value;
	const user = { username, password };

	//realizo un post para loguear
	fetch('/api/users/auth', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(user),
	})
		.then((response) => response.json())
		.then((data) => {
			//cuando obtengo la respuesta redirijo
			if (data.status === 'success') {
				window.location.replace('/products');
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
}
