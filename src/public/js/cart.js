const btnCarrito = document.querySelector('#btnCarrito'); // al presionar sobre el logo del carrito llamo a la función para mostrar los elementos en el carrito
const btnVaciarCarrito = document.querySelector('#btnVaciarCarrito'); //boton vaciar carrito
const btnFinalizarCompra = document.querySelector('#btnFinalizarCompra'); //boton para finalizar compra
const contenedorCarrito = document.querySelector('#contenedorCarrito'); // contenedor donde se muestran los productos en la venta de carrito

//Evento de boton para mostrar carrito
btnCarrito.addEventListener('click', async () => {
	let cartId;
	//fetch para obtener datos de la sesion actual
	await fetch('/api/sessions/current')
		.then((res) => res.json())
		.then((data) => {
			cartId = data.cartId;
		});
	//fetch para mostrar el carrito seleccionado
	await fetch(`/api/carts/${cartId}`)
		.then((res) => res.json())
		.then((data) => {
			agregarElmentoCarrito(data);
		});
});

//Función para mostrar en pantalla los productos que van siendo agregados al carrito
function agregarElmentoCarrito(dato) {
	if (dato.length > 0) {
		contenedorCarrito.innerText = ''; // Borro leyenda "Agregue productos al carrito"
	}

	
	if (!dato.length) {
		contenedorCarrito.innerHTML = ''; //borro prodcutos de la vista
		contenedorCarrito.innerText = 'Agregue productos al carrito';
		btnVaciarCarrito.disabled = true; //desactivo boton de vaciar carrito si el mismo esta vacio
		btnFinalizarCompra.hidden = true; // escondo boton para finalizar compra.
		checkout.hidden = true;
	} else {
		btnVaciarCarrito.disabled = false; //sino vuelvo a activar
		btnFinalizarCompra.hidden = false; // y mostrar boton
		checkout.hidden = false;
	}

	dato.forEach((elemento) => {
		//Por cada elemento genero un contenedor
		let div = document.createElement('div');
		div.className = 'card mb-2 d-flex align-item-center justify-content-center';
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
btnVaciarCarrito.addEventListener('click', async () => {
	let cartId;
	///fetch para obtener datos de la sesion actual
	await fetch('/api/sessions/current')
		.then((res) => res.json())
		.then((data) => {
			cartId = data.cartId;
		});
	//alert para confirmar el borrado
	Swal.fire({
		title: 'Esta seguro?',
		text: 'No podra volver atras!',
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#212529',
		cancelButtonColor: '#dc3545',
		confirmButtonText: 'Si, deseo borrar!',
	}).then(async (result) => {
		if (result.isConfirmed) {
			//fetch a ruta para eliminar productos
			await fetch(`/api/carts/${cartId}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
			});
			//Alert con la confirmación del borrado
			Swal.fire('Borrado!', 'Su carrito ha sido borrado.', 'success');
			contenedorCarrito.innerHTML = ''; //borro prodcutos de la vista
			contenedorCarrito.innerText = 'Agregue productos al carrito';
			btnVaciarCarrito.disabled = true;
			btnFinalizarCompra.hidden = true;
		}
	});
});

//Evento de boton para finalizar la compra
btnFinalizarCompra.addEventListener('click', async () => {
	let email;
	let cartId;
	let unpurchasedProducts = [];
	//fetch para obtener datos de la sesion actual
	await fetch('/api/sessions/current')
		.then((res) => res.json())
		.then((data) => {
			email = data.email;
			cartId = data.cartId;
		});

	//alert para confirmar operación
	Swal.fire({
		title: 'Realmente desea finalizar la compra?',
		icon: 'question',
		showCancelButton: true,
		confirmButtonColor: '#212529',
		cancelButtonColor: '#dc3545',
		confirmButtonText: 'Si, finalizar!',
	}).then(async (result) => {
		if (result.isConfirmed) {
			//cuando se confirma operación realizo fetch para generar ticket de compra
			await fetch(`/api/carts/${cartId}/purchase`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email }),
			})
				.then((res) => res.json())
				.then(async (response) => {

					//recupero el listado de productos que no se tenia stock
					response.notStock.map(async (id)=>{
						await fetch(`/api/products/${id}`)
							.then((res) => res.json())
							.then((data) => {
								unpurchasedProducts.push(data)
							});
					})
					//envio email solo si tengo productos que pude comprar
					if (response.newTicket.amount) {
						await fetch(`/email`, {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify(response),
						});
					}
					console.log(unpurchasedProducts);
					console.log(unpurchasedProducts.length)
					//alert con confirmación de operación
					Swal.fire({
						title: 'Enviaremos su orden por mail!, Realice el pago para terminar la compra!',
						text:
							unpurchasedProducts.length != 0
								? 'Muchas Gracias, vuelva pronto. Lamentablemente no contamos con el stock solicitado en los productos que quedaron en el carrito'
								: 'Muchas Gracias, vuelva pronto.',
						icon: 'success',
						confirmButtonColor: '#212529',
					}).then((result) => {
						/* Read more about isConfirmed, isDenied below */
						if (result.isConfirmed) {
							window.location.replace('/products');
						}
					});
				});
		}
	});
});
