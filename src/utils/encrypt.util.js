import bcrypt from 'bcrypt';

//funcion para hashear password
export const hashPassword = (password) => {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

//funcion para comparar un pasword ingresado con un hash
export const comparePassword = (user, pass) => {
	return bcrypt.compareSync(pass, user.password);
};
