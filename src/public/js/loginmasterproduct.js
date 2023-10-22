const btnLogInMasterProduct = document.getElementById('btnLogInMasterProduct');

//evento al hacer click en el botón.
btnLogInMasterProduct.addEventListener('click', async () => {
	//obtengo los valores de los inputs y genero un objeto con los datos
	const username = document.getElementById('LogInInputEmailMasterProducts').value;
	const password = document.getElementById('LogInInputPassMasterProducts').value;
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
				window.location.replace('/masterproducts');
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
