const mongoose = require('mongoose');

const CommandeSchema = new mongoose.Schema({
  idVisiteur: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Visiteur', 
    required: true 
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
  statut: { 
    type: String, 
    default: 'en cours' // You can change this based on the order status, e.g., 'completed', 'pending'
  },
  totalAmount: { 
    type: Number, 
    required: true 
  }, 
  // Array of cart items
  cart: [{
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Assuming you have a 'Product' model
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }, // The price at the time of purchase (in case the product price changes later)
  }]
});

module.exports = mongoose.model('Commande', CommandeSchema);
