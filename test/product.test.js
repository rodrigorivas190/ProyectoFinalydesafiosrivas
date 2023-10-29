import chai from 'chai';
import supertest from 'supertest';
import environment from '../src/config/environment.js';

const expect = chai.expect;
const request = supertest('http://localhost:8080');

describe('Test de integracion - Productos', () => {
	let authTokenCookie;
	let productId;

	it('Verificando listado de productos', async () => {
		const response = await request.get('/api/products')
		expect(response.status).to.equal(200);
		expect(response.body.status).to.be.ok.and.equal('success');
	});

	it('Verificando creación de producto', async () => {
		const product = {
			title: 'El mago enamorado',
			description: 'Novelas De Amor',
			code: '357',
			price: 2540,
			status: true,
			stock: 15,
			category: 'general',
			thumbnail: ['https://picsum.photos/200'],
		};

		const user = {
			username: environment.adminName,
			password: environment.adminPassword,
		};
		const response = await request.post('/api/users/auth').send(user);
		authTokenCookie = response.headers['set-cookie'];
		const {_body} = await request.post('/api/products').set('Cookie',authTokenCookie).send(product);
		productId= _body.payload._id;
		expect(_body.status).to.be.ok.and.equal('success');
		expect(_body.payload).to.have.property('_id');
	});

	it('Verificando buscar producto por su ID', async () => {
		const response = await request.get(`/api/products/${productId}`);
		expect(response.body).to.have.property('_id');
	});

	it('Verificando modificar producto', async () => {
		const product = {
			title: 'El mago enamorado',
			description: 'Novelas De Amor',
			code: '357',
			price: 2660,
			status: true,
			stock: 152,
			category: 'general',
			thumbnail: ['https://picsum.photos/200'],
		};

		const response = await request.put(`/api/products/${productId}`).set('Cookie', authTokenCookie).send(product);
		expect(response.body.status).to.be.ok.and.equal('success');
	});
	
	after(async () => {
		const { _body } = await request.delete(`/api/products/${productId}`).set('Cookie',authTokenCookie);
		// expect(_body.status).to.be.ok.and.equal('success');

		const response = await request.post(`/api/users/logout`);
		// Obtiene las cookies de la respuesta
		const cookies = response.headers['set-cookie'];
		// Encuentra la cookie 'token' en las cookies
		let tokenCookie;
		if (cookies) {
			for (const cookie of cookies) {
				if (cookie.startsWith('token=')) {
					tokenCookie = cookie;
					break;
				}
			}
		}
	});
});
