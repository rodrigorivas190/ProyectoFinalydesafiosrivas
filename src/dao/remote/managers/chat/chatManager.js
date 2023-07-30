import ChatModel from "../../../models/model.message.js";


class ChatManager {
  saveMessage = async (message) => {
    try {
      const newMessage = await ChatModel.create(message);

      return "Message saved";
    } catch (err) {
      return err;
    }
  };

  getMessages = async () => {
    try {
      const messages = await ChatModel.find();

      return messages;
    } catch (err) {
      console.log("No messages");

      return [];
    }
  };
}

export default  ChatManager;
