function login() {
	const username = document.getElementById('loginEmail').value;
	const password = document.getElementById('loginPassword').value;
	const user = { username, password };
	fetch('/api/users/auth', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(user),
	})
		.then((response) => response.json())
		.then((data) => {
			if (data.status === 'success') {
				window.location.replace('/products');
			}
			if (data.status === 'error') {
				Swal.fire({
					icon: 'error',
					title: 'Oops...',
					text: 'usuario y/o contraseña incorrectos',
				});
			}
		});
}
