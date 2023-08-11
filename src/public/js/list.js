const selectSort = document.getElementById("selectSort");

selectSort.addEventListener("change", () => {
  const limit = document.getElementById("limit").value;
  const page = document.getElementById("page").value;
  const sort = selectSort.value;

  const url = `/productsList?limit=${limit}&page=${page}&sort=${sort}`;
  
  // Cambiar la ubicación de la página
  window.location.href = url;
});
