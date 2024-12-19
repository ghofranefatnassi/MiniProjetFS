const express = require('express');
const router = express.Router();  // Define the router object
const Commande = require('../../models/Commande'); // Assuming you have a Commande model
const Panier = require('../../models/Panier'); // Assuming you have a Panier model for the cart

// Handle order creation
router.post('/commande', async (req, res) => {
  const { idVisiteur, cart } = req.body;

  if (!cart || cart.length === 0) {
    return res.status(400).send({ message: 'Cart is empty' });
  }

  // Calculate the total amount of the cart
  let totalAmount = 0;
  cart.forEach(item => {
    totalAmount += item.price * item.quantity;
  });

  // Create the new order (commande)
  const commande = new Commande({
    idVisiteur,
    date: new Date(),
    statut: 'en cours', // You can set this as pending or 'completed' depending on your order flow
    totalAmount,
    cart, // Store the cart items
  });

  try {
    const savedCommande = await commande.save();

    // Optionally, you can clear the cart from the database if needed
    await Panier.deleteOne({ idVisiteur }); // If you're using a Panier model to store the cart

    res.status(201).send(savedCommande); // Return the created order
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router; // Export the router
