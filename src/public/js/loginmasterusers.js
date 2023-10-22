const btnLogInMasterUsers = document.getElementById('btnLogInMasterUsers');

//evento al hacer click en el botón.
btnLogInMasterUsers.addEventListener('click', async () => {
	//obtengo los valores de los inputs y genero un objeto con los datos
	const username = document.getElementById('LogInInputEmailMasterUsers').value;
	const password = document.getElementById('LogInInputPassMasterUsers').value;
	const user = { username, password };

	console.log(user)
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
				window.location.replace('/masterusers');
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
