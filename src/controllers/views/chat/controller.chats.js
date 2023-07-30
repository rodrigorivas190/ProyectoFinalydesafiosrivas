import ChatManager from "../../../dao/remote/managers/chat/chatManager.js";
const chatManager = new ChatManager();
import { Router } from "express";
const router = Router();

router.get("/", async (req, res) => {
  const messages = await chatManager.getMessages();
  const messagesReverse = messages.reverse();
  res.render("chat", { messages: messagesReverse });
});


export default router;
