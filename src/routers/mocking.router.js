import { Router } from 'express';
import { generateProducts } from '../utils/mocking.util.js';

const mockingRouter = Router();

mockingRouter.get('/', async (req, res) => {
	let mockingProducts = [];
	try {
		for (let i = 0; i < 100; i++) {
			mockingProducts.push(generateProducts());
		}
		res.send({ status: 'success', payload: mockingProducts });
	} catch (error) {
		res.status(400).send(error);
	}
});

export { mockingRouter };
