const mongoose = require('mongoose');

const CommandeSchema = new mongoose.Schema({
  idVisiteur: { type: mongoose.Schema.Types.ObjectId, ref: 'Visiteur', required: true },
  date: { type: Date, default: Date.now },
  statut: { type: String, default: 'en cours' },
  totalAmount: { type: Number, required: true } // Total from the cart
});

module.exports = mongoose.model('Commande', CommandeSchema);
