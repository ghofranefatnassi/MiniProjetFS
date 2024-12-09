const mongoose = require('mongoose');

const ProduitSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  description: String,
  prix: { type: Number, required: true },
  Stock: { type: Number, required: true },
  idCategorie: { type: mongoose.Schema.Types.ObjectId, ref: 'Categorie', required: true },
  photo: { type: String, required: false }
});

module.exports = mongoose.model('Produit', ProduitSchema);
