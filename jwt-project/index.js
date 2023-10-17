const http = require("http");
const https = require("https");
const app = require("./app");
const fs = require("fs");

const allowedOrigins = ["https://localhost:4200"]; 

// server.on("request", (req, res) => {
//   const origin = req.headers.origin;
//   if (allowedOrigins.includes(origin)) {
//     res.setHeader("Access-Control-Allow-Origin", origin);
//   }

//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");


//   app(req, res);
// });

const port = 3200;

const options = {
  key: fs.readFileSync("keys/privkey.pem"),
  cert: fs.readFileSync("keys/fullchain.pem")
}

const server = https.createServer(options, app);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});