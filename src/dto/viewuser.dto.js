//DTO para pasar información de forma segura sin filtrar algo sensible
export default class ViewUserDTO {
	constructor(user) {
		this._id = user._id;
		this.first_name = user.first_name;
		this.last_name = user.last_name;
		this.email = user.email;
		this.role = user.role;
		this.cartId = user.cartId;
		this.last_connection = user.last_connection;
	}
}
