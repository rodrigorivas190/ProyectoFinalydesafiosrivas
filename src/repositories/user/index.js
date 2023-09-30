import { userDAO } from '../../dao/factory.js';
import UserRepository from './user.repository.js';

export const UserService = new UserRepository(userDAO);
