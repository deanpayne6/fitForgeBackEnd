const jwt = require("jsonwebtoken");



const config = process.env;
const auth = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.sendStatus(403);
  }
  try {
    const data = jwt.verify(token, "YOUR_SECRET_KEY");
    req.userId = data.id;
    req.userRole = data.role;
    return next();
  } catch {
    return res.sendStatus(403);
  }
};

/*
const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
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