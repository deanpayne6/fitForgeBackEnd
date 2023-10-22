const jwt = require("jsonwebtoken");
const secretKey = require('../config/secretKey');
const config = process.env;


const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  try {
    const data = jwt.verify(token, secretKey);
    req.userId = data.id;
    return next();
  } catch (error) {
      return res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = verifyToken;