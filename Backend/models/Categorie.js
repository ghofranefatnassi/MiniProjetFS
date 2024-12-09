const mongoose = require('mongoose'); 
const CategorieSchema = new mongoose.Schema({ 
    nomCat: { type: String, required: true } }); 
    module.exports = mongoose.model('Categorie', CategorieSchema);