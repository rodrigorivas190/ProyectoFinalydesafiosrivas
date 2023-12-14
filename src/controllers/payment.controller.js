import Stripe from "stripe";


import environment from '../config/environment.js';


const stripe = new Stripe(environment.keyStripePrivate);

export const createSession = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
            line_items: [
        {
          price_data: {
            product_data: {
              name: "Un corazon valiente",
            },
            currency: "usd",
            unit_amount: 10000,
          },
          quantity: 1,
        },
        {
          price_data: {
            product_data: {
              name: "Las huellas del mal",
            },
            currency: "usd",
            unit_amount: 9875,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "https://proyectofinalydesafiosrivas-production-f97c.up.railway.app/success",
      cancel_url: "https://proyectofinalydesafiosrivas-production-f97c.up.railway.app/cancel",
    });

    console.log(session);
    return res.json({ url: session.url });
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};



