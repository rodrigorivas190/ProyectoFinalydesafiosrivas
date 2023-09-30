import { productDAO } from '../../dao/factory.js';
import ProductRepository from './product.repository.js';

export const ProductService = new ProductRepository(productDAO);
