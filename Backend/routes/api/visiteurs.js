const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const Visiteur = require('../../models/Visiteur'); // Make sure this file exists

// @route POST /api/visiteurs/register
// @desc Register a new visitor
// @access Public
router.post('/register', (req, res) => {
    console.log('POST /register route hit');
    
    const { nomVis, emailVis, motDePasseVis } = req.body;

    // Check if required fields are present
    if (!nomVis || !emailVis || !motDePasseVis) {
        return res.status(400).json({ status: 'notok', msg: 'Please enter all required fields' });
    }

    // Check if email already exists
    Visiteur.findOne({ emailVis }).then(visiteur => {
        if (visiteur) {
            return res.status(400).json({ status: 'notokmail', msg: 'Email already exists' });
        }

        // Create a new Visiteur instance
        const newVisiteur = new Visiteur({
            nomVis,
            emailVis,
            motDePasseVis
        });

        // Hash the password
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                console.error('Error generating salt:', err);
                return res.status(500).json({ status: 'error', msg: 'Internal server error' });
            }

            bcrypt.hash(newVisiteur.motDePasseVis, salt, (err, hash) => {
                if (err) {
                    console.error('Error hashing password:', err);
                    return res.status(500).json({ status: 'error', msg: 'Internal server error' });
                }

                // Replace the plain password with the hashed password
                newVisiteur.motDePasseVis = hash;

                // Save the new Visiteur to the database
                newVisiteur.save()
                    .then(visiteur => {
                        // Generate JWT token
                        jwt.sign(
                            { id: visiteur.id },
                            config.get('jwtSecret'),
                            { expiresIn: config.get('tokenExpire') },
                            (err, token) => {
                                if (err) {
                                    console.error('Error generating token:', err);
                                    return res.status(500).json({ status: 'error', msg: 'Internal server error' });
                                }

                                // Send response with token
                                res.status(200).json({
                                    status: 'ok',
                                    msg: 'Successfully registered',
                                    token,
                                    visiteur
                                });
                            }
                        );
                    })
                    .catch(err => {
                        console.error('Error saving visiteur:', err);
                        return res.status(500).json({ status: 'error', msg: 'Internal server error' });
                    });
            });
        });
    }).catch(err => {
        console.error('Error finding email:', err);
        return res.status(500).json({ status: 'error', msg: 'Internal server error' });
    });
});

// @route POST /api/visiteurs/login
// @desc Login visitor
// @access Public
router.post('/login', (req, res) => {
    const { emailVis, motDePasseVis } = req.body;

    // Check if email and password are provided
    if (!emailVis || !motDePasseVis) {
        return res.status(400).json({ error: 'Please provide email and password' });
    }

    // Find the visitor by email
    Visiteur.findOne({ emailVis }).then(visiteur => {
        if (!visiteur) {
            return res.status(401).json({ error: 'Visiteur not found' });
        }

        // Compare passwords
        bcrypt.compare(motDePasseVis, visiteur.motDePasseVis).then(isMatch => {
            if (!isMatch) {
                return res.status(401).json({ error: 'Incorrect password' });
            }

            // Generate JWT token
            jwt.sign(
                { id: visiteur.id },
                config.get('jwtSecret'),
                { expiresIn: config.get('tokenExpire') },
                (err, token) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ error: 'Internal server error' });
                    }

                    res.status(200).json({
                        status: 'ok',
                        msg: 'Login successful',
                        token,
                        visiteur
                    });
                }
            );
        }).catch(err => {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        });
    }).catch(err => {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    });
});

module.exports = router;
