//DTO para pasar información de forma segura sin filtrar algo sensible
export default class UserDTO {
	constructor(user) {
		this.first_name = user.first_name;
		this.last_name = user.last_name;
		this.email = user.email;
		this.cartId = user.cartId;
		this.password = user.password;
		this.role = user.role;
	}
}
