const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const Visiteur = require('../../models/Visiteur');
const { isAuth } = require('../../middelware/authVis');

// @route POST /api/visiteurs/register
// @desc Register a new visitor
// @access Public
router.post('/register', (req, res) => {
    const { nomVis, emailVis, motDePasseVis } = req.body;

    // Check if all required fields are provided
    if (!nomVis || !emailVis || !motDePasseVis) {
        return res.status(400).json({ status: 'notok', msg: 'Please enter all required fields' });
    }

    // Check if email already exists
    Visiteur.findOne({ emailVis }).then(visiteur => {
        if (visiteur) {
            return res.status(400).json({ status: 'notokmail', msg: 'Email already exists' });
        }

        // Create new visitor instance
        const newVisiteur = new Visiteur({
            nomVis,
            emailVis,
            motDePasseVis
        });

        // Hash the password before saving
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                return res.status(500).json({ status: 'error', msg: 'Internal server error' });
            }

            bcrypt.hash(newVisiteur.motDePasseVis, salt, (err, hash) => {
                if (err) {
                    return res.status(500).json({ status: 'error', msg: 'Internal server error' });
                }

                newVisiteur.motDePasseVis = hash;  // Save hashed password
                newVisiteur.save()
                    .then(visiteur => {
                        // Generate JWT token
                        jwt.sign(
                            { id: visiteur.id },
                            config.get('jwtSecret'),
                            { expiresIn: '30d' }, // Token expires in 30 days
                            (err, token) => {
                                if (err) {
                                    return res.status(500).json({ status: 'error', msg: 'Internal server error' });
                                }
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
                        return res.status(500).json({ status: 'error', msg: 'Internal server error' });
                    });
            });
        });
    }).catch(err => {
        return res.status(500).json({ status: 'error', msg: 'Internal server error' });
    });
});

// @route POST /api/visiteurs/login
// @desc Login visitor
// @access Public
router.post('/login', (req, res) => {
    const { emailVis, motDePasseVis } = req.body;

    if (!emailVis || !motDePasseVis) {
        return res.status(400).json({ error: 'Please provide email and password' });
    }

    // Find visitor by email
    Visiteur.findOne({ emailVis }).then(visiteur => {
        if (!visiteur) {
            return res.status(401).json({ error: 'Visiteur not found' });
        }

        // Compare password
        bcrypt.compare(motDePasseVis, visiteur.motDePasseVis).then(isMatch => {
            if (!isMatch) {
                return res.status(401).json({ error: 'Incorrect password' });
            }

            // Generate JWT token
            jwt.sign(
                { id: visiteur.id },
                config.get('jwtSecret'),
                { expiresIn: '30d' }, // Token expires in 30 days
                (err, token) => {
                    if (err) {
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
            return res.status(500).json({ error: 'Internal server error' });
        });
    }).catch(err => {
        return res.status(500).json({ error: 'Internal server error' });
    });
});

// @route GET /api/visiteurs/me
// @desc Get current user data
// @access Private (Protected by JWT)
router.get('/me', isAuth, (req, res) => {
    res.json({
      message: 'This is a protected route',
      user: req.user,
    });
  });

module.exports = router;
