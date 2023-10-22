const http = require("http");
const https = require("https");
const app = require("./app");
const fs = require("fs");

const allowedOrigins = ["https://localhost:4200"]; 

const port = 3200;

const options = {
  key: fs.readFileSync("keys/privkey.pem"),
  cert: fs.readFileSync("keys/fullchain.pem")
}

const server = https.createServer(options, app);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});