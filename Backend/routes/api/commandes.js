const express = require('express');
const router = express.Router();
const Commande = require('../../models/Commande');

// Add an order
router.post('/commande', async (req, res) => {
  const { idVisiteur, date, statut } = req.body;
  const commande = new Commande({ idVisiteur, date, statut });
  try {
    await commande.save();
    res.status(201).send(commande);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get orders by visitor ID
router.get('/:idVisiteur', async (req, res) => {
  try {
    const commandes = await Commande.find({ idVisiteur: req.params.idVisiteur });
    res.status(200).send(commandes);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update an order
router.patch('/:id', async (req, res) => {
  try {
    const commande = await Commande.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!commande) {
      return res.status(404).send();
    }
    res.send(commande);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete an order
router.delete('/:id', async (req, res) => {
  try {
    const commande = await Commande.findByIdAndDelete(req.params.id);
    if (!commande) {
      return res.status(404).send();
    }
    res.send(commande);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
