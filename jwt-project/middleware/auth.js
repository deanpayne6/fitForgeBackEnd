const jwt = require("jsonwebtoken");
const { secretKey } = require('./routes/auth'); // Import your secret key from auth
const config = process.env;





const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
// Error Message if there is no token
  if (!token) {
    return res.status(401).json({ message: 'Error. No token was given.' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded; // Attach user information 
    next(); // pass it only if the token is correct
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
};



module.exports = verifyToken;