import { Router } from "express";

import { createSession } from "../controllers/payment.controller.js";

const router = Router();


router.post("/create-checkout-session", createSession);


router.get('/success', (req, res) => {
  res.render('success'); 
}); 
router.get('/cancel', (req, res) => {
  res.render('cancel'); 
});

export default router;






















