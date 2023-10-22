//obtengo todos los botens editar y eliminar
let btnEditProduct = document.querySelectorAll('.btnEditProduct'); // NodeList = [button#1, button#2 .... , button#n] array con todos los botones
let btnDeleteProduct = document.querySelectorAll('.btnDeleteProduct'); // NodeList = [button#1, button#2 .... , button#n] array con todos los botones

//Inputs de modificar productos
let inputTitle = document.getElementById('inputTitle');
let inputDescription = document.getElementById('inputDescription');
let inputCode = document.getElementById('inputCode');
let inputPrice = document.getElementById('inputPrice');
let inputStatus = document.getElementById('inputStatus');
let inputStock = document.getElementById('inputStock');
let inputCategory = document.getElementById('inputCategory');
let inputThumbnail = document.getElementById('inputThumbnail');

//Inputs de agregar producto
let inputTitleAdd = document.getElementById('inputTitleAdd');
let inputDescriptionAdd = document.getElementById('inputDescriptionAdd');
let inputCodeAdd = document.getElementById('inputCodeAdd');
let inputPriceAdd = document.getElementById('inputPriceAdd');
let inputStatusAdd = document.getElementById('inputStatusAdd');
let inputStockAdd = document.getElementById('inputStockAdd');
let inputCategoryAdd = document.getElementById('inputCategoryAdd');
let inputThumbnailAdd = document.getElementById('inputThumbnailAdd');

//Boton de confirmar agregar y modificar producto
let btnSaveUpdatedProduct = document.getElementById('btnSaveUpdatedProduct');
let btnConfirmAddProduct = document.getElementById('btnConfirmAddProduct');

//variables globales
let productId;
let productDeleteId;

//Evento de boton para editar productos
btnEditProduct.forEach((el) => {
	//por cada boton agrego elevento
	el.addEventListener('click', async (e) => {
		//obtengo el id del producto que agregue en el boton
		let str = e.target.id
		let parts = str.split("btnEdit")
		productId = parts[1]
		let product
		
		//fetch para obtener el producto
		await fetch(`/api/products/${productId}`)
			.then((res) => res.json())
			.then((data) => {
				product = data
			});
		//agrego los valores a los inputs para luego modificarlos
		inputTitle.value = product.title;
		inputDescription.value = product.description;
		inputCode.value = product.code;
		inputPrice.value = product.price;
		inputStatus.value = product.status;
		inputStock.value = product.stock;
		inputCategory.value = product.category;
		inputThumbnail.value = product.thumbnail;
	});
});

//Evento de boton para borrar productos
btnDeleteProduct.forEach((el) => {
	//por cada boton agrego elevento
	el.addEventListener('click', async (e) => {
		//obtengo el id del producto que agregue en el boton
		let str = e.target.id;
		let parts = str.split('btnDelete');
		productDeleteId = parts[1];

		//alert para confirmar el borrado
		Swal.fire({
			title: 'Esta seguro que desea eliminar producto?',
			text: 'No podra volver atras!',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#212529',
			cancelButtonColor: '#dc3545',
			confirmButtonText: 'Si, deseo borrar!',
		}).then(async (result) => {
			if (result.isConfirmed) {
				//fetch a ruta para eliminar productos
				await fetch(`/api/products/${productDeleteId}`, {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
					},
				})	.then((res) => res.json())
					.then(async (data) => {
						let responseObj = {
							email: data.prodToDel.owner,
							product: data.prodToDel,
						};
						//fetch para enviar email dando aviso que el producto fue eliminado
						await fetch(`/email/deleteproduct`, {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify(responseObj),
						});
					});
				//Alert con la confirmación del borrado
				Swal.fire({
					title: 'Producto borrado!',
					icon: 'success',
					confirmButtonColor: '#212529',
				}).then((result) => {
					if (result.isConfirmed) {
						window.location.replace('/masterproducts');
					}
				});
			}
		});
	});
});

//evento de boton para guardar el producto modificado
btnSaveUpdatedProduct.addEventListener('click', async (e) => {
	//guardo los valores de los inputs
	let newProduct = {
		title: inputTitle.value,
		description: inputDescription.value,
		code: inputCode.value,
		price: inputPrice.value,
		status: inputStatus.value,
		stock: inputStock.value,
		category: inputCategory.value,
		thumbnail: inputThumbnail.value,
	};

	//fetch para modificar el producto
	await fetch(`/api/products/${productId}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(newProduct),
	});
	//alert con confirmación de operación
	Swal.fire({
		title: 'Producto actualizado!',
		icon: 'success',
		confirmButtonColor: '#212529',
	}).then((result) => {
		if (result.isConfirmed) {
			window.location.replace('/masterproducts');
		}
	});
});

//boton para confirmar el agregado del producto
btnConfirmAddProduct.addEventListener('click', async (e) => {
	//obtengo los valores de los inputs
	let newProduct = {
		title: inputTitleAdd.value,
		description: inputDescriptionAdd.value,
		code: inputCodeAdd.value,
		price: parseInt(inputPriceAdd.value),
		status: inputStatusAdd.value,
		stock: parseInt(inputStockAdd.value),
		category: inputCategoryAdd.value,
		thumbnail: inputThumbnailAdd.value,
	};

	//fetch para agregar el producto a la base de datos
	await fetch(`/api/products/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(newProduct),
	})
		.then((response) => response.json())
		.then((data) => {
			if (data.status === 'success') {
				//alert con confirmación de operación
				Swal.fire({
					title: 'Producto agregado correctamente!',
					icon: 'success',
					confirmButtonColor: '#212529',
				}).then((result) => {
					//cuando obtengo la respuesta redirijo
					if (result.isConfirmed) {
						window.location.replace('/masterproducts');
					}
				});
			}
			if (data.status === 'error') {
				//sino, indico error
				Swal.fire({
					icon: 'error',
					title: 'Oops...',
					text: `${data.message}`,
				});
			}
		});
});