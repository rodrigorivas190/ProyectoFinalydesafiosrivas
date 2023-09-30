import { faker } from '@faker-js/faker';

export const generateProducts = () => {
	return {
		title: faker.commerce.productName(),
		description: faker.commerce.productDescription(),
		code: faker.number.int({ min: 10, max: 1000 }),
		price: faker.number.int({ min: 50, max: 1000 }),
		status: true,
		stock: faker.number.int({ min: 10, max: 200 }),
		category: faker.commerce.productMaterial(),
		thumbnail: faker.image.url(),
	};
};
