const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const Produit = require('../../models/Produit');



// Set up storage engine for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Directory where files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Unique filename based on timestamp
  }
});

// Initialize multer with storage settings
const upload = multer({ storage: storage });

// Add a product with an image
router.post('/ajouter', upload.single('photo'), async (req, res) => {
  const { nom, description, prix, idCategorie,Stock } = req.body;
  const photo = req.file ? `/uploads/${req.file.filename}` : '';  // Save photo path

  const produit = new Produit({
    nom,
    description,
    prix,
    idCategorie,
    photo,
    Stock
  });

  try {
    await produit.save();
    res.status(201).send(produit);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const produits = await Produit.find();
    res.status(200).send(produits);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get products by name search
router.get('/search', async (req, res) => {
  const { nom } = req.query;
  try {
    const produits = await Produit.find({ nom: new RegExp(nom, 'i') });
    res.status(200).send(produits);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a product
router.patch('/:id', upload.single('photo'), async (req, res) => {
  const { nom, description, prix, idCategorie, Stock } = req.body;
  // If a new photo is uploaded, use its path; otherwise, keep the existing photo path
  const photo = req.file ? `/uploads/${req.file.filename}` : req.body.photo;

  try {
    const produit = await Produit.findByIdAndUpdate(req.params.id, {
      nom,
      description,
      prix,
      idCategorie,
      Stock,
      photo,  // Update photo with new file or keep the previous one
    }, { new: true, runValidators: true });

    if (!produit) {
      return res.status(404).send();
    }
    res.send(produit);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const produit = await Produit.findByIdAndDelete(req.params.id);
    if (!produit) {
      return res.status(404).send();
    }
    res.send(produit);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/low-stock', async (req, res) => {
  try {
    const produits = await Produit.find({ Stock: { $lt: 5 } });
    res.status(200).send(produits);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/category/:idCategorie', async (req, res) => {
  const { idCategorie } = req.params;
  try {
    // Find products that match the category ID
    const produits = await Produit.find({ idCategorie });
    // If no products are found, return a 404 response
    if (produits.length === 0) {
      return res.status(404).send({ message: "No products found in this category" });
    }
    res.status(200).send(produits);
  } catch (error) {
    res.status(500).send({ message: "Server error", error });
  }
});
router.get('/category/:category', async (req, res) => {
  const { category } = req.params;

  let filter = {};
  
  // Try to find category by ID (assuming ID is a valid ObjectId)
  if (mongoose.Types.ObjectId.isValid(category)) {
    filter = { idCategorie: category };  // When category is an ObjectId
  } else {
    filter = { idCategorie: category };  // If category is a name, you can check based on name (adjust if necessary)
  }

  try {
    const produits = await Produit.find(filter);
    res.status(200).send(produits);
  } catch (error) {
    res.status(500).send(error);
  }
});
router.get('/category/:nomCat', async (req, res) => {
  const { nomCat } = req.params;
  try {
    const produits = await Produit.find({ idCategorie: nomCat });
    res.status(200).send(produits);
  } catch (error) {
    res.status(500).send(error);
  }
});
// Get a product by its ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Find the product by its ID
    const produit = await Produit.findById(id);
    
    // If the product doesn't exist, return a 404
    if (!produit) {
      return res.status(404).send({ message: "Product not found" });
    }

    // Send the found product
    res.status(200).send(produit);
  } catch (error) {
    res.status(500).send({ message: "Server error", error });
  }
});

module.exports = router;