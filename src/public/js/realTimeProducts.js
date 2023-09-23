const socket = io(); // se levanta socket del lado del cliente

//Función para renderizar los productos
function render(data) {
	const contenedorProductos = document.getElementById('productsList');
	contenedorProductos.innerText = ''; // Borro el contenido para pintar los productos 1 vez sobreescribiendo los mismos
	data.forEach((elem) => {
		//por cada elemento genero un div y lo agrego en el body
		let div = document.createElement('div');
		div.className = 'card';
		div.innerHTML = `
					<h2>Product ID:${elem._id} </h2>
					<p>Title: ${elem.title}</p>
					<p>description: ${elem.description} </p>
					<p>code: ${elem.code} </p>
					<p>price: ${elem.price} </p>
					<p>status: ${elem.status} </p>
					<p>stock: ${elem.stock} </p>
					<p>category: ${elem.category} </p>
					<p>thumbnail: ${elem.thumbnail} </p>
				`;
		contenedorProductos.append(div); //agrego div
		
	});
}

// Escucho el evento real_time_products y renderizo los productos que recibo por parametro
socket.on('real_time_products', (data) => {
	render(data);
});
