const express = require('express');
const router = express.Router();
const Panier = require('../../models/Panier');
const Produit = require('../../models/Produit');

// Add a product to the cart
router.post('/ajouter', async (req, res) => {
  const { idVisiteur, produitId, quantity } = req.body;

  try {
    // Find the product by ID
    const produit = await Produit.findById(produitId);
    if (!produit) {
      return res.status(404).send({ error: 'Product not found' });
    }
    if (produit.Stock < quantity) {
      return res.status(400).send({ error: `Insufficient stock. Only ${produit.Stock} left.` });
    }

    const totalPrice = produit.prix * quantity;

    // Find or create a cart for the visitor
    let panier = await Panier.findOne({ idVisiteur });

    if (!panier) {
      // If no cart exists, create a new one
      panier = new Panier({
        idVisiteur,
        produits: [{ produit: produitId, quantity, totalPrice }],
        totalAmount: totalPrice
      });
    } else {
      // If a cart exists, add the product and update the total amount
      panier.produits.push({ produit: produitId, quantity, totalPrice });
      panier.totalAmount += totalPrice;
    }

    // Deduct stock from the product
    produit.Stock -= quantity;

    // Save changes
    await produit.save();
    await panier.save();

    res.status(201).send(panier);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get a cart by visitor ID
router.get('/:idVisiteur', async (req, res) => {
  try {
    const panier = await Panier.findOne({ idVisiteur: req.params.idVisiteur }).populate('produits.produit');
    if (!panier) {
      return res.status(404).send({ error: 'Cart not found' });
    }
    res.status(200).send(panier);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a cart (e.g., change quantity for a product)
router.patch('/:id', async (req, res) => {
  const { produitId, quantity } = req.body;

  try {
    const panier = await Panier.findById(req.params.id).populate('produits.produit');
    if (!panier) {
      return res.status(404).send({ error: 'Cart not found' });
    }

    const produitIndex = panier.produits.findIndex(p => p.produit._id.toString() === produitId);
    if (produitIndex === -1) {
      return res.status(404).send({ error: 'Product not found in cart' });
    }

    const produit = panier.produits[produitIndex].produit;

    if (produit.Stock + panier.produits[produitIndex].quantity < quantity) {
      return res.status(400).send({ error: `Insufficient stock. Only ${produit.Stock} left.` });
    }

    // Adjust stock and quantities
    produit.Stock += panier.produits[produitIndex].quantity - quantity;
    panier.produits[produitIndex].quantity = quantity;
    panier.produits[produitIndex].totalPrice = produit.prix * quantity;
    panier.totalAmount = panier.produits.reduce((sum, item) => sum + item.totalPrice, 0);

    await produit.save();
    await panier.save();

    res.status(200).send(panier);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a cart
router.delete('/:id', async (req, res) => {
  try {
    const panier = await Panier.findByIdAndDelete(req.params.id);
    if (!panier) {
      return res.status(404).send({ error: 'Cart not found' });
    }
    res.status(200).send({ message: 'Cart deleted successfully', panier });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
