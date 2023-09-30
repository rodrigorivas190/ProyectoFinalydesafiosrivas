//DTO para pasar información de forma segura sin filtrar algo sensible
export default class MessageDTO {
	constructor(messageToAdd) {
		this.user = messageToAdd.user;
		this.message = messageToAdd.message;
	}
}
