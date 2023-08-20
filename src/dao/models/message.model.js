//Esquema de mensajes para guardar en la base de datos.
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
	user: String,
	message: String,
});

export const MessageModel = mongoose.model('messages', messageSchema);
