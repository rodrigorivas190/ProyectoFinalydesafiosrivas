let btnAgregarCarrito = document.querySelectorAll('.btnAgregarCarrito'); // NodeList = [button#1, button#2 .... , button#n] array con todos los botones

//Evento de boton agregar producto a carrito
btnAgregarCarrito.forEach((el) => {
	//por cada boton agrego elevento
	el.addEventListener('click', async (e) => {
		let cartId;
		//fetch para obtener datos de la sesion actual
		await fetch('/api/sessions/current')
			.then((res) => res.json())
			.then((data) => {
				cartId = data.cartId;
			});

		//fetch para agregar los productos al carrito
		await fetch(`/api/carts/${cartId}/product/${e.target.id}`, {
			//agrego endpoint
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then(() => {
				const Toast = Swal.mixin({
					//Alert para avisar que el producto fue agregado
					toast: true,
					position: 'bottom-end',
					showConfirmButton: false,
					timer: 2000,
					timerProgressBar: true,
					didOpen: (toast) => {
						toast.addEventListener('mouseenter', Swal.stopTimer);
						toast.addEventListener('mouseleave', Swal.resumeTimer);
					},
				});

				Toast.fire({
					icon: 'success',
					title: 'Producto agregado al carrito!',
				});
			})
			.catch((err) => {
				alert(`Error al agregar producto al carrito ${err}`);
			});
	});
});
