//importación de service.
import TicketService from '../service/ticket.service.js';

//Importación de controllers adicionales
import cartController from './cart.controller.js';
import productController from './product.controller.js';

//importación de libreria de dating
import { DateTime } from 'luxon';

class TicketController {
	constructor() {
		this.service = new TicketService();
	}

	//Método para agregar un nuevo ticket
	async createTicket(cartId, userEmail) {
		let cart = await cartController.getCartById(cartId); //obtengo carrito con el que voy a trabajar
		let notStock = []; //array para guardar IDs de productos con el que no se cuenta stock
		let newTicket = {}; //objeto de nuevo ticket
		let str = 'T'; //variable para armar el codigo de ticket
		let auxiliar = cart.map((el) => {
			//recorro el array de prodcutos dentro del carrito
			let resta = el.product.stock - el.quantity; //compruebo stock
			if (resta < 0) {
				//si no hay stock
				notStock.push(el.product._id); //guardo id de producto
				return 0; //retorno 0 para sumar el monto total
			} else {
				el.product.stock -= el.quantity; //resto del stock la cantidad seleccionada
				productController.updateProduct(el.product._id, el.product); //actualizo el stock en el producto
				cartController.deleteProduct(cartId, el.product._id); //elimino el producto del carrito
				return el.quantity * el.product.price; //retorno el subtotal
			}
		});

		let totalAmount = auxiliar.reduce((acumulador, elemento) => acumulador + elemento, 0); //calculo el monto total de la compra

		//contruyo nuevo ticket
		newTicket = {
			code: str.concat(Math.floor(Math.random() * 1000000000 + 1).toString()), //genero un codigo aleatorio
			purchase_datetime: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS),
			amount: totalAmount,
			purchaser: userEmail,
		};

		if (totalAmount) await this.service.createTicket(newTicket); // genero un ticket solo si puedo comprar productos

		return { notStock, newTicket }; //retorno los productos sin stock y el nuevo ticket para luego mandarlo por email
	}

	//Método adquirir un ticket por id
	async getTicketById(idBuscado) {
		return await this.service.getTicketById(idBuscado);
	}

	//Método para eliminar un ticket
	async deleteTicket(idBuscado) {
		return this.service.deleteTicket(idBuscado);
	}
}

//Instancio una nueva clase de Ticket Controller
const ticketController = new TicketController();

export default ticketController;

/* */
