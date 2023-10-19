const http = require("http");
const app = require("./app");
const server = http.createServer(app);

const allowedOrigins = ["http://localhost:4200"]; 

const port = 3200;

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});