import { Router } from 'express';
import nodemailer from 'nodemailer';

const mailRouter = Router();

const transport = nodemailer.createTransport({
	service: 'gmail',
	port: 587,
	auth: {
		user: 'rodrigomrivas190@gmail.com',
		pass: 'ihgk rxfy wcpp bavh',
	},
});

//Endpoint que envia email
mailRouter.post('/', async (req, res) => {
	try {
		let { newTicket } = req.body; //recibo por body los datos
		let result = await transport.sendMail({
			from: 'rodrigomrivas190@gmail.com',
			to: `${newTicket.purchaser}`,
			subject: `Gracias por su compra`,
			html: `
            <div>
                <h1>Nueva Compra ${newTicket.code}</h1>
                <p>compra realizada el ${newTicket.purchase_datetime}</p>
                <p>Total de la compra: $ ${newTicket.amount}</p>
            </div>
            `,
			attachments: [],
		});
		res.send(result);
	} catch (error) {
		res.status(400).send(error);
	}
});

export { mailRouter };
