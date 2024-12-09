const mongoose = require('mongoose'); 
const VisiteurSchema = new mongoose.Schema({ 
    nomVis: { type: String, required: true }, 
    emailVis: { type: String, required: true, unique: true }, 
    motDePasseVis: { type: String, required: true } }); 
    module.exports = mongoose.model('Visiteur', VisiteurSchema);