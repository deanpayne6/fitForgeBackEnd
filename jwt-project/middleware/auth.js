const jwt = require("jsonwebtoken");

const config = process.env;


const { secretKey } = require('./routes/auth'); // Import your secret key fromauth

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded; // Attach user information to the request object
    next(); // pass it only if the token is correct
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

// Protected route requiring authentication
app.get('/protected', verifyToken, (req, res) => {
  // Access user information from req.user if needed
  const userId = req.user.user_id;
  // Perform actions specific to the protected route
  res.status(200).json({ message: `Welcome, user with ID: ${userId}! This is a protected route.` });
});


module.exports = verifyToken;