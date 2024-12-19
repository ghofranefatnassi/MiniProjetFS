const jwt = require('jsonwebtoken');
const config = require('config');

// Generate Token
const getToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      nomVis: user.nomVis,
      emailVis: user.emailVis,
    },
    config.get('jwtSecret'),  // Use the secret from config
    {
      expiresIn: '48h',
    }
  );
};

// Middleware to check if user is authenticated
const isAuth = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    const onlyToken = token.slice(7, token.length); // Remove 'Bearer ' from the token
    jwt.verify(onlyToken, config.get('jwtSecret'), (err, decode) => { // Use config.get('jwtSecret')
      if (err) {
        return res.status(401).send({ message: 'Invalid Token' });
      }
      req.user = decode; // Attach decoded user to the request object
      next();
      return;
    });
  } else {
    return res.status(401).send({ message: 'Token is not supplied.' });
  }
};

module.exports = { getToken, isAuth };
