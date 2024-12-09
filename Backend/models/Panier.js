const mongoose = require('mongoose');

const PanierSchema = new mongoose.Schema({
  idVisiteur: { type: mongoose.Schema.Types.ObjectId, ref: 'Visiteur', required: true },
  produits: [
    {
      produit: { type: mongoose.Schema.Types.ObjectId, ref: 'Produit' },
      quantity: { type: Number, required: true },
      totalPrice: { type: Number, required: true } // Quantity * Product Price
    }
  ],
  totalAmount: { type: Number, default: 0 } // Sum of all totalPrice in produits
});

module.exports = mongoose.model('Panier', PanierSchema);
