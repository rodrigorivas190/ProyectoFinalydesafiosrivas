/* User info*/
export const generateUserErrorInfo = (user) => {
	return `
    One or more properties were incomplete or not valid. List of required properties:
    *first_name : needs to be string, received ${user.name} 
    *last_name  : needs to be string, received ${user.lastname} 
    *email      : needs to be string, received ${user.email}`;
};

/*Product Info */
export const generateAddProductErrorInfo = (product) => {
	return `Product Creation Error: One or more properties were incomplete or not valid. List of required properties:
    *tittle      : needs to be string, received ${product.title} 
    *description : needs to be string, received ${product.description} 
    *code        : needs to be string, received ${product.code}
    *price       : needs to be number, received ${product.price}
    *status      : needs to be boolean, received ${product.status}
    *stock       : needs to be number, received ${product.stock}
    *category    : needs to be string, received ${product.category}
    *thumbnail   : needs to be array, received ${product.thumbnail}`;
};

export const generateDuplicatedProductErrorInfo = (code) => {
	return `Product Creation Error: Product ${code} already exist!`;
};

export const generateUpdateErrorInfo = (productId) => {
	return `Product Updating Error: One or more properties were incomplete or not valid. List of required properties:
    *ID : needs to be string, received ${productId} `;
};

export const generateDeleteProductErrorInfo = (productId) => {
	return `Product Deleting Error: Product ${productId} noy found!`;
};

/*Cart Info */
export const generateAddProductToCartErrorInfo = (productData) => {
	return `Adding product to cart Error: One or more properties were incomplete or not valid. List of required properties:
    *Cart ID    : needs to be string, received ${productData.cartId} 
    *Product ID : needs to be string, received ${productData.productId} `;
};
