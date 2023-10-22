const jwt = require("jsonwebtoken");
const { secretKey } = require('../routes/auth');
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
/*
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token was passed.' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token.' });
    }
    req.user = decoded;
    next();
  });
};
*/
/*
app.get("/user/verifyToken", (req, res) => {
let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
let jwtSecretKey = process.env.JWT_SECRET_KEY;

try {
  const token = req.header(tokenHeaderKey);

  const verified = jwt.verify(token, jwtSecretKey);
  if(verified){
      return res.send("Successfully Verified");
  }else{
      // Access Denied
      return res.status(401).send(error);
  }
} catch (error) {
  // Access Denied
  return res.status(401).send(error);
}
})
*/
module.exports = verifyToken;