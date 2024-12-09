const mongoose = require('mongoose');

const produitSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  prix: {
    type: Number,
    required: true
  },
  idCategorie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categorie', // assuming you have a 'Categorie' model
    required: true
  },
  photo: {
    type: String
  },
  Stock: {
    type: Number,
    required: true
  }
});

const Produit = mongoose.model('Produit', produitSchema);  // Create the model from the schema

module.exports = Produit;
