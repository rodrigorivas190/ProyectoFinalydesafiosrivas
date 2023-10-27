import chai from 'chai';
import supertest from 'supertest';

const expect = chai.expect;
const request = supertest('http://localhost:8080');



describe('Test de integracion - Sesiones', () => {
	let userId = "";
	let cartId;

	it('Verificación de crer Usuario', async () => {
		const user = {
			first_name: 'Rodrigo',
			last_name: 'Rivas',
			email: 'rodrigomrivas190@gmail.com',
			password: '1234',
		};

		const {_body} =  await request.post('/api/users').send(user)
		userId = _body.payload._id;
		cartId = _body.payload.cartId;
		expect(_body.payload).to.have.property('_id');		
	});

	it('Verificando inicio de sesion (USO DE COOKIE)',async() => {
		const user = {
			username: 'rodrigomrivas190@gmail.com',
			password: '1234',
		};
		const response = await request.post('/api/users/auth').send(user)
		// Verifica el estado de la respuesta
		expect(response.status).to.equal(200);

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

		// Verifica que la cookie 'token' se haya establecido correctamente
		expect(tokenCookie).to.exist;
		// Parseo la cookie para obtener el valor del token
		const tokenValue = tokenCookie.split('=')[1].split(';')[0];

		// Verifico
		expect(tokenValue).to.be.ok;
	});

	it('Verificando actualizar el rol de un usuario de user a premium y viceversa', async () => {
		const { _body } = await request.get(`/api/users/premium/${userId}`)
		expect(_body.status).to.be.ok.and.equal('success');
	});

	after(async () => {
		const { _body } = await request.delete(`/api/users/${userId}`);
		expect(_body.status).to.be.ok.and.equal('success');
		
		const userResponse = await request.post(`/api/users/logout`);
		const cartResponse = await request.delete(`/api/carts/delete/${cartId}`);
		expect(cartResponse._body.status).to.be.ok.and.equal('success');
		// Obtiene las cookies de la respuesta
		const cookies = userResponse.headers['set-cookie'];
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
		// Parseo la cookie para obtener el valor del token
		const tokenValue = tokenCookie.split('=')[1].split(';')[0];
		// Verifica que la cookie 'token' se haya borrado
		expect(tokenValue).to.be.equal("");
		
	});

});
