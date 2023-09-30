import { cartDAO } from '../../dao/factory.js';
import CartRepository from './cart.repository.js';

export const CartService = new CartRepository(cartDAO);
