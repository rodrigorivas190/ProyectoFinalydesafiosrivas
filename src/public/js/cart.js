// const addProduct = (id) => {
//   const cid = "64c9d325f54c08f61e2cde00";
//   const pid = id;

//   const request = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ quantity: 1 }),
//   };

//   fetch(`/api/remote/carts/${cid}/products/${pid}`, request)
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(data);
//     })
//     .catch((err) => {
//       console.error("Error adding product to cart:", err);
//     });
// };

// const deleteProduct = (id) => {
  // const cid = "64c9d325f54c08f61e2cde00";
//   const pid = id;

//   const request = {
//     method: "DELETE",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   };

//   fetch(`/api/remote/carts/${cid}/products/${pid}`, request)
//     .then((response) => {
//       if (response.status === 204) {
//         console.log("Product successfully removed");
//       } else {
//         console.error(
//           "Error deleting the product. Status code:",
//           response.status
//         );
//       }
//     })
//     .catch((err) => {
//       console.error("Error deleting product:", err);
//     });
// };
// agregar productos al carrito
const addCart = (id) => {
  const cid = "64c9d325f54c08f61e2cde00";
  const pid = id;
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ quantity: 1 }),
  };

  fetch(`/api/carts/${cid}/product/${pid}`, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      
      console.log(data);
    })
    .catch((error) => {
      
      console.error("Error al agregar el producto al carrito:", error);
    });
};


//eliminar productos del carrito
const deleteProduct = (id) => {
  const cid = "64c9d325f54c08f61e2cde00";
  const pid = id;
  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };

  fetch(`/api/carts/${cid}/products/${pid}`, requestOptions)
  .then((response) => {
    if (response.status === 204) {
      console.log("Producto eliminado exitosamente");
    } else {
      console.error("Error al eliminar el producto. Código de estado:", response.status);
    }
  }).catch((error) => {
      console.error("Error al eliminar el producto:", error);
  });
}


// obtengo el número de productos en el carrito
// fetch("/cart/count")
//   .then((response) => response.json())
//   .then((data) => {
//     console.log(document.getElementById("countCart").textContent = data.count);
//   })
//   .catch((error) => {
//     console.error("Error al obtener el número de productos en el carrito:", error);
//   });


  