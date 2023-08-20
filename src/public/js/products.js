let btnAgregarCarrito = document.querySelectorAll('.btnAgregarCarrito'); // NodeList = [button#1, button#2 .... , button#n]
const cartId = '64c9d325f54c08f61e2cde00';
const contenedorCarrito = document.querySelector('#contenedorCarrito'); // contenedor donde se muestran los productos en la venta de carrito
const btnCarrito = document.querySelector('#btnCarrito'); // al presionar sobre el logo del carrito llamo a la función para mostrar los elementos en el carrito
const btnVaciarCarrito = document.querySelector('#btnVaciarCarrito'); //boton vaciar carrito

//Evento de boton agregar producto a carrito
btnAgregarCarrito.forEach((el) => {
	el.addEventListener('click', async (e) => {
		//traigo todos los botones
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
					position: 'top-end',
					showConfirmButton: false,
					timer: 3000,
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

//Evento de boton para mostrar carrito
btnCarrito.addEventListener('click', async () => {
	await fetch(`/api/carts/${cartId}`) //traigo el listado de productos de la BD
		.then((res) => res.json())
		.then((data) => {
			agregarElmentoCarrito(data);
		});
});

//Función para mostrar en pantalla los productos que van siendo agregados al carrito
function agregarElmentoCarrito(dato) {
	contenedorCarrito.innerText = ''; // Borro leyenda "Agregue productos al carrito"
	dato.forEach((elemento) => {
		//Por cada elemento genero un contenedor
		let div = document.createElement('div');
		div.className = 'card mb-2';
		div.style = 'height: 150px';
		div.innerHTML = `
            <div class="row w-100 align-items-center ms-1" >
                <div class="col-md-4 ms-auto d-flex justify-content-center">
                    <img src="${elemento.product.thumbnail}" class="img-fluid rounded-start px-1 " alt="img_${elemento.product.code}">
                </div>
                <div class="col-md-8">
                    <div class="card-body p-0 px-1 position-relative">
                        <h5 class="card-title m-0 fs-6 pe-4">${elemento.product.title} - ${elemento.product.code}</h5>
                        <p class="card-text m-0 fs-6 pe-3">Cantidad: ${elemento.quantity}</p>
                        <p class="fw-bold fst-italic fs-5 m-0">Precio: ${elemento.product.price} $ </p>

                    </div>
					
                </div>
            </div>
            `;
		contenedorCarrito.append(div);
	});
}

//Evento de boton para eliminar todos los productos del carrito
btnVaciarCarrito.addEventListener('click', () => {
	Swal.fire({
		title: 'Esta seguro?',
		text: 'No podra volver atras!',
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Si, deseo borrar!',
	}).then(async (result) => {
		if (result.isConfirmed) {
			await fetch(`/api/carts/${cartId}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
			});
			Swal.fire('Borrado!', 'Su carrito ha sido vaciado.', 'success');
			contenedorCarrito.innerHTML = ''; //borro prodcutos de la vista
		}
	});
});
