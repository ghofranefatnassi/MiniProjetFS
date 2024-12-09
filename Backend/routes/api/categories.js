const express = require('express');
const router = express.Router();
const Categorie = require('../../models/Categorie');

// Add a category
router.post('/ajouter', async (req, res) => {
    const { nomCat } = req.body;
    const categorie = new Categorie({ nomCat });
    try {
      await categorie.save();
      res.status(201).send(categorie);
    } catch (error) {
      res.status(400).send(error);
    }
  });

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Categorie.find();
    res.status(200).send(categories);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a category
router.patch('/:id', async (req, res) => {
  try {
    const categorie = await Categorie.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!categorie) {
      return res.status(404).send();
    }
    res.send(categorie);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a category
router.delete('/:id', async (req, res) => {
  try {
    const categorie = await Categorie.findByIdAndDelete(req.params.id);
    if (!categorie) {
      return res.status(404).send();
    }
    res.send(categorie);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
