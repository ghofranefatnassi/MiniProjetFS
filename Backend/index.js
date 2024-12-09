const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const cors = require('cors');
const users = require('./routes/api/users');
const visiteurs = require('./routes/api/visiteurs');
const categories = require('./routes/api/categories');
const produits = require('./routes/api/produits');
const paniers = require('./routes/api/paniers');
const commandes = require('./routes/api/commandes');
const app = express();
const port = process.env.PORT || 3001;
const path = require('path');
app.use(express.json());
app.use(cors());

const mongo_url = config.get('mongo_url');
mongoose.set('strictQuery', true);

// MongoDB connection
mongoose
    .connect(mongo_url)
    .then(() => console.log('MongoDB is connected...'))
    .catch(err => console.error('MongoDB connection error:', err));

// Use user routes
app.use('/api/users', users);
app.use('/api/visiteurs',  visiteurs);
app.use('/api/categories',categories);
app.use('/api/produits',produits);
app.use('/api/paniers',paniers);
app.use('/api/commandes',commandes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Start the server
app.listen(port, () => console.log(`Server running on port ${port}`));
